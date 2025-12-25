const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    }
})

const userModel = mongoose.model("user",user)
module.exports = userModel;