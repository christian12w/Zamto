// Diagnostic script to test API connectivity
console.log('Testing API connectivity...');

// Test the API base URL
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
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
  .then(response => {
    console.log('Vehicles endpoint response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Vehicles endpoint response data:', data);
  })
  .catch(error => {
    console.error('Vehicles endpoint failed:', error);
  });