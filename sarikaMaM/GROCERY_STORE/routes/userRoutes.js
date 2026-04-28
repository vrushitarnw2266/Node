const express = require('express');
const router = express.Router();
const userController = require("../controllers/userControllers");   

router.get("/", userController.getAllGroceries);
router.get("/add", userController.addPage);
router.post("/add", userController.addGrocery);
router.get("/edit/:id", userController.editPage);
router.post("/edit/:id", userController.editGrocery);
router.post("/delete/:id", userController.deleteGrocery);

module.exports = router;