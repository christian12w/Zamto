// Script to clear vehicle cache and refresh data
console.log('Clearing vehicle cache...');

// Clear the vehicle cache
localStorage.removeItem('vehicles_cache');
localStorage.removeItem('vehicles_cache_timestamp');

console.log('Vehicle cache cleared successfully!');

// Optional: Reload the page to see the changes
console.log('Reloading page to show updated vehicle data...');
setTimeout(() => {
  window.location.reload();
}, 1000);