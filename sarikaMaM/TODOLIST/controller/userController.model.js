const Todo = require('../models/userModel.model');

// Get all todos
const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.render('todos/index', { todos });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Show add form
const showAddForm = (req, res) => {
    res.render('todos/add');
};

// Create new todo
const createTodo = async (req, res) => {
    try {
        const { name, description, email } = req.body;
        const image = req.file ? req.file.filename : '';
        const newTodo = new Todo({ name, description, image, email });
        await newTodo.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Show edit form
const showEditForm = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).send('Todo not found');
        res.render('todos/edit', { todo });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Update todo
const updateTodo = async (req, res) => {
    try {
        const { name, description, email } = req.body;
        const updateData = { name, description, email };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        await Todo.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Delete todo
const deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllTodos,
    showAddForm,
    createTodo,
    showEditForm,
    updateTodo,
    deleteTodo
};