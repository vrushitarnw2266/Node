const Comment = require("../models/commentModel");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blogId = req.params.blogId;

    await Comment.create({
      text,
      blogId,
      user: req.user._id
    });

    res.redirect("back");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).send("You are not allowed to delete this comment");
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.redirect("back");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addComment,
  deleteComment
};