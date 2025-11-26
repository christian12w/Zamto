// Script to restore original vehicle data from MongoDB backup
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Function to parse CSV data
function parseCSV(filePath) {
  const csvData = readFileSync(join(process.cwd(), filePath), 'utf8');
  const csvLines = csvData.trim().split('\n');
  
  // Parse CSV headers
  const headers = csvLines[0].split(',');
  
  // Parse CSV rows
  const records = [];
  for (let i = 1; i < csvLines.length; i++) {
    const values = csvLines[i].split(',');
    const record = {};
    
    // Map values to headers
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }
    
    records.push(record);
  }
  
  return records;
}

// Function to find matching vehicle with fuzzy matching
function findMatchingVehicle(jsonVehicle, csvVehicles) {
  const jsonName = jsonVehicle.name.toLowerCase();
  
  // Exact match first
  let match = csvVehicles.find(v => v.name.toLowerCase() === jsonName);
  if (match) return match;
  
  // Partial matches
  match = csvVehicles.find(v => jsonName.includes(v.name.toLowerCase()) || v.name.toLowerCase().includes(jsonName));
  if (match) return match;
  
  // Special case mappings
  const nameMappings = {
    'toyota land cruiser': 'toyota land cruiser prado',
    'toyota land cruiser prado tz-g': 'toyota land cruiser prado'
  };
  
  const mappedName = nameMappings[jsonName];
  if (mappedName) {
    match = csvVehicles.find(v => v.name.toLowerCase().includes(mappedName));
    if (match) return match;
  }
  
  return null;
}

// Read the original CSV data
const vehiclesCSV = parseCSV('vehicles.csv');
const vehiclesDataCSV = parseCSV('vehicles-data.csv');

console.log(`Parsed ${vehiclesCSV.length} vehicles from vehicles.csv`);
console.log(`Parsed ${vehiclesDataCSV.length} vehicles from vehicles-data.csv`);

// Combine data from both CSV files with proper field mapping
const combinedCSVData = vehiclesCSV.map(vehicle => {
  // Find matching record in vehicles-data.csv
  const matchingData = vehiclesDataCSV.find(v => v.name === vehicle.name);
  
  // Merge data from both sources with proper field mapping
  const mergedData = {
    ...vehicle,
    ...matchingData
  };
  
  return mergedData;
});

console.log(`Combined data for ${combinedCSVData.length} vehicles`);

// Read current JSON data
const jsonData = JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', 'vehicles.json'), 'utf8'));

console.log(`Current JSON has ${jsonData.length} vehicles`);

// Update JSON data with CSV information where names match
const updatedVehicles = jsonData.map(jsonVehicle => {
  // Find matching vehicle in CSV data by name
  const csvVehicle = findMatchingVehicle(jsonVehicle, combinedCSVData);
  
  if (csvVehicle) {
    console.log(`Updating vehicle: ${jsonVehicle.name} with data from: ${csvVehicle.name}`);
    // Update with CSV data while preserving JSON structure and ensuring proper field mapping
    return {
      ...jsonVehicle,
      category: csvVehicle.category || jsonVehicle.category,
      price: csvVehicle.price || jsonVehicle.price,
      description: csvVehicle.description || jsonVehicle.description,
      year: csvVehicle.year ? parseInt(csvVehicle.year) : jsonVehicle.year,
      mileage: csvVehicle.mileage || jsonVehicle.mileage,
      transmission: csvVehicle.transmission || jsonVehicle.transmission,
      fuelType: csvVehicle.fuelType || jsonVehicle.fuelType,
      engineSize: csvVehicle.engineSize || jsonVehicle.engineSize,
      color: csvVehicle.color || jsonVehicle.color,
      type: csvVehicle.type || jsonVehicle.type
    };
  } else {
    console.log(`No matching CSV data found for: ${jsonVehicle.name}`);
  }
  
  // Return unchanged if no match
  return jsonVehicle;
});

// Write updated data back to JSON file
writeFileSync(
  join(process.cwd(), 'src', 'data', 'vehicles-full-update.json'),
  JSON.stringify(updatedVehicles, null, 2)
);

console.log('Full updated vehicles data written to src/data/vehicles-full-update.json');
console.log('You can replace the original vehicles.json with this file if you want to use the updated data.');