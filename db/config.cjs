// Database configuration
const mongoose = require('mongoose');

// MongoDB connection URI
// For development, you can use a local MongoDB instance
// For production, you would use a MongoDB Atlas URI or similar
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zamto_africa';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };