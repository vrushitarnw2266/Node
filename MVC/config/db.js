const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/test2");

const db = mongoose.connection;

db.on("connected", () => {
    console.log("DB connected successfully");
});

db.on("error", (err) => {
    console.error("DB connection error:", err);
});

module.exports = db;
