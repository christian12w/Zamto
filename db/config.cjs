// Database configuration
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// MongoDB connection URI
// For development, you can use a local MongoDB instance
// For production, you would use a MongoDB Atlas URI or similar
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zamto_africa';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    console.log('Using database:', MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };