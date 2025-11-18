// Diagnostic script to check authentication system
require('dotenv').config();

const { connectDB } = require('./db/config.cjs');
const User = require('./db/models/User.cjs');
const bcrypt = require('bcryptjs');

async function diagnoseAuth() {
  console.log('=== Authentication System Diagnostic ===');
  
  try {
    // Test 1: Environment variables
    console.log('\n1. Checking environment variables...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    
    if (process.env.MONGODB_URI) {
      console.log('MongoDB URI preview:', process.env.MONGODB_URI.substring(0, 50) + '...');
    }
    
    // Test 2: Database connection
    console.log('\n2. Testing database connection...');
    await connectDB();
    console.log('✓ Database connected successfully');
    
    // Test 3: Check for existing users
    console.log('\n3. Checking existing users...');
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} user(s) in database`);
    
    // Test 4: Look for admin user
    console.log('\n4. Looking for admin user...');
    const adminUser = await User.findOne({ username: 'admin' });
    
    if (adminUser) {
      console.log('✓ Admin user found:');
      console.log('  Username:', adminUser.username);
      console.log('  Email:', adminUser.email);
      console.log('  Role:', adminUser.role);
      console.log('  Created:', adminUser.createdAt);
      
      // Test 5: Test password verification
      console.log('\n5. Testing password verification...');
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
      console.log('Password verification:', isPasswordValid ? '✓ VALID' : '✗ INVALID');
    } else {
      console.log('⚠ Admin user not found');
      
      // Test 6: Create admin user if it doesn't exist
      console.log('\n6. Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await newUser.save();
      console.log('✓ Admin user created successfully');
    }
    
    console.log('\n=== Diagnostic Complete ===');
    
  } catch (error) {
    console.error('\n✗ Diagnostic failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

diagnoseAuth();