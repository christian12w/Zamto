console.log('Testing static data loading configuration...');
console.log('==========================================');

// Test environment variables
console.log('VITE_USE_STATIC_DATA:', import.meta.env.VITE_USE_STATIC_DATA);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// Check if we should use static data
const useStaticData = import.meta.env.VITE_USE_STATIC_DATA === 'true';
console.log('Using static data:', useStaticData);

if (useStaticData) {
  console.log('Loading vehicles from static JSON files...');
  // Import and test static vehicle loading
  import('./src/data/vehicles.json')
    .then(data => {
      console.log('Successfully loaded static vehicle data');
      console.log('Number of vehicles:', data.default.length);
      console.log('First vehicle name:', data.default[0]?.name);
    })
    .catch(error => {
      console.error('Failed to load static vehicle data:', error);
    });

  // Import and test the static vehicle service
  import('./src/services/staticVehicleService.ts')
    .then(module => {
      console.log('Successfully imported static vehicle service');
      const service = module.staticVehicleService;
      
      // Test getting vehicles
      service.getVehicles()
        .then(response => {
          console.log('Static service getVehicles response:', {
            success: response.success,
            vehicleCount: response.vehicles?.length,
            message: response.message
          });
        })
        .catch(error => {
          console.error('Error calling static service getVehicles:', error);
        });
    })
    .catch(error => {
      console.error('Failed to import static vehicle service:', error);
    });
} else {
  console.log('Loading vehicles from API...');
  // Test API loading
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  fetch(`${API_BASE_URL}/vehicles`)
    .then(response => response.json())
    .then(data => {
      console.log(`Loaded ${data.length} vehicles from API`);
      if (data.length > 0) {
        console.log('Sample vehicle:', data[0]);
      }
    })
    .catch(error => {
      console.error('Failed to load vehicles from API:', error);
    });
}