const express = require('express');
const router = express.Router();
const { renderBookTablePage, bookTable } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, renderBookTablePage);
router.post('/', protect, bookTable);

module.exports = router;
