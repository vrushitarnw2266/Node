const isAuthenticated = (req, res, next) => {
  // Authentication logic goes here (e.g., verifying a JWT token)
  next();
};

const optionalAuth = (req, res, next) => {
  next();
};

module.exports = {
  isAuthenticated,
  optionalAuth,
};
