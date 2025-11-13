import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from './vehicleStorage';

/**
 * Test the vehicle storage functionality
 */
export function testVehicleStorage(): void {
  console.log('=== Vehicle Storage Test ===');
  
  // Get initial vehicles
  console.log('1. Getting initial vehicles...');
  const initialVehicles = getVehicles();
  console.log(`   Found ${initialVehicles.length} vehicles`);
  
  // Add a new vehicle
  console.log('2. Adding a new vehicle...');
  const newVehicle = addVehicle({
    name: 'Test Vehicle',
    category: 'SUV',
    price: 'ZMW 100,000',
    image: 'https://example.com/test-image.jpg',
    images: [{
      url: 'https://example.com/test-image.jpg',
      label: 'exterior'
    }],
    description: 'This is a test vehicle',
    features: ['Test feature 1', 'Test feature 2'],
    popular: false,
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
  
  console.log(`   Added vehicle with ID: ${newVehicle.id}`);
  
  // Get vehicles again to verify the new one is there
  console.log('3. Verifying new vehicle was added...');
  const vehiclesAfterAdd = getVehicles();
  console.log(`   Found ${vehiclesAfterAdd.length} vehicles`);
  
  // Update the vehicle
  console.log('4. Updating the vehicle...');
  updateVehicle(newVehicle.id, {
    name: 'Updated Test Vehicle',
    price: 'ZMW 150,000'
  });
  
  console.log('   Vehicle updated');
  
  // Get vehicles again to verify the update
  console.log('5. Verifying vehicle was updated...');
  const vehiclesAfterUpdate = getVehicles();
  const updatedVehicle = vehiclesAfterUpdate.find(v => v.id === newVehicle.id);
  console.log(`   Vehicle name: ${updatedVehicle?.name}`);
  console.log(`   Vehicle price: ${updatedVehicle?.price}`);
  
  // Delete the vehicle
  console.log('6. Deleting the vehicle...');
  deleteVehicle(newVehicle.id);
  
  console.log('   Vehicle deleted');
  
  // Get vehicles again to verify the deletion
  console.log('7. Verifying vehicle was deleted...');
  const vehiclesAfterDelete = getVehicles();
  console.log(`   Found ${vehiclesAfterDelete.length} vehicles`);
  
  console.log('=== Test Complete ===');
}