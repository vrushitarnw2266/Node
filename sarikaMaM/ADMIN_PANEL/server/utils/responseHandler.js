// Helper utility to keep responses standard, especially for errors.
// For resource queries, we return raw arrays/objects directly to match frontend expectations.

const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

const sendError = (res, message, statusCode = 500, error = null) => {
  const response = {
    message
  };
  if (error && process.env.NODE_ENV !== 'production') {
    response.stack = error.stack;
    response.details = error.message;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};
