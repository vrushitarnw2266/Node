const Order = require('../models/Order');

const renderOrderPage = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render('order', { page: 'order', orders, error: null, success: null });
    } catch (error) {
        res.render('order', { page: 'order', orders: [], error: 'Error fetching orders', success: null });
    }
};

const placeOrder = async (req, res) => {
    const { foodItem, quantity, specialInstructions } = req.body;

    try {
        await Order.create({
            user: req.user._id,
            foodItem,
            quantity,
            specialInstructions
        });
        
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render('order', { page: 'order', orders, error: null, success: 'Order placed successfully!' });
    } catch (error) {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render('order', { page: 'order', orders, error: 'Failed to place order', success: null });
    }
};

module.exports = { renderOrderPage, placeOrder };
