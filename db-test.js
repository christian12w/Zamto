// Simple database test
const { connectDB } = require('./db/config.cjs');
const User = require('./db/models/User.cjs');

async function testDB() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Connected to database successfully!');
    
    // Count users
    const count = await User.countDocuments();
    console.log(`Found ${count} users in database`);
    
    // Look for admin user
    const admin = await User.findOne({ username: 'admin' });
    if (admin) {
      console.log('Admin user found:', admin.username);
    } else {
      console.log('No admin user found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error.message);
    process.exit(1);
  }
}

testDB();