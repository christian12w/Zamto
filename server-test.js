// Simple server test
const express = require('express');
const { connectDB } = require('./db/config.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Test database connection
connectDB().then(() => {
  console.log('Database connected successfully');
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  });
}).catch(error => {
  console.error('Failed to connect to database:', error.message);
});