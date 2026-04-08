const express = require('express');

const { addUser, getUsers, getUserById, updateUser, deleteUser } = require('../controller/userController');

const u_Router = express.Router();

u_Router.post('/users', addUser);
u_Router.get('/users', getUsers);
u_Router.get('/users/:id', getUserById);
u_Router.patch('/users/:id', updateUser);
u_Router.delete('/users/:id', deleteUser);

module.exports = u_Router;