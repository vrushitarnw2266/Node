const TableBooking = require('../models/TableBooking');

const renderBookTablePage = async (req, res) => {
    try {
        const bookings = await TableBooking.find({ user: req.user._id }).sort({ date: 1 });
        res.render('book-table', { page: 'book-table', bookings, error: null, success: null });
    } catch (error) {
        res.render('book-table', { page: 'book-table', bookings: [], error: 'Error fetching bookings', success: null });
    }
};

const bookTable = async (req, res) => {
    const { date, time, guests } = req.body;

    try {
        await TableBooking.create({
            user: req.user._id,
            date,
            time,
            guests
        });
        
        const bookings = await TableBooking.find({ user: req.user._id }).sort({ date: 1 });
        res.render('book-table', { page: 'book-table', bookings, error: null, success: 'Table booked successfully!' });
    } catch (error) {
        const bookings = await TableBooking.find({ user: req.user._id }).sort({ date: 1 });
        res.render('book-table', { page: 'book-table', bookings, error: 'Failed to book table', success: null });
    }
};

module.exports = { renderBookTablePage, bookTable };
