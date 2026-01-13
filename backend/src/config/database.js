const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set');
    
    // For Mongoose 7+, the options are different
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    
    // Create admin user if it doesn't exist
    await ensureAdminUser();
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Error details:', error);
    process.exit(1);
  }
};

// Function to create admin user on first startup
const ensureAdminUser = async () => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    
    const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME });
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      // Don't hash here - let the model middleware handle it
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD, // Plain text - middleware will hash
        role: 'admin',
        displayName: 'Mutant Boi Genius'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error.message);
    console.error('Full error:', error);
  }
};

module.exports = connectDB;