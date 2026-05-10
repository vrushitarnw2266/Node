const express = require("express");

const {
  showRegister,
  showLogin,
  registerUser,
  loginUser,
  logoutUser
} = require("../controllers/authController");

const router = express.Router();

router.get("/register", showRegister);
router.post("/register", registerUser);

router.get("/login", showLogin);
router.post("/login", loginUser);

router.get("/logout", logoutUser);

module.exports = router;