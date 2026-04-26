const Book = require("../models/Book");

const buildBookPayload = (body) => ({
  title: body.title,
  author: body.author,
  price: Number(body.price),
  genre: body.genre,
  publishedYear: body.publishedYear ? Number(body.publishedYear) : undefined,
  description: body.description,
  inStock: body.inStock === "on",
});

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.render("books/index", {
      title: "Book Store",
      books,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCreateBookForm = (req, res) => {
  res.render("books/create", {
    title: "Add Book",
  });
};

exports.createBook = async (req, res, next) => {
  try {
    await Book.create(buildBookPayload(req.body));
    res.redirect("/books");
  } catch (error) {
    next(error);
  }
};

exports.getEditBookForm = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).render("404", { title: "Book Not Found" });
    }

    res.render("books/edit", {
      title: "Edit Book",
      book,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      buildBookPayload(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).render("404", { title: "Book Not Found" });
    }

    res.redirect("/books");
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).render("404", { title: "Book Not Found" });
    }

    res.redirect("/books");
  } catch (error) {
    next(error);
  }
};

exports.getAbout = (req, res) => {
  res.render("about", {
    title: "About Us",
  });
};

exports.getContact = (req, res) => {
  res.render("contact", {
    title: "Contact Us",
  });
};
