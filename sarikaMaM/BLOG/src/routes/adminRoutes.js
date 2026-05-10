const express = require("express");

const { dashboard } = require("../controllers/adminController");
const { protect } = require("../../middleware/authMiddleware");
const { adminOnly } = require("../../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, dashboard);

module.exports = router;