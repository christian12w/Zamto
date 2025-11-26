// Script to update vehicles in localStorage with original data
import vehiclesData from './src/data/vehicles.json' assert { type: 'json' };

function updateVehiclesCache() {
  try {
    // Update localStorage cache with original vehicle data
    localStorage.setItem('vehicles_cache', JSON.stringify(vehiclesData));
    localStorage.setItem('vehicles_cache_timestamp', Date.now().toString());
    
    console.log(`Successfully updated vehicles cache with ${vehiclesData.length} vehicles`);
    
    // Also update the old storage key if it exists
    localStorage.setItem('zamto_vehicles', JSON.stringify(vehiclesData));
    
    console.log('Vehicles cache updated successfully!');
    return true;
  } catch (error) {
    console.error('Failed to update vehicles cache:', error);
    return false;
  }
}

// Run the update
if (typeof window !== 'undefined') {
  updateVehiclesCache();
} else {
  console.log('This script should be run in a browser environment');
}

export { updateVehiclesCache };// Script to update vehicles in localStorage with original data
import vehiclesData from './src/data/vehicles.json' assert { type: 'json' };

function updateVehiclesCache() {
  try {
    // Update localStorage cache with original vehicle data
    localStorage.setItem('vehicles_cache', JSON.stringify(vehiclesData));
    localStorage.setItem('vehicles_cache_timestamp', Date.now().toString());
    
    console.log(`Successfully updated vehicles cache with ${vehiclesData.length} vehicles`);
    
    // Also update the old storage key if it exists
    localStorage.setItem('zamto_vehicles', JSON.stringify(vehiclesData));
    
    console.log('Vehicles cache updated successfully!');
    return true;
  } catch (error) {
    console.error('Failed to update vehicles cache:', error);
    return false;
  }
}

// Run the update
if (typeof window !== 'undefined') {
  updateVehiclesCache();
} else {
  console.log('This script should be run in a browser environment');
}

export { updateVehiclesCache };