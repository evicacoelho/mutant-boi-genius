const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findOne({ _id: decoded.userId });
    
    if (!user) {
      throw new Error();
    }

    // Add user to request
    req.user = user;
    req.token = token;
    next();
    
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
};

module.exports = { auth, isAdmin };