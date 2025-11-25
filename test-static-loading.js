// Test script to verify static data loading
console.log('Testing static data loading configuration...');

// Check if environment variable is set correctly
console.log('VITE_USE_STATIC_DATA:', import.meta.env.VITE_USE_STATIC_DATA);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// Try to import the static data
import('./src/data/vehicles.json')
  .then(data => {
    console.log('Successfully loaded static vehicle data');
    console.log('Number of vehicles:', data.default.length);
    console.log('First vehicle name:', data.default[0]?.name);
  })
  .catch(error => {
    console.error('Failed to load static vehicle data:', error);
  });

// Try to import and test the static vehicle service
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