const express = require("express");

const {
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
} = require("../controllers/blogController");

const { protect, checkUser } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", checkUser, getAllBlogs);

router.get("/create", protect, showCreateBlog);
router.post("/", protect, upload.single("image"), createBlog);

router.get("/:id", checkUser, getSingleBlog);

router.get("/edit/:id", protect, showEditBlog);
router.put("/:id", protect, upload.single("image"), updateBlog);

router.delete("/:id", protect, deleteBlog);

router.post("/:id/like", protect, likeBlog);
router.post("/:id/save", protect, saveBlog);
router.post("/:id/report", protect, reportBlog);

module.exports = router;