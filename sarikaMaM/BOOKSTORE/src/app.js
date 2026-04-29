
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/books");
});

app.use("/books", bookRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;