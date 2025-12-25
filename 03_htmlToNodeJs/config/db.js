const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/dashboard");
const db = mongoose.connection;

db.on("connected",(data,err)=>{
    console.log("dataaaaa")
})