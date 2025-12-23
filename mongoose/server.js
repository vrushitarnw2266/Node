const express = require("express");
require("./config/db"); // IMPORTANT: just require it
const usermodel = require("./usermodel");

const app = express();
app.use(express.json());

// INSERT DATA
app.post("/create", async (req, res) => {
    try {
        const data = await usermodel.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL DATA
app.get("/users", async (req, res) => {
    try {
        const data = await usermodel.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE BY ID
app.delete("/delete/:id", async (req, res) => {
    try {
        await usermodel.findByIdAndDelete(req.params.id);
        res.send("Successfully deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE BY ID
app.patch("/update/:id", async (req, res) => {
    try {
        await usermodel.findByIdAndUpdate(req.params.id, req.body);
        res.send("Successfully updated");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
