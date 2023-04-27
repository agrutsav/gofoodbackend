const express=require("express")
const app=express();
const dotenv= require('dotenv')
dotenv.config()
const mongoDB=require("./db")
mongoDB()
const cors=require("cors")
app.use(cors());

app.get("/",(req,res)=>{
    res.send("hello world")

})
app.use(express.json())
app.use('/api',require('./Routes/CreateUser'));
app.use('/api',require('./Routes/DisplayData'));
app.use('/api',require('./Routes/OrderData'));
app.get("/",(req,res)=>{
    res.send("hello")
})
app.listen(8800,()=>{
    console.log("Connected successfully")
    
})