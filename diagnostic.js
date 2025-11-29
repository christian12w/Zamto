const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

console.log('Testing API connectivity...');
console.log('API Base URL:', API_BASE_URL);

// Test health endpoint
fetch(`${API_BASE_URL}/health`)
  .then(response => {
    console.log('Health check response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Health check response data:', data);
  })
  .catch(error => {
    console.error('Health check failed:', error);
  });

// Test vehicles endpoint
fetch(`${API_BASE_URL}/vehicles`)
  .then(response => response.json())
  .then(data => {
    console.log('Vehicles endpoint response:', {
      count: data.length,
      firstVehicle: data[0]?.name
    });
  })
  .catch(error => {
    console.error('Vehicles endpoint failed:', error);
  });