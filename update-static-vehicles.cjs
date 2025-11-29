const fs = require('fs');
const path = require('path');

// Read the MongoDB extracted vehicles
const mongoVehiclesPath = path.join(__dirname, 'all-mongodb-vehicles.json');
const staticVehiclesPath = path.join(__dirname, 'src', 'data', 'vehicles.json');

// Read the MongoDB vehicles
const mongoVehiclesData = fs.readFileSync(mongoVehiclesPath, 'utf8');
const mongoVehicles = JSON.parse(mongoVehiclesData);

console.log(`Found ${mongoVehicles.length} vehicles in MongoDB data`);

// Transform MongoDB vehicles to match the static data format
const transformedVehicles = mongoVehicles.map((vehicle, index) => {
  // Handle the case where MongoDB uses _id instead of id
  const id = vehicle.id || vehicle._id || `veh-${index + 1}`;
  
  // Transform images if they exist
  let images = [];
  if (vehicle.images && Array.isArray(vehicle.images)) {
    images = vehicle.images.map(img => {
      // If it's already in the correct format
      if (typeof img === 'object' && img.url) {
        return img;
      }
      // If it's a string URL
      if (typeof img === 'string') {
        return {
          url: img,
          label: 'exterior' // Default label
        };
      }
      // Default image object
      return {
        url: img.url || '/placeholder.jpg',
        label: img.label || 'exterior'
      };
    });
  } else if (vehicle.image) {
    // If there's only a single image field
    images = [{
      url: vehicle.image,
      label: 'exterior'
    }];
  } else {
    // Default placeholder images
    images = [
      {
        url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
        label: 'exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
        label: 'interior'
      }
    ];
  }
  
  // Transform features if they exist
  let features = [];
  if (vehicle.features && Array.isArray(vehicle.features)) {
    features = vehicle.features;
  } else if (typeof vehicle.features === 'string') {
    // If features is a comma-separated string
    features = vehicle.features.split(',').map(f => f.trim()).filter(f => f.length > 0);
  }
  
  // Determine vehicle type (sale or hire)
  const type = vehicle.type || (vehicle.dailyRate ? 'hire' : 'sale');
  
  // Create the transformed vehicle object
  return {
    id: id.toString(),
    name: vehicle.name || `Vehicle ${index + 1}`,
    category: vehicle.category || 'SUV',
    price: vehicle.price || 'ZMW 0',
    dailyRate: vehicle.dailyRate || '',
    image: images[0]?.url || '/placeholder.jpg',
    images: images,
    description: vehicle.description || `Description for ${vehicle.name || `Vehicle ${index + 1}`}`,
    features: features,
    popular: vehicle.popular || false,
    year: vehicle.year || new Date().getFullYear(),
    mileage: vehicle.mileage || '',
    transmission: vehicle.transmission || 'Automatic',
    fuelType: vehicle.fuelType || 'Petrol',
    type: type,
    engineSize: vehicle.engineSize || '',
    doors: vehicle.doors || 4,
    seats: vehicle.seats || 5,
    color: vehicle.color || '',
    condition: vehicle.condition || 'Good',
    serviceHistory: vehicle.serviceHistory || '',
    accidentHistory: vehicle.accidentHistory || '',
    warranty: vehicle.warranty || '',
    registrationStatus: vehicle.registrationStatus || '',
    insuranceStatus: vehicle.insuranceStatus || '',
    whatsappContact: vehicle.whatsappContact || '+260572213038',
    status: vehicle.status || 'available'
  };
});

console.log(`Transformed ${transformedVehicles.length} vehicles`);

// Read the current static vehicles to preserve any existing structure
let staticVehicles = [];
try {
  const staticVehiclesData = fs.readFileSync(staticVehiclesPath, 'utf8');
  staticVehicles = JSON.parse(staticVehiclesData);
  console.log(`Found ${staticVehicles.length} existing vehicles in static data`);
} catch (error) {
  console.log('No existing static vehicles found, creating new file');
}

// Update the static vehicles file
try {
  fs.writeFileSync(staticVehiclesPath, JSON.stringify(transformedVehicles, null, 2));
  console.log(`Successfully updated static vehicles file with ${transformedVehicles.length} vehicles`);
  
  // Also update localStorage cache keys in the browser
  console.log('\nTo update the browser cache, you can run this in the browser console:');
  console.log('localStorage.setItem("vehicles_cache", JSON.stringify(', JSON.stringify(transformedVehicles), '));');
  console.log('localStorage.setItem("vehicles_cache_timestamp", Date.now().toString());');
  console.log('window.dispatchEvent(new Event("vehiclesUpdated"));');
  
} catch (error) {
  console.error('Failed to update static vehicles file:', error);
}

console.log('\nUpdate complete!');