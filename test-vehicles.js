// Simple test script to check vehicles in database
async function testVehicles() {
  try {
    console.log('Testing vehicle data...');
    
    const response = await fetch('https://zamto-1.onrender.com/api/vehicles');
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.vehicles) {
      console.log(`Total vehicles: ${data.vehicles.length}`);
      console.log('First vehicle:', data.vehicles[0]);
    } else {
      console.log('No vehicles found or error occurred');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testVehicles();

// Simple test script to verify vehicle storage functionality
console.log('Testing vehicle storage...');

// Import the vehicle storage functions
import { addVehicle, getVehicles, deleteVehicle } from './src/utils/vehicleStorage';

// Test adding vehicles
console.log('Adding test vehicles...');

const testVehicle1 = addVehicle({
  name: 'Test Vehicle 1',
  category: 'SUV',
  price: 'ZMW 100,000',
  image: 'https://example.com/test1.jpg',
  images: [{
    url: 'https://example.com/test1.jpg',
    label: 'exterior'
  }],
  description: 'This is test vehicle 1',
  features: ['Feature 1', 'Feature 2'],
  popular: true,
  year: 2020,
  mileage: '50,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '2.0L',
  doors: 4,
  seats: 5,
  color: 'Blue',
  condition: 'Good',
  serviceHistory: 'Full service history',
  accidentHistory: 'No accidents',
  warranty: '12 months',
  registrationStatus: 'Valid until 2025'
});

console.log('Added vehicle 1:', testVehicle1.id);

const testVehicle2 = addVehicle({
  name: 'Test Vehicle 2',
  category: 'SMALL CARS',
  price: 'ZMW 75,000',
  dailyRate: 'ZMW 500/day',
  image: 'https://example.com/test2.jpg',
  images: [{
    url: 'https://example.com/test2.jpg',
    label: 'exterior'
  }],
  description: 'This is test vehicle 2',
  features: ['Feature A', 'Feature B'],
  popular: false,
  year: 2019,
  mileage: '60,000 km',
  transmission: 'Manual',
  fuelType: 'Diesel',
  type: 'hire',
  engineSize: '1.5L',
  doors: 4,
  seats: 5,
  color: 'Red',
  condition: 'Fair',
  serviceHistory: 'Partial service history',
  accidentHistory: 'Minor accident',
  warranty: '6 months',
  registrationStatus: 'Valid until 2024',
  insuranceStatus: 'Comprehensive'
});

console.log('Added vehicle 2:', testVehicle2.id);

// Test getting vehicles
console.log('Getting all vehicles...');
const allVehicles = getVehicles();
console.log(`Found ${allVehicles.length} vehicles`);

// Test deleting a vehicle
console.log('Deleting vehicle 1...');
deleteVehicle(testVehicle1.id);

// Test getting vehicles again
console.log('Getting all vehicles after deletion...');
const remainingVehicles = getVehicles();
console.log(`Found ${remainingVehicles.length} vehicles after deletion`);

console.log('Test completed successfully!');