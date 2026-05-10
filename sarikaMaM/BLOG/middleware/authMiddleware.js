const jwt = require("jsonwebtoken");
const User = require("../src/models/userModel");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.redirect("/auth/login");
    }

    req.user = user;
    res.locals.user = user;

    next();
  } catch (error) {
    return res.redirect("/auth/login");
  }
};

const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      req.user = user;
      res.locals.user = user;
    } else {
      req.user = null;
      res.locals.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    res.locals.user = null;
    next();
  }
};

module.exports = { protect, checkUser };