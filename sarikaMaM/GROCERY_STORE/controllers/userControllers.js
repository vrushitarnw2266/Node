const Grocery = require("../models/userModel");

exports.getAllGroceries = async (req, res) => {
    const groceries = await Grocery.find();
    res.render("index", { groceries });
}

exports.addPage = (req, res) => {
    res.render("add");
}

exports.addGrocery = async (req, res) => {
    await Grocery.create(req.body);
    res.redirect("/users");
}

exports.editPage = async (req, res) => {
    const grocery = await Grocery.findById(req.params.id);
    res.render("edit", { grocery });
}

exports.editGrocery = async (req, res) => {
    await Grocery.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/users");
}

exports.deleteGrocery = async (req, res) => {
    await Grocery.findByIdAndDelete(req.params.id);
    res.redirect("/users");
}