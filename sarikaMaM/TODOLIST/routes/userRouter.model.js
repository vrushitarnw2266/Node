const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controller/userController.model');
const { validateTodo } = require('../middleware/userMiddleware.model');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// GET / - List all todos
router.get('/', controller.getAllTodos);

// GET /add - Show add form
router.get('/add', controller.showAddForm);

// POST / - Create new todo
router.post('/', upload.single('image'), validateTodo, controller.createTodo);

// GET /:id/edit - Show edit form
router.get('/:id/edit', controller.showEditForm);

// POST /:id - Update todo
router.post('/:id', upload.single('image'), validateTodo, controller.updateTodo);

// POST /:id/delete - Delete todo
router.post('/:id/delete', controller.deleteTodo);

module.exports = router;