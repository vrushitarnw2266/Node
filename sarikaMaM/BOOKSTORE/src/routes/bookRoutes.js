const express = require("express");
const bookController = require("../controllers/bookController");

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/create", bookController.getCreateBookForm);
router.post("/", bookController.createBook);
router.get("/:id/edit", bookController.getEditBookForm);
router.post("/:id/edit", bookController.updateBook);
router.post("/:id/delete", bookController.deleteBook);

module.exports = router;
