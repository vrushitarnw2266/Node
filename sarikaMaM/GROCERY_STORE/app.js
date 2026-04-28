const express = require('express');
const path = require('path');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes'); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/",(req,res)=>{
    res.redirect("/users");
});

app.use("/users", userRoutes);

module.exports = app;