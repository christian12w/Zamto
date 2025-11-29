// Script to update vehicles.json with data from localStorage cache
console.log('Updating vehicles from cache...');

try {
  // Get vehicles from localStorage cache
  const cachedVehicles = localStorage.getItem('vehicles_cache');
  
  if (cachedVehicles) {
    const vehicles = JSON.parse(cachedVehicles);
    console.log(`Found ${vehicles.length} vehicles in cache`);
    
    // In a real implementation, you would update the vehicles.json file here
    // Since we can't directly modify the file from JavaScript in the browser,
    // you would need to export this data and manually update the file
    
    console.log('Vehicles data from cache:');
    console.log(JSON.stringify(vehicles, null, 2));
    
    // Create a downloadable file with the cached data
    const dataStr = JSON.stringify(vehicles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'updated-vehicles.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('Exported vehicles data to file. Please replace src/data/vehicles.json with this file.');
  } else {
    console.log('No cached vehicles found');
  }
} catch (error) {
  console.error('Error updating vehicles from cache:', error);
}