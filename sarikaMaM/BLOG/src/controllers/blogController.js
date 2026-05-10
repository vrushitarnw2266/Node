const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

const getAllBlogs = async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    
    const totalBlogsCount = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogsCount / limit) || 1;

    const blogs = await Blog.find(query)
      .populate("author")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("partials/blogs/index", { 
      blogs, 
      search, 
      category,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const showCreateBlog = (req, res) => {
  res.render("partials/blogs/create");
};

const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    await Blog.create({
      title,
      slug,
      content,
      category,
      image,
      author: req.user._id
    });

    res.redirect("/blogs");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.id }).populate("author");
    
    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    const comments = await Comment.find({ blogId: blog._id }).populate("user");
    res.render("partials/blogs/single", { blog, comments });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const showEditBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }
    res.render("partials/blogs/edit", { blog });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }
    const { title, content, category } = req.body;
    const image = req.file ? req.file.filename : blog.image;

    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      content,
      category,
      image
    });

    res.redirect(`/blogs/${req.params.id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blogs");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.likes.includes(req.user._id)) {
      blog.likes.pull(req.user._id);
    } else {
      blog.likes.push(req.user._id);
    }
    await blog.save();
    res.redirect(req.get("Referer") || "/blogs");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const saveBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.savedBlogs.includes(req.params.id)) {
      user.savedBlogs.pull(req.params.id);
    } else {
      user.savedBlogs.push(req.params.id);
    }
    await user.save();
    res.redirect(req.get("Referer") || "/blogs");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const reportBlog = async (req, res) => {
  // Implement report functionality
  res.redirect(req.get("Referer") || "/blogs");
};

module.exports = {
  getAllBlogs,
  showCreateBlog,
  createBlog,
  getSingleBlog,
  showEditBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  saveBlog,
  reportBlog
};