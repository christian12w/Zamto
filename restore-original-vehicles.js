// Script to restore original vehicle data from CSV files
// This script will convert the CSV data back to JSON format and update the vehicles.json file

import fs from 'fs';
import path from 'path';

// Function to parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    results.push(obj);
  }
  
  return results;
}

// Function to convert CSV vehicle data to JSON format
function convertToVehicleFormat(csvVehicle, id) {
  // Generate a more detailed description based on available data
  const features = [];
  if (csvVehicle.features) {
    features.push(...csvVehicle.features.split('|').map(f => f.trim()));
  } else {
    if (csvVehicle.engineSize) features.push(`${csvVehicle.engineSize} Engine`);
    if (csvVehicle.color) features.push(`${csvVehicle.color} Color`);
  }
  
  // Convert price to ZMW format if needed
  let price = csvVehicle.price;
  if (price && !price.startsWith('ZMW')) {
    if (price.startsWith('$')) {
      // Convert USD to ZMW (approximate rate)
      const usdAmount = parseFloat(price.replace(/[^0-9.]/g, ''));
      if (!isNaN(usdAmount)) {
        price = `ZMW ${Math.round(usdAmount * 20).toLocaleString()}`;
      }
    } else if (price.startsWith('K')) {
      // Convert K amounts to ZMW
      const kAmount = parseFloat(price.replace(/[^0-9.]/g, ''));
      if (!isNaN(kAmount)) {
        price = `ZMW ${Math.round(kAmount * 1000).toLocaleString()}`;
      }
    } else {
      price = `ZMW ${price}`;
    }
  }
  
  return {
    id: id.toString(),
    name: csvVehicle.name || 'Unknown Vehicle',
    category: csvVehicle.category || 'Unknown',
    price: price || 'Price on request',
    dailyRate: csvVehicle.dailyRate || 'ZMW 500/day',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
        label: 'exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
        label: 'interior'
      }
    ],
    description: csvVehicle.description || `Experience reliable transportation with this ${csvVehicle.name || 'vehicle'}.`,
    features: features.length > 0 ? features : ['Reliable Transportation'],
    type: csvVehicle.type || 'sale',
    popular: false,
    year: csvVehicle.year ? parseInt(csvVehicle.year) : new Date().getFullYear() - 2,
    mileage: csvVehicle.mileage || 'Unknown',
    transmission: csvVehicle.transmission || 'Automatic',
    fuelType: csvVehicle.fuelType || 'Petrol',
    engineSize: csvVehicle.engineSize || 'Unknown',
    doors: 4,
    seats: 5,
    color: csvVehicle.color || 'Unknown',
    condition: 'Good',
    serviceHistory: 'Regular maintenance',
    accidentHistory: 'No accident history',
    warranty: '6 months',
    registrationStatus: 'Valid',
    insuranceStatus: 'Current',
    whatsappContact: '+260572213038',
    status: 'available'
  };
}

// Main function to restore vehicles
async function restoreOriginalVehicles() {
  try {
    console.log('Restoring original vehicle data from CSV files...');
    
    // Read the main vehicles CSV file
    const csvPath = path.join(process.cwd(), 'vehicles.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('vehicles.csv file not found');
      return;
    }
    
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const csvVehicles = parseCSV(csvData);
    
    console.log(`Found ${csvVehicles.length} vehicles in CSV file`);
    
    // Convert CSV data to JSON format
    const jsonVehicles = csvVehicles.map((vehicle, index) => 
      convertToVehicleFormat(vehicle, index + 1)
    );
    
    // Read the current vehicles.json file
    const vehiclesJsonPath = path.join(process.cwd(), 'src', 'data', 'vehicles.json');
    if (!fs.existsSync(vehiclesJsonPath)) {
      console.error('vehicles.json file not found');
      return;
    }
    
    // Backup the current vehicles.json file
    const backupPath = path.join(process.cwd(), 'src', 'data', 'vehicles.backup.json');
    fs.copyFileSync(vehiclesJsonPath, backupPath);
    console.log('Created backup of current vehicles.json file');
    
    // Write the restored data to vehicles.json
    fs.writeFileSync(vehiclesJsonPath, JSON.stringify(jsonVehicles, null, 2));
    console.log(`Successfully restored ${jsonVehicles.length} vehicles to vehicles.json`);
    
    // Also update the localStorage cache if running in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vehicles_cache', JSON.stringify(jsonVehicles));
      localStorage.setItem('vehicles_cache_timestamp', Date.now().toString());
      console.log('Updated localStorage cache with restored vehicles');
    }
    
    console.log('\nRestore complete!');
    console.log('- Created backup at src/data/vehicles.backup.json');
    console.log('- Updated src/data/vehicles.json with original data');
    console.log('- If running in browser, refreshed localStorage cache');
    
  } catch (error) {
    console.error('Error restoring vehicles:', error);
  }
}

// Run the restore function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  restoreOriginalVehicles();
}

export { restoreOriginalVehicles };