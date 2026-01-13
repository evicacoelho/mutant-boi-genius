const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getAllCategories
} = require('../controllers/postController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllPosts);
router.get('/categories', getAllCategories);
router.get('/:slug', getPostBySlug);

// Protected routes
router.post('/', auth, isAdmin, createPost);
router.put('/:id', auth, isAdmin, updatePost);
router.delete('/:id', auth, isAdmin, deletePost);

module.exports = router;