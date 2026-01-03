const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    language: { type: String, required: true },
    sale: { type: Boolean, required: true },
    discount: { type: Number, required: true }
})

const Book = mongoose.model('books', bookSchema)
module.exports = Book
