const mongoose = require('mongoose');
const { type } = require('os');
const user = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    }
})

const usermodel = mongoose.model("user", user);
module.exports = usermodel;
