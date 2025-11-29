// Diagnostic script to check vehicle storage issue
console.log('=== Vehicle Storage Diagnostic ===');

// Check the data files
console.log('\n1. Checking data files:');
const fs = require('fs');
const path = require('path');

const dataFiles = [
  'src/data/vehicles.json',
  'src/data/vehicles-updated.json',
  'src/data/vehicles-full-update.json'
];

dataFiles.forEach(file => {
  try {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`   ${file}: ${data.length} vehicles`);
      
      // Show first few vehicles
      if (data.length > 0) {
        console.log('   First 3 vehicles:');
        data.slice(0, 3).forEach((vehicle, index) => {
          console.log(`     ${index + 1}. ${vehicle.name} (${vehicle.id})`);
        });
      }
    } else {
      console.log(`   ${file}: File not found`);
    }
  } catch (error) {
    console.error(`   Error reading ${file}:`, error.message);
  }
});

// Check if we're using static data
console.log('\n2. Environment configuration:');
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const useStaticData = envContent.includes('VITE_USE_STATIC_DATA=true');
    console.log(`   VITE_USE_STATIC_DATA: ${useStaticData ? 'true' : 'false or not set'}`);
    
    // Show relevant environment variables
    const lines = envContent.split('\n');
    lines.forEach(line => {
      if (line.includes('VITE_USE_STATIC_DATA') || line.includes('VITE_API_BASE_URL')) {
        console.log(`   ${line.trim()}`);
      }
    });
  } else {
    console.log('   .env file not found');
  }
} catch (error) {
  console.error('   Error checking environment:', error.message);
}

console.log('\n=== End Diagnostic ===');