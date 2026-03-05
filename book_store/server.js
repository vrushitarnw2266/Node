const express = require('express');
require('./config/db'); // just require it
const Book = require('./model/bookModel');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INSERT
app.post('/insert', async (req, res) => {
    try {
        const data = new Book(req.body);
        await data.save();
        res.status(201).send({ message: "Book inserted successfully", data });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET
app.get('/get', async (req, res) => {
    try {
        const data = await Book.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
// GET BY ID
app.get('/get/:id', async (req, res) => {
    try {
        const data = await Book.findById(req.params.id);

        if (!data) {
            return res.status(404).send({ message: "Book not found" });
        }

        res.status(200).send(data);

    } catch (error) {
        res.status(400).send({ message: "Invalid ID" });
    }
});

// DELETE
app.delete('/delete/:id', async (req, res) => {
    try {
        const data = await Book.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Book deleted", data });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// UPDATE
app.patch('/update/:id', async (req, res) => {
    try {
        const data = await Book.findByIdAndUpdate(
            req.params.id,req.body,
            { new: true }
        );
        res.status(200).send({ message: "Book updated", data });
        console.log("dixit",req.body);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
