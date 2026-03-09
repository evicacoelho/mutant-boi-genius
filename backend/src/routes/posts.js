const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getAllCategories,
  toggleFeatured,
  saveDraft,
  getLatestDraft,
  getAllDrafts,
  deleteDraft
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
router.patch(':id/feature', auth, isAdmin, toggleFeatured)

// Draft routes (protected, but not requiring admin since author can save drafts)
router.post('/drafts', auth, saveDraft); // Save draft
router.get('/drafts/latest', auth, getLatestDraft); // Get latest draft
router.get('/drafts/all', auth, getAllDrafts); // Get all drafts (for future use)
router.delete('/drafts/:id', auth, deleteDraft); // Delete specific draft

module.exports = router;