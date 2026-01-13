const ContactMessage = require('../models/ContactMessage');
const { sendContactEmail, sendAutoReply } = require('../utils/emailService');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contactMessage.save();

    // Send emails (async - don't wait for response)
    Promise.all([
      sendContactEmail({ name, email, subject, message }),
      sendAutoReply({ name, email, subject })
    ]).catch(err => {
      console.error('Email sending failed:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all contact messages (admin only)
exports.getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    
    let query = {};
    if (unread === 'true') {
      query.isRead = false;
    }

    const messages = await ContactMessage.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactMessage.countDocuments(query);

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalMessages: total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as replied
exports.markAsReplied = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isReplied: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};