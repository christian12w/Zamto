const { readFileSync } = require('fs');

// Mock the useAuth hook for testing
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWIxNTQ2MTZhNjFjMzUyNDMwMWM1NiIsInVzZXJuYW1lIjoibWFuYWdlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MzM4MjU5OSwiZXhwIjoxNzYzNDY4OTk5fQ.bSJwAVtw-UcdOCNdQpdPtGAyEmQUprk7kCGdMYmd3vM';

const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  
  // Parse headers
  const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
  
  // Parse rows
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/^"|"$/g, ''));
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      result.push(row);
    }
  }
  
  return result;
};

const convertToVehicleFormat = (csvData) => {
  return csvData.map(row => ({
    name: row.name || '',
    category: row.category || 'SUV',
    price: row.price || '',
    dailyRate: row.dailyRate || '',
    image: row.image || '',
    images: row.images ? (() => {
      try {
        return JSON.parse(row.images);
      } catch {
        // If JSON parsing fails, treat as comma-separated URLs
        return row.images.split(',').map((url) => ({
          url: url.trim(),
          label: 'exterior'
        }));
      }
    })() : [],
    description: row.description || '',
    features: row.features ? row.features.split(',').map((f) => f.trim()) : [],
    popular: row.popular === 'true' || row.popular === '1' || false,
    year: row.year ? parseInt(row.year, 10) : undefined,
    mileage: row.mileage || '',
    transmission: row.transmission || 'Automatic',
    fuelType: row.fuelType || 'Petrol',
    type: row.type || 'sale',
    engineSize: row.engineSize || '',
    doors: row.doors ? parseInt(row.doors, 10) : undefined,
    seats: row.seats ? parseInt(row.seats, 10) : undefined,
    color: row.color || '',
    condition: row.condition || 'Good',
    serviceHistory: row.serviceHistory || '',
    accidentHistory: row.accidentHistory || '',
    warranty: row.warranty || '',
    registrationStatus: row.registrationStatus || '',
    insuranceStatus: row.insuranceStatus || ''
  }));
};

// Read and test the CSV file
const csvText = readFileSync('test-vehicles.csv', 'utf8');
const parsedData = parseCSV(csvText);
console.log('Parsed CSV Data:');
console.log(JSON.stringify(parsedData, null, 2));

const vehicleData = convertToVehicleFormat(parsedData);
console.log('\nConverted Vehicle Data:');
console.log(JSON.stringify(vehicleData, null, 2));

// Test sending data directly with fetch
console.log('\nTesting direct API call...');
fetch('http://localhost:3001/api/vehicles/import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${mockToken}`
  },
  body: JSON.stringify({ vehicles: vehicleData })
})
.then(res => res.json())
.then(response => {
  console.log('Direct API response:', response);
})
.catch(error => {
  console.error('Direct API error:', error);
});