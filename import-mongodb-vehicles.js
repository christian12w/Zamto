// Script to import vehicle data from all-mongodb-vehicles.json into MongoDB
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the vehicle data
const vehiclesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-mongodb-vehicles.json'), 'utf8'));

console.log(`Loaded ${vehiclesData.length} vehicles from all-mongodb-vehicles.json`);

// Function to import vehicles via the API
async function importVehicles() {
  try {
    // You'll need to authenticate first to get a token
    // For this example, we'll assume you have admin credentials
    console.log('Authenticating as admin...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Authentication successful');
    
    // Import vehicles in batches to avoid overwhelming the server
    const batchSize = 10;
    let importedCount = 0;
    
    for (let i = 0; i < vehiclesData.length; i += batchSize) {
      const batch = vehiclesData.slice(i, i + batchSize);
      
      try {
        console.log(`Importing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(vehiclesData.length/batchSize)}...`);
        
        const response = await axios.post('http://localhost:3001/api/vehicles/import', {
          vehicles: batch
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        importedCount += response.data.imported || batch.length;
        console.log(`Batch imported successfully. Total imported: ${importedCount}/${vehiclesData.length}`);
        
        // Add a small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (batchError) {
        console.error(`Error importing batch ${Math.floor(i/batchSize) + 1}:`, batchError.response?.data || batchError.message);
        // Continue with next batch
      }
    }
    
    console.log(`Import completed. Successfully imported ${importedCount} vehicles.`);
  } catch (error) {
    console.error('Error during import process:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('Authentication failed. Please check your admin credentials.');
    }
  }
}

// Run the import
importVehicles().catch(console.error);