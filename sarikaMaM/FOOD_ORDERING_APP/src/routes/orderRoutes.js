const express = require('express');
const router = express.Router();
const { renderOrderPage, placeOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, renderOrderPage);
router.post('/', protect, placeOrder);

module.exports = router;
