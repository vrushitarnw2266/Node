const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).render("500", {
    title: "Server Error",
    message: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;