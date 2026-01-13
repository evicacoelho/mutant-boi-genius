const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContactMessages,
  markAsRead,
  markAsReplied
} = require('../controllers/contactController');
const { auth, isAdmin } = require('../middleware/auth');

// Public route
router.post('/', submitContact);

// Admin routes
router.get('/', auth, isAdmin, getContactMessages);
router.put('/:id/read', auth, isAdmin, markAsRead);
router.put('/:id/replied', auth, isAdmin, markAsReplied);

module.exports = router;