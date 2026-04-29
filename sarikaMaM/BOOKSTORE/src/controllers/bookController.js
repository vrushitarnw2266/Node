
const Book = require("../models/Book");

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.render("books/index", { title: "All Books", books });
  } catch (error) {
    next(error);
  }
};

exports.showCreateForm = (req, res) => {
  res.render("books/create", { title: "Add Book" });
};

exports.createBook = async (req, res, next) => {
  try {
    const { title, author, price, genre, publishedYear, description, inStock } = req.body;

    await Book.create({
      title,
      author,
      price,
      genre,
      publishedYear,
      description,
      inStock: inStock === "on",
    });

    res.redirect("/books");
  } catch (error) {
    next(error);
  }
};

exports.showEditForm = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).render("404", { title: "Book Not Found" });
    }

    res.render("books/edit", { title: "Edit Book", book });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { title, author, price, genre, publishedYear, description, inStock } = req.body;

    await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        price,
        genre,
        publishedYear,
        description,
        inStock: inStock === "on",
      },
      { new: true, runValidators: true }
    );

    res.redirect("/books");
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books");
  } catch (error) {
    next(error);
  }
};