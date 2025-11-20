// Simple script to add a test vehicle to localStorage
const testVehicle = {
  id: 'test-1',
  name: 'Test Vehicle',
  category: 'SUV',
  price: 'ZMW 250,000',
  image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
    label: 'exterior'
  }],
  description: 'Test vehicle to verify frontend display functionality',
  features: ['Air Conditioning', 'Bluetooth', 'Backup Camera'],
  type: 'sale',
  popular: false,
  year: 2020,
  mileage: '30,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  engineSize: '2.0L',
  doors: 4,
  seats: 5,
  color: 'White',
  condition: 'Good',
  serviceHistory: 'Full service history',
  accidentHistory: 'No accident history',
  warranty: '12 months',
  registrationStatus: 'Valid',
  whatsappContact: '+260971234567'
};

// Add to localStorage
const vehiclesCache = JSON.parse(localStorage.getItem('vehicles_cache') || '[]');
vehiclesCache.push(testVehicle);
localStorage.setItem('vehicles_cache', JSON.stringify(vehiclesCache));
console.log('Test vehicle added to localStorage');