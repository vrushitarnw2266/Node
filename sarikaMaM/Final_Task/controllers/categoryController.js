const Category = require('../models/Category');
const Task = require('../models/Task');

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('categoryList', {
      categories,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to fetch categories', title: 'Error' });
  }
};

// POST create category (Admin only)
exports.postCategoryCreate = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.redirect('/categories?error=Category name cannot be empty');
  }

  try {
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.redirect('/categories?error=Category already exists');
    }

    const category = new Category({ name: name.trim() });
    await category.save();

    res.redirect('/categories?success=Category created successfully');
  } catch (err) {
    console.error(err);
    res.redirect('/categories?error=Failed to create category');
  }
};

// POST delete category (Admin only)
exports.postCategoryDelete = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if category is used by any task
    const taskCount = await Task.countDocuments({ category: id });
    if (taskCount > 0) {
      return res.redirect(`/categories?error=Cannot delete category because it is currently linked to ${taskCount} tasks.`);
    }

    await Category.findByIdAndDelete(id);
    res.redirect('/categories?success=Category deleted successfully');
  } catch (err) {
    console.error(err);
    res.redirect('/categories?error=Failed to delete category');
  }
};
