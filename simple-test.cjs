// Simple test to verify static data loading
const fs = require('fs');

console.log('Testing static data loading...');

try {
  const rawData = fs.readFileSync('./src/data/vehicles.json', 'utf8');
  const vehiclesData = JSON.parse(rawData);
  
  console.log('Successfully loaded vehicle data');
  console.log('Number of vehicles:', vehiclesData.length);
  if (vehiclesData.length > 0) {
    console.log('First vehicle:', vehiclesData[0].name);
  }
} catch (error) {
  console.error('Failed to load vehicle data:', error.message);
}