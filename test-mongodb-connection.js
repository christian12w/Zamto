// Script to test MongoDB connection and verify vehicle data import
const axios = require('axios');

async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection and vehicle data import...');
    
    // Test 1: Check if server is running
    console.log('\n1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✓ Server is running:', healthResponse.data.message);
    console.log('✓ Watermarking available:', healthResponse.data.watermarkingAvailable);
    
    // Test 2: Authenticate as admin
    console.log('\n2. Authenticating as admin...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Authentication successful');
    console.log('✓ User:', loginResponse.data.user.username);
    
    // Test 3: Fetch vehicles
    console.log('\n3. Fetching vehicles from MongoDB...');
    const vehiclesResponse = await axios.get('http://localhost:3001/api/vehicles');
    
    console.log('✓ Vehicles fetched successfully');
    console.log('✓ Total vehicles:', vehiclesResponse.data.total);
    console.log('✓ Vehicles in response:', vehiclesResponse.data.vehicles.length);
    
    // Show first vehicle as sample
    if (vehiclesResponse.data.vehicles.length > 0) {
      console.log('\n4. Sample vehicle data:');
      console.log('Name:', vehiclesResponse.data.vehicles[0].name);
      console.log('Category:', vehiclesResponse.data.vehicles[0].category);
      console.log('Price:', vehiclesResponse.data.vehicles[0].price);
    }
    
    // Test 5: Test pagination
    console.log('\n5. Testing pagination...');
    const paginatedResponse = await axios.get('http://localhost:3001/api/vehicles?page=1&limit=5');
    console.log('✓ Pagination test successful');
    console.log('✓ Page:', paginatedResponse.data.page);
    console.log('✓ Limit:', paginatedResponse.data.vehicles.length);
    
    console.log('\n🎉 All tests passed! MongoDB connection and vehicle data import are working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure the server is running (node server.cjs)');
      console.log('2. Check that MongoDB is accessible');
      console.log('3. Verify the port (3001) is correct');
    } else if (error.response?.status === 401) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check admin credentials (username: admin, password: admin123)');
      console.log('2. Make sure the admin user exists in the database');
    }
  }
}

// Run the test
testMongoDBConnection();