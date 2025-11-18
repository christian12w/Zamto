// Test environment variables
require('dotenv').config();

console.log('Environment variables test:');
console.log('VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL || 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

if (process.env.MONGODB_URI) {
  console.log('MongoDB URI preview:', process.env.MONGODB_URI.substring(0, 50) + '...');
}

console.log('Test completed');