const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./db/config.cjs');
const User = require('./db/models/User.cjs');

// Test the authentication system
async function diagnoseAuth() {
  console.log('Starting authentication diagnostic...');
  
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Check if admin user exists
    console.log('Checking for admin user...');
    const user = await User.findOne({ username: 'admin' });
    
    if (user) {
      console.log('Admin user found:');
      console.log('- Username:', user.username);
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('- Created at:', user.createdAt);
      
      // Test password verification
      console.log('Testing password verification...');
      const isPasswordValid = await bcrypt.compare('admin123', user.password);
      console.log('Password valid:', isPasswordValid);
      
      // Test JWT token generation
      console.log('Testing JWT token generation...');
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        'zamto_africa_secret_key',
        { expiresIn: '24h' }
      );
      console.log('Token generated successfully');
      console.log('Token length:', token.length);
      
      // Test token verification
      console.log('Testing token verification...');
      const decoded = jwt.verify(token, 'zamto_africa_secret_key');
      console.log('Token verified successfully');
      console.log('Decoded token:', decoded);
    } else {
      console.log('Admin user not found in database');
      
      // Check total user count
      const userCount = await User.countDocuments();
      console.log('Total users in database:', userCount);
      
      // Try to create admin user
      console.log('Attempting to create admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Diagnostic error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

diagnoseAuth();