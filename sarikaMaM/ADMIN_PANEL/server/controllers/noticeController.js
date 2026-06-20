const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notice by ID
// @route   GET /api/notices/:id
// @access  Private
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private/Admin/Faculty
const createNotice = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const notice = await Notice.create({
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0],
      author: req.user ? req.user.name : 'Administrator'
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin/Faculty
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    const fieldsToUpdate = ['title', 'content', 'category'];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        notice[field] = req.body[field];
      }
    });

    const updatedNotice = await notice.save();
    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin/Faculty
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await notice.deleteOne();
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
};
