const errorHandler = (error, req, res, next) => {
  console.error(error);

  res.status(500).render("500", {
    title: "Server Error",
    message: error.message || "Something went wrong.",
  });
};

module.exports = errorHandler;
