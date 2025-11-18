const fs = require('fs');

// Test if essential files exist
const essentialFiles = [
  'src/App.tsx',
  'src/AppRouter.tsx',
  'server.cjs',
  'db/config.cjs',
  'db/models/User.cjs',
  'db/models/Vehicle.cjs'
];

console.log('Checking essential files:');
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} missing`);
  }
});

console.log('\nEnvironment variables:');
const envContent = fs.readFileSync('.env', 'utf8');
console.log(envContent);

console.log('\nTest completed successfully');