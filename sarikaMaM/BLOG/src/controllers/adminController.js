const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");

const dashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();
    const reportedBlogs = await Blog.find({ isReported: true }).populate("author");

    res.render("partials/admin/dashboard", {
      totalUsers,
      totalBlogs,
      totalComments,
      reportedBlogs
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  dashboard
};