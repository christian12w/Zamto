// Script to force refresh vehicle data by bypassing cache
console.log('Force refreshing vehicle data...');

// Clear the vehicle cache first
localStorage.removeItem('vehicles_cache');
localStorage.removeItem('vehicles_cache_timestamp');

// Set a flag to bypass cache
localStorage.setItem('bypass_vehicle_cache', 'true');

console.log('Cache cleared and bypass flag set!');

// Reload the page to fetch fresh data
console.log('Reloading page to fetch fresh vehicle data...');
setTimeout(() => {
  window.location.reload();
}, 1000);