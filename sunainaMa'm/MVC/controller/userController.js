const userModel = require("../model/userModel");


const addUser = async (req, res) => {
    const data = await userModel.create(req.body);
    res.status(201).send(data);
}

const getUsers = async (req, res) => {
    const data = await userModel.find();
    res.status(200).send(data);
}

const getUserById = async (req, res) => {
    const data = await userModel.findById(req.params.id);
    res.status(200).send(data);
}   

const updateUser = async (req, res) => {
    const data = await userModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send(data);
}   

const deleteUser = async (req, res) => {    
    const data = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).send(data);
}

module.exports ={addUser, getUsers, getUserById, updateUser, deleteUser};