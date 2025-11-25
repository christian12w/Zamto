import { searchVehicles } from './searchVehicles';
import { Vehicle } from './vehicleStorage';

// Simple test function to mimic Jest-like behavior
function runTest(name: string, testFn: () => void) {
  try {
    testFn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error}`);
  }
}

// Simple assertion functions
function expect(actual: any) {
  return {
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toHaveLength(expected: number) {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected}, but got ${actual.length}`);
      }
    },
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    }
  };
}

// Mock vehicle data for testing
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Toyota Land Cruiser',
    category: 'SUV',
    price: 'ZMW 450,000',
    image: 'https://example.com/landcruiser.jpg',
    images: [{ url: 'https://example.com/landcruiser.jpg', label: 'exterior' }],
    description: 'Powerful and reliable SUV for all terrains',
    features: ['4WD', '7-seater', 'Leather interior'],
    popular: true,
    type: 'sale',
    year: 2020,
    mileage: '30,000 km',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    engineSize: '4.5L V8',
    doors: 5,
    seats: 7,
    color: 'White',
    condition: 'Good',
    whatsappContact: '+260572213038'
  },
  {
    id: '2',
    name: 'Honda Civic',
    category: 'SMALL CARS',
    price: 'ZMW 180,000',
    image: 'https://example.com/civic.jpg',
    images: [{ url: 'https://example.com/civic.jpg', label: 'exterior' }],
    description: 'Compact and fuel-efficient sedan',
    features: ['Air conditioning', 'Bluetooth', 'Backup camera'],
    popular: false,
    type: 'sale',
    year: 2019,
    mileage: '45,000 km',
    transmission: 'CVT',
    fuelType: 'Petrol',
    engineSize: '1.8L',
    doors: 4,
    seats: 5,
    color: 'Silver',
    condition: 'Good',
    whatsappContact: '+260572213038'
  },
  {
    id: '3',
    name: 'Ford Ranger',
    category: 'PICKUP TRUCKS',
    price: '', // Required field for Vehicle interface
    dailyRate: 'ZMW 500/day',
    image: 'https://example.com/ranger.jpg',
    images: [{ url: 'https://example.com/ranger.jpg', label: 'exterior' }],
    description: 'Durable pickup truck for work and adventure',
    features: ['4WD', 'Payload capacity 1000kg', 'Towing capacity 3500kg'],
    popular: true,
    type: 'hire',
    year: 2021,
    mileage: '25,000 km',
    transmission: 'Manual',
    fuelType: 'Diesel',
    engineSize: '3.2L',
    doors: 4,
    seats: 5,
    color: 'Black',
    condition: 'Excellent',
    whatsappContact: '+260572213038'
  }
];

// Run tests
console.log('Running searchVehicles tests...\n');

runTest('should return all vehicles when query is empty', () => {
  const result = searchVehicles(mockVehicles, '');
  expect(result).toEqual(mockVehicles);
});

runTest('should return all vehicles when query is whitespace', () => {
  const result = searchVehicles(mockVehicles, '   ');
  expect(result).toEqual(mockVehicles);
});

runTest('should search by vehicle name', () => {
  const result = searchVehicles(mockVehicles, 'Toyota');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Toyota Land Cruiser');
});

runTest('should search by vehicle description', () => {
  const result = searchVehicles(mockVehicles, 'fuel-efficient');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Honda Civic');
});

runTest('should search by vehicle category', () => {
  const result = searchVehicles(mockVehicles, 'SUV');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Toyota Land Cruiser');
});

runTest('should search by vehicle features', () => {
  const result = searchVehicles(mockVehicles, '4WD');
  expect(result).toHaveLength(2);
  expect(result[0].name).toBe('Toyota Land Cruiser');
  expect(result[1].name).toBe('Ford Ranger');
});

runTest('should search by vehicle color', () => {
  const result = searchVehicles(mockVehicles, 'White');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Toyota Land Cruiser');
});

runTest('should search by engine size', () => {
  const result = searchVehicles(mockVehicles, '4.5L');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Toyota Land Cruiser');
});

runTest('should search by transmission type', () => {
  const result = searchVehicles(mockVehicles, 'CVT');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Honda Civic');
});

runTest('should search by fuel type', () => {
  const result = searchVehicles(mockVehicles, 'Petrol');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Honda Civic');
});

runTest('should return empty array for no matches', () => {
  const result = searchVehicles(mockVehicles, 'Motorcycle');
  expect(result).toHaveLength(0);
});

runTest('should perform case-insensitive search', () => {
  const result = searchVehicles(mockVehicles, 'toyota');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Toyota Land Cruiser');
});

console.log('\nAll tests completed.');