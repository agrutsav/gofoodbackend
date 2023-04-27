const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const jwtSecret="mynameisutsavagrawal"
router.post(                                                                            //on registering yourself
  "/createuser",
  [
    body("email").isEmail(),                                                        //checking i/p is in correct format
    body("name").isLength({ min: 5 }),
    body("password", "incorrectPassword").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt=await bcrypt.genSalt(10)
    const secPassword=await bcrypt.hash(req.body.password,salt)                          //securing the password
    try {
      await User.create({                                                               //pushing in database
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPassword,
      }).then(res.json({ success: true }));
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(                                                                       //checking data on logging
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "incorrectPassword").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res
          .status(400)
          .json({ errors: "Try logging with valid credentials" });
      }
      const pwdCompare=await bcrypt.compare(req.body.password,userData.password)
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ errors: "Try logging with valid password" });
      }
      const data={
        user:{
            id:userData.id
        }
      }
      const authToken=jwt.sign(data,jwtSecret)

      return res.json({ success: true,authToken:authToken });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

module.exports = router;
