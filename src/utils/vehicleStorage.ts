export interface VehicleImage {
  url: string;
  label: 'exterior' | 'interior' | 'front' | 'back' | 'additional';
}

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  images: VehicleImage[];
  description: string;
  features: string[];
  popular: boolean;
  year?: number;
  mileage?: string;
  transmission?: string;
  fuelType?: string;
  // New field to distinguish between sale and hire
  type: 'sale' | 'hire';
  // For hire vehicles, we might want to show daily rate
  dailyRate?: string;
  
  // Additional important details for buyers
  engineSize?: string;        // e.g., "2.0L", "3.5L V6"
  doors?: number;             // Number of doors
  seats?: number;             // Seating capacity
  color?: string;             // Vehicle color
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';  // Vehicle condition
  serviceHistory?: string;    // Service history details
  accidentHistory?: string;   // Accident history information
  warranty?: string;          // Warranty information
  registrationStatus?: string; // Registration status
  insuranceStatus?: string;   // Insurance status (for hire vehicles)
}

// Cache for vehicles to avoid repeated localStorage reads
let vehiclesCache: Vehicle[] | null = null;
// Cache for the last time localStorage was updated
let lastUpdateTimestamp: number = 0;

const STORAGE_KEY = 'zamto_vehicles';
const CACHE_DURATION = 1000; // 1 second cache duration

const defaultVehicles: Vehicle[] = [{
  id: '1',
  name: 'Toyota Land Cruiser Prado',
  category: 'SUV',
  price: 'ZMW 450,000',
  image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    label: 'exterior'
  }],
  description: 'Premium SUV perfect for Zambian terrain. Powerful, reliable, and luxurious.',
  features: ['4WD', '7-seater', 'Leather interior', 'Sunroof'],
  popular: true,
  year: 2018,
  mileage: '85,000 km',
  transmission: 'Automatic',
  fuelType: 'Diesel',
  type: 'sale',
  engineSize: '4.0L V6',
  doors: 5,
  seats: 7,
  color: 'White',
  condition: 'Good',
  serviceHistory: 'Full service history with Toyota dealership',
  accidentHistory: 'No accident history',
  warranty: '6 months',
  registrationStatus: 'Valid until 2026'
}, {
  id: '2',
  name: 'Toyota Hilux Double Cab',
  category: 'PICKUP TRUCKS',
  price: 'ZMW 320,000',
  image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    label: 'exterior'
  }],
  description: 'Legendary reliability. Perfect for business and adventure.',
  features: ['4x4', '1-ton payload', 'Durable', 'Low maintenance'],
  popular: true,
  year: 2019,
  mileage: '120,000 km',
  transmission: 'Manual',
  fuelType: 'Diesel',
  type: 'sale',
  engineSize: '2.8L Turbo Diesel',
  doors: 4,
  seats: 5,
  color: 'Silver',
  condition: 'Good',
  serviceHistory: 'Regular maintenance records',
  accidentHistory: 'Minor front bumper repair',
  warranty: '3 months',
  registrationStatus: 'Valid until 2025'
}, {
  id: '3',
  name: 'Toyota Vitz',
  category: 'SMALL CARS',
  price: 'ZMW 65,000',
  image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    label: 'exterior'
  }],
  description: 'Economical city car. Perfect for daily commutes and fuel efficiency.',
  features: ['Fuel efficient', 'Easy parking', 'Low running costs', 'Reliable'],
  popular: false,
  year: 2015,
  mileage: '95,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '1.0L',
  doors: 5,
  seats: 5,
  color: 'Red',
  condition: 'Fair',
  serviceHistory: 'Partial service history',
  accidentHistory: 'No major accidents',
  warranty: '1 month',
  registrationStatus: 'Valid until 2024'
}, {
  id: '4',
  name: 'Toyota Noah',
  category: 'GROUPS & FAMILY CARS',
  price: 'ZMW 180,000',
  image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
    label: 'exterior'
  }],
  description: 'Spacious family van with sliding doors and comfortable seating.',
  features: ['8-seater', 'Sliding doors', 'Air conditioning', 'Entertainment system'],
  popular: false,
  year: 2016,
  mileage: '110,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '2.0L',
  doors: 5,
  seats: 8,
  color: 'White',
  condition: 'Good',
  serviceHistory: 'Complete service history',
  accidentHistory: 'No accident history',
  warranty: '3 months',
  registrationStatus: 'Valid until 2025'
}, {
  id: '5',
  name: 'Nissan X-Trail',
  category: 'SUV',
  price: 'ZMW 220,000',
  image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    label: 'exterior'
  }],
  description: 'Modern SUV with advanced safety features and comfort.',
  features: ['AWD', '5-seater', 'Panoramic roof', 'Advanced safety'],
  popular: true,
  year: 2017,
  mileage: '90,000 km',
  transmission: 'CVT',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '2.0L Turbo',
  doors: 5,
  seats: 5,
  color: 'Blue',
  condition: 'Good',
  serviceHistory: 'Regular maintenance',
  accidentHistory: 'No accident history',
  warranty: '6 months',
  registrationStatus: 'Valid until 2026'
}, {
  id: '6',
  name: 'Honda Fit',
  category: 'SMALL CARS',
  price: 'ZMW 75,000',
  image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
    label: 'exterior'
  }],
  description: 'Versatile compact car with magic seats and excellent fuel economy.',
  features: ['Magic seats', 'Fuel efficient', 'Spacious interior', 'Reliable'],
  popular: false,
  year: 2014,
  mileage: '105,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '1.3L',
  doors: 5,
  seats: 5,
  color: 'Silver',
  condition: 'Fair',
  serviceHistory: 'Partial service history',
  accidentHistory: 'Minor rear bumper repair',
  warranty: '1 month',
  registrationStatus: 'Valid until 2024'
}, {
  id: '7',
  name: 'Toyota Fortuner',
  category: 'SUV',
  price: 'ZMW 380,000',
  image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    label: 'exterior'
  }],
  description: 'Powerful SUV built on the Hilux platform. Perfect for families and adventures.',
  features: ['4WD', '7-seater', 'Premium interior', 'High ground clearance'],
  popular: true,
  year: 2018,
  mileage: '75,000 km',
  transmission: 'Automatic',
  fuelType: 'Diesel',
  type: 'sale',
  engineSize: '2.8L Turbo Diesel',
  doors: 5,
  seats: 7,
  color: 'Black',
  condition: 'Excellent',
  serviceHistory: 'Full service history',
  accidentHistory: 'No accident history',
  warranty: '12 months',
  registrationStatus: 'Valid until 2027'
}, {
  id: '8',
  name: 'Mazda Demio',
  category: 'SMALL CARS',
  price: 'ZMW 58,000',
  image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    label: 'exterior'
  }],
  description: 'Stylish and economical hatchback. Great for city driving.',
  features: ['Fuel efficient', 'Modern design', 'Easy to maintain', 'Compact'],
  popular: false,
  year: 2013,
  mileage: '115,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '1.3L',
  doors: 5,
  seats: 5,
  color: 'White',
  condition: 'Fair',
  serviceHistory: 'Partial service history',
  accidentHistory: 'No major accidents',
  warranty: '1 month',
  registrationStatus: 'Valid until 2024'
}, {
  id: '9',
  name: 'Toyota Alphard',
  category: 'GROUPS & FAMILY CARS',
  price: 'ZMW 420,000',
  image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
    label: 'exterior'
  }],
  description: 'Luxury MPV with premium features. Perfect for VIP transport and families.',
  features: ['7-seater', 'Luxury interior', 'Entertainment system', 'Electric doors'],
  popular: true,
  year: 2017,
  mileage: '65,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '3.5L V6',
  doors: 5,
  seats: 7,
  color: 'Silver',
  condition: 'Excellent',
  serviceHistory: 'Full service history',
  accidentHistory: 'No accident history',
  warranty: '12 months',
  registrationStatus: 'Valid until 2026'
}, {
  id: '10',
  name: 'Subaru Forester',
  category: 'SUV',
  price: 'ZMW 195,000',
  image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    label: 'exterior'
  }],
  description: 'All-wheel drive SUV perfect for all terrains. Reliable and spacious.',
  features: ['AWD', 'Boxer engine', 'Spacious', 'Safety features'],
  popular: false,
  year: 2016,
  mileage: '100,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'sale',
  engineSize: '2.0L Boxer',
  doors: 5,
  seats: 5,
  color: 'Green',
  condition: 'Good',
  serviceHistory: 'Regular maintenance',
  accidentHistory: 'No accident history',
  warranty: '6 months',
  registrationStatus: 'Valid until 2025'
}];

// Let's add some vehicles for hire as examples
defaultVehicles.push({
  id: '11',
  name: 'Toyota Camry',
  category: 'GROUPS & FAMILY CARS',
  price: 'ZMW 250,000',
  dailyRate: 'ZMW 500/day',
  image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    label: 'exterior'
  }],
  description: 'Comfortable sedan perfect for business trips or family outings. Well-maintained and reliable.',
  features: ['Air conditioning', 'Bluetooth', 'GPS', 'Automatic transmission'],
  popular: true,
  year: 2020,
  mileage: '45,000 km',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  type: 'hire',
  engineSize: '2.0L',
  doors: 4,
  seats: 5,
  color: 'White',
  condition: 'Excellent',
  serviceHistory: 'Full service history',
  accidentHistory: 'No accident history',
  registrationStatus: 'Valid until 2027',
  insuranceStatus: 'Comprehensive, Valid until 2025'
}, {
  id: '12',
  name: 'Nissan Patrol',
  category: 'SUV',
  price: 'ZMW 400,000',
  dailyRate: 'ZMW 800/day',
  image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    label: 'exterior'
  }],
  description: 'Spacious SUV ideal for group travel or off-road adventures. Perfect for exploring Zambia.',
  features: ['4WD', '7-seater', 'Roof rack', 'Refrigerator'],
  popular: true,
  year: 2019,
  mileage: '60,000 km',
  transmission: 'Automatic',
  fuelType: 'Diesel',
  type: 'hire',
  engineSize: '4.8L V8',
  doors: 5,
  seats: 7,
  color: 'Black',
  condition: 'Excellent',
  serviceHistory: 'Full service history',
  accidentHistory: 'No accident history',
  registrationStatus: 'Valid until 2026',
  insuranceStatus: 'Comprehensive, Valid until 2025'
}, {
  id: '13',
  name: 'Toyota Hilux Single Cab',
  category: 'PICKUP TRUCKS',
  price: 'ZMW 280,000',
  dailyRate: 'ZMW 700/day',
  image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
  images: [{
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    label: 'exterior'
  }],
  description: 'Durable pickup truck perfect for cargo transport and commercial use. Reliable and fuel-efficient.',
  features: ['4x4', 'Payload capacity', 'Durable build', 'Low maintenance'],
  popular: true,
  year: 2021,
  mileage: '35,000 km',
  transmission: 'Manual',
  fuelType: 'Diesel',
  type: 'hire',
  engineSize: '2.8L Turbo Diesel',
  doors: 2,
  seats: 3,
  color: 'White',
  condition: 'Excellent',
  serviceHistory: 'Full service history',
  accidentHistory: 'No accident history',
  registrationStatus: 'Valid until 2028',
  insuranceStatus: 'Commercial, Valid until 2026'
});

// Function to get vehicles with caching
export function getVehicles(): Vehicle[] {
  const now = Date.now();
  
  // Check if cache is valid
  if (vehiclesCache && (now - lastUpdateTimestamp) < CACHE_DURATION) {
    return vehiclesCache;
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  let vehicles: Vehicle[];
  
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVehicles));
    vehicles = defaultVehicles;
  } else {
    vehicles = JSON.parse(stored);
  }
  
  // Update cache
  vehiclesCache = vehicles;
  lastUpdateTimestamp = now;
  
  return vehicles;
}

// Function to save vehicles and invalidate cache
export function saveVehicles(vehicles: Vehicle[]): void {
  // Invalidate cache
  vehiclesCache = null;
  lastUpdateTimestamp = 0;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  window.dispatchEvent(new CustomEvent('vehiclesUpdated'));
}

export function addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
  const vehicles = getVehicles();
  const newVehicle = {
    ...vehicle,
    id: Date.now().toString()
  };
  vehicles.push(newVehicle);
  saveVehicles(vehicles);
  return newVehicle;
}

export function updateVehicle(id: string, updates: Partial<Vehicle>): void {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  if (index !== -1) {
    vehicles[index] = {
      ...vehicles[index],
      ...updates
    };
    saveVehicles(vehicles);
  }
}

export function deleteVehicle(id: string): void {
  const vehicles = getVehicles();
  const filtered = vehicles.filter(v => v.id !== id);
  saveVehicles(filtered);
}