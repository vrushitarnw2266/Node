const express = require('express');
const db = require("./config/db");

const app = express()

app.set("view engine","ejs")
app.use("/",express.static("public"))
const Middleware = (req,res,next) =>{
    if (req.query.age >= 18) {
    next();
  } else {
    res.send("Access denied: Age must be 18+");
  }
}

app.get("/",(req,res) =>{
    res.render("index")
})
app.get("/login", Middleware,(req,res) =>{
    res.send("login page")
})



app.listen(3000,() =>{
    console.log("server start on 3000")
})