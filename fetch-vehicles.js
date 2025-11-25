// Simple script to fetch vehicles from the API and export them to JSON
async function fetchVehicles() {
  try {
    console.log('Fetching vehicles from API...');
    
    const response = await fetch('https://zamto-1.onrender.com/api/vehicles');
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.vehicles) {
      console.log(`Total vehicles: ${data.vehicles.length}`);
      
      // Save to file
      const fs = require('fs');
      fs.writeFileSync('exported-vehicles.json', JSON.stringify(data.vehicles, null, 2));
      console.log('Vehicles exported to exported-vehicles.json');
      
      // Also display the first few vehicles
      console.log('\nFirst 3 vehicles:');
      data.vehicles.slice(0, 3).forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.name} (${vehicle.category}) - ${vehicle.type}`);
      });
    } else {
      console.log('No vehicles found or error occurred');
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

fetchVehicles();