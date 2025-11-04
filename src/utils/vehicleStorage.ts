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
}
const STORAGE_KEY = 'zamto_vehicles';
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
  fuelType: 'Diesel'
}, {
  id: '2',
  name: 'Toyota Hilux Double Cab',
  category: 'SUV',
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
  fuelType: 'Diesel'
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
  fuelType: 'Petrol'
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
  fuelType: 'Petrol'
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
  fuelType: 'Petrol'
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
  fuelType: 'Petrol'
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
  fuelType: 'Diesel'
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
  fuelType: 'Petrol'
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
  fuelType: 'Petrol'
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
  fuelType: 'Petrol'
}];
export function getVehicles(): Vehicle[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVehicles));
    return defaultVehicles;
  }
  return JSON.parse(stored);
}
export function saveVehicles(vehicles: Vehicle[]): void {
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