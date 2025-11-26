import { sanitizeInput } from './security';
import { fixVehicleStorage, fixDoubleEncodedAmpersands } from './fixVehicleStorage';
import { vehicleService } from '../services/vehicleService';
import { authService } from '../services/authService';

// Run the fix function when the module loads
fixVehicleStorage();

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
  
  // WhatsApp contact for inquiries
  whatsappContact?: string;   // WhatsApp number for vehicle inquiries
  
  // Status field to mark vehicles as available or sold
  status?: 'available' | 'sold'; // New field for vehicle status
}

export interface VehicleImage {
  url: string;
  label: 'exterior' | 'interior' | 'front' | 'back' | 'additional';
}

// Cache for vehicles to avoid repeated API calls
let vehiclesCache: Vehicle[] | null = null;
// Cache for the last time API was called
let lastUpdateTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // Extend cache to 30 minutes for better performance

// Persistent cache key for localStorage
const VEHICLE_CACHE_KEY = 'vehicles_cache';
const VEHICLE_CACHE_TIMESTAMP_KEY = 'vehicles_cache_timestamp';
const MAX_CACHED_VEHICLES = 100; // Limit to 100 vehicles for storage efficiency

// Initialize cache from localStorage on module load
function initializeCacheFromStorage() {
  try {
    const cachedVehicles = localStorage.getItem(VEHICLE_CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(VEHICLE_CACHE_TIMESTAMP_KEY);
    
    if (cachedVehicles && cachedTimestamp) {
      vehiclesCache = JSON.parse(cachedVehicles);
      lastUpdateTimestamp = parseInt(cachedTimestamp, 10);
      
      // Check if cache is still valid (less than 30 minutes old)
      const now = Date.now();
      if ((now - lastUpdateTimestamp) >= CACHE_DURATION) {
        // Cache expired, but we'll still use it if API fails
        console.log('Vehicle cache expired but keeping for offline use');
      }
    }
  } catch (error) {
    console.error('Failed to initialize cache from storage:', error);
    // Clear invalid cache
    localStorage.removeItem(VEHICLE_CACHE_KEY);
    localStorage.removeItem(VEHICLE_CACHE_TIMESTAMP_KEY);
  }
}

// Call initialization when module loads
initializeCacheFromStorage();

// Save cache to localStorage with size limit
function saveCacheToStorage(vehicles: Vehicle[]) {
  try {
    // Limit to MAX_CACHED_VEHICLES to prevent storage issues
    const vehiclesToCache = vehicles.slice(0, MAX_CACHED_VEHICLES);
    
    localStorage.setItem(VEHICLE_CACHE_KEY, JSON.stringify(vehiclesToCache));
    localStorage.setItem(VEHICLE_CACHE_TIMESTAMP_KEY, lastUpdateTimestamp.toString());
    
    console.log(`Saved ${vehiclesToCache.length} vehicles to localStorage cache`);
  } catch (error) {
    console.error('Failed to save cache to storage:', error);
    // Clear cache if storage fails (might be full)
    localStorage.removeItem(VEHICLE_CACHE_KEY);
    localStorage.removeItem(VEHICLE_CACHE_TIMESTAMP_KEY);
  }
}

// Get auth token from localStorage (for admin operations)
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Import the static vehicle service
import { staticVehicleService } from '../services/staticVehicleService';

// Fetch vehicles from API with better error handling and offline fallback
async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    console.log('Fetching vehicles from API...');
    const startTime = Date.now();
    
    // Check if we should use static data instead of API
    const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
    
    let response;
    if (useStaticData) {
      console.log('Using static vehicle data');
      response = await staticVehicleService.getVehicles();
    } else {
      response = await vehicleService.getVehicles();
    }
    
    const endTime = Date.now();
    console.log(`API call completed in ${endTime - startTime}ms`);
    console.log('Vehicle service response:', response);
    
    if (response.success && response.vehicles) {
      console.log(`Received ${response.vehicles.length} vehicles from API`);
      // Ensure all vehicles have proper IDs
      const vehiclesWithIds = response.vehicles.map(vehicle => {
        // Handle case where vehicle might come from MongoDB with _id instead of id
        const vehicleWithId = vehicle as Vehicle & { _id?: string };
        return {
          ...vehicle,
          id: vehicle.id || vehicleWithId._id || Math.random().toString(36).substr(2, 9)
        };
      });
      
      // Update localStorage cache immediately
      try {
        localStorage.setItem('vehicles_cache', JSON.stringify(vehiclesWithIds));
        localStorage.setItem('vehicles_cache_timestamp', Date.now().toString());
      } catch (storageError) {
        console.error('Failed to update localStorage cache:', storageError);
      }
      
      return vehiclesWithIds;
    } else {
      console.error('Failed to fetch vehicles:', response.message);
      throw new Error(response.message || 'Failed to fetch vehicles from API');
    }
  } catch (error: any) {
    console.error('Failed to fetch vehicles from API:', error);
    
    // If we have cached vehicles, return them as fallback for offline use
    if (vehiclesCache && vehiclesCache.length > 0) {
      console.log('Returning cached vehicles due to network error');
      return vehiclesCache;
    }
    
    // Try to load from localStorage as emergency backup
    try {
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      if (cachedVehicles) {
        const parsedVehicles = JSON.parse(cachedVehicles);
        if (parsedVehicles && parsedVehicles.length > 0) {
          console.log('Loaded vehicles from localStorage emergency backup');
          return parsedVehicles;
        }
      }
    } catch (parseError) {
      console.error('Failed to parse localStorage backup:', parseError);
    }
    
    // If it's a timeout or network error, try one more time
    if (error.message && (error.message.includes('timeout') || error.message.includes('network'))) {
      console.log('Retrying vehicle fetch due to network issue...');
      try {
        // Wait 2 seconds and try again
        await new Promise(resolve => setTimeout(resolve, 2000));
        const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
        let retryResponse;
        if (useStaticData) {
          retryResponse = await staticVehicleService.getVehicles();
        } else {
          retryResponse = await vehicleService.getVehicles();
        }
        if (retryResponse.success && retryResponse.vehicles) {
          const vehiclesWithIds = retryResponse.vehicles.map(vehicle => {
            const vehicleWithId = vehicle as Vehicle & { _id?: string };
            return {
              ...vehicle,
              id: vehicle.id || vehicleWithId._id || Math.random().toString(36).substr(2, 9)
            };
          });
          
          // Update localStorage cache
          try {
            localStorage.setItem('vehicles_cache', JSON.stringify(vehiclesWithIds));
            localStorage.setItem('vehicles_cache_timestamp', Date.now().toString());
          } catch (storageError) {
            console.error('Failed to update localStorage cache:', storageError);
          }
          
          return vehiclesWithIds;
        }
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        // Still return cached vehicles if available
        if (vehiclesCache && vehiclesCache.length > 0) {
          console.log('Returning cached vehicles after retry failure');
          return vehiclesCache;
        }
        
        // Try to load from localStorage as final emergency backup
        try {
          const cachedVehicles = localStorage.getItem('vehicles_cache');
          if (cachedVehicles) {
            const parsedVehicles = JSON.parse(cachedVehicles);
            if (parsedVehicles && parsedVehicles.length > 0) {
              console.log('Loaded vehicles from localStorage emergency backup after retry');
              return parsedVehicles;
            }
          }
        } catch (parseError) {
          console.error('Failed to parse localStorage backup:', parseError);
        }
      }
    }
    
    return [];
  }
}

// Save vehicles to API (admin only)
async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  // For API-based storage, we don't need to save the entire list
  // The API handles persistence
  return Promise.resolve();
}

// Get all vehicles with caching and enhanced fallback mechanisms
export async function getVehicles(forceRefresh: boolean = false): Promise<Vehicle[]> {
  const now = Date.now();
  
  // Check if we have a valid cache
  if (!forceRefresh && vehiclesCache && lastUpdateTimestamp) {
    const cacheAge = now - lastUpdateTimestamp;
    if (cacheAge < CACHE_DURATION) {
      console.log('Returning vehicles from cache');
      return vehiclesCache;
    }
  }
  
  try {
    const vehicles = await fetchVehicles();
    
    // If we got vehicles, update cache
    if (vehicles && vehicles.length > 0) {
      // Update cache
      vehiclesCache = vehicles;
      lastUpdateTimestamp = now;
      
      // Save to localStorage for offline use
      saveCacheToStorage(vehicles);
      
      return vehicles;
    } else {
      // If fetchVehicles returned empty array but we have cached vehicles, return them
      if (vehiclesCache && vehiclesCache.length > 0) {
        console.log('Returning cached vehicles as fetchVehicles returned empty');
        return vehiclesCache;
      }
      
      // Try to load from localStorage as last resort
      try {
        const cachedVehicles = localStorage.getItem('vehicles_cache');
        if (cachedVehicles) {
          const parsedVehicles = JSON.parse(cachedVehicles);
          if (parsedVehicles && parsedVehicles.length > 0) {
            console.log('Loaded vehicles from localStorage as last resort');
            // Update in-memory cache
            vehiclesCache = parsedVehicles;
            lastUpdateTimestamp = now;
            return parsedVehicles;
          }
        }
      } catch (parseError) {
        console.error('Failed to parse localStorage backup:', parseError);
      }
      
      // Return whatever we have (could be empty array)
      return vehicles || [];
    }
  } catch (error) {
    console.error('Error in getVehicles:', error);
    
    // If we have cached vehicles, return them as fallback
    if (vehiclesCache && vehiclesCache.length > 0) {
      console.log('Returning cached vehicles due to error');
      return vehiclesCache;
    }
    
    // Try to load from localStorage as emergency backup
    try {
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      if (cachedVehicles) {
        const parsedVehicles = JSON.parse(cachedVehicles);
        if (parsedVehicles && parsedVehicles.length > 0) {
          console.log('Loaded vehicles from localStorage emergency backup in getVehicles');
          // Update in-memory cache
          vehiclesCache = parsedVehicles;
          lastUpdateTimestamp = now;
          return parsedVehicles;
        }
      }
    } catch (parseError) {
      console.error('Failed to parse localStorage backup:', parseError);
    }
    
    // Return empty array if all else fails
    return [];
  }
}

// Refresh vehicles cache
export async function refreshVehicles(): Promise<Vehicle[]> {
  vehiclesCache = null;
  lastUpdateTimestamp = 0;
  return getVehicles(true);
}

// Clear vehicles cache
export function clearVehicleCache(): void {
  vehiclesCache = null;
  lastUpdateTimestamp = 0;
  localStorage.removeItem(VEHICLE_CACHE_KEY);
  localStorage.removeItem(VEHICLE_CACHE_TIMESTAMP_KEY);
}

// Create a test vehicle
export async function createTestVehicle(): Promise<Vehicle | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('Authentication required to create test vehicle');
      alert('Authentication required. Please log in again.');
      return null;
    }
    
    // Validate token before proceeding
    const validation = await authService.validateToken(token);
    if (!validation.valid) {
      console.error('Invalid or expired token');
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return null;
    }
    
    const testVehicleData: Omit<Vehicle, 'id'> = {
      name: 'Test Vehicle',
      category: 'SUV',
      price: 'K500,000',
      image: '/placeholder.jpg',
      images: [
        { url: '/placeholder.jpg', label: 'exterior' }
      ],
      description: 'This is a test vehicle for demonstration purposes.',
      features: ['Air Conditioning', 'Bluetooth', 'Backup Camera'],
      popular: true,
      type: 'sale',
      year: new Date().getFullYear(),
      mileage: '0 km',
      transmission: 'Automatic',
      fuelType: 'Petrol'
    };
    
    const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
    
    if (useStaticData) {
      // For static data, we'll add to localStorage cache
      let vehicles: Vehicle[] = [];
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      
      if (cachedVehicles) {
        try {
          vehicles = JSON.parse(cachedVehicles);
        } catch (e) {
          // If parsing fails, get fresh data
          vehicles = await getVehicles();
        }
      } else {
        // If no cache exists, get fresh data
        vehicles = await getVehicles();
      }
      
      // Add the new vehicle
      const newVehicle: Vehicle = {
        ...testVehicleData,
        id: `test-${Date.now()}`
      };
      
      vehicles.push(newVehicle);
      
      // Update localStorage
      localStorage.setItem('vehicles_cache', JSON.stringify(vehicles));
      
      // Update cache
      vehiclesCache = vehicles;
      lastUpdateTimestamp = Date.now();
      
      // Dispatch event to notify other parts of the app that vehicles have been updated
      window.dispatchEvent(new Event('vehiclesUpdated'));
      
      alert('Test vehicle created successfully!');
      
      return newVehicle;
    } else {
      // API-based implementation
      const response = await vehicleService.addVehicle(testVehicleData, token);
      if (response.success && response.vehicle) {
        // Clear cache to force refresh on next getVehicles call
        vehiclesCache = null;
        lastUpdateTimestamp = 0;
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        alert('Test vehicle created successfully!');
        
        return response.vehicle;
      } else {
        console.error('Failed to create test vehicle:', response.message);
        alert(`Failed to create test vehicle: ${response.message}`);
        return null;
      }
    }
  } catch (error: any) {
    console.error('Failed to create test vehicle:', error);
    alert('An error occurred while creating the test vehicle. Please try again.');
    return null;
  }
}

export async function addVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('Authentication required to add vehicle');
      alert('Authentication required. Please log in again.');
      // Redirect to login page
      window.location.href = '/login';
      return null;
    }
    
    // Validate token before proceeding
    const validation = await authService.validateToken(token);
    if (!validation.valid) {
      console.error('Invalid or expired token');
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return null;
    }
    
    // Show a loading message to the user
    alert('Adding vehicle... This may take a moment as the server wakes up from sleep mode.');
    
    // Ensure WhatsApp contact is included in the data
    const vehicleDataWithWhatsApp = {
      ...vehicleData,
      whatsappContact: vehicleData.whatsappContact || '+260572213038' // Default to company number
    };
    
    // Fix any double-encoded data in the input
    const fixedData: any = {
      ...vehicleDataWithWhatsApp,
      name: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.name),
      category: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.category),
      price: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.price),
      description: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.description),
      features: vehicleDataWithWhatsApp.features.map((feature: string) => fixDoubleEncodedAmpersands(feature)),
      image: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.image),
      images: vehicleDataWithWhatsApp.images.map((img: VehicleImage) => ({
        url: fixDoubleEncodedAmpersands(img.url),
        label: img.label
      })),
      // Fix optional fields
      ...(vehicleDataWithWhatsApp.year && { year: vehicleDataWithWhatsApp.year }),
      ...(vehicleDataWithWhatsApp.mileage && { mileage: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.mileage) }),
      ...(vehicleDataWithWhatsApp.transmission && { transmission: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.transmission) }),
      ...(vehicleDataWithWhatsApp.fuelType && { fuelType: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.fuelType) }),
      ...(vehicleDataWithWhatsApp.dailyRate && { dailyRate: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.dailyRate) }),
      ...(vehicleDataWithWhatsApp.engineSize && { engineSize: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.engineSize) }),
      ...(vehicleDataWithWhatsApp.color && { color: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.color) }),
      ...(vehicleDataWithWhatsApp.condition && { condition: vehicleDataWithWhatsApp.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor' | undefined }),
      ...(vehicleDataWithWhatsApp.serviceHistory && { serviceHistory: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.serviceHistory) }),
      ...(vehicleDataWithWhatsApp.accidentHistory && { accidentHistory: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.accidentHistory) }),
      ...(vehicleDataWithWhatsApp.warranty && { warranty: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.warranty) }),
      ...(vehicleDataWithWhatsApp.registrationStatus && { registrationStatus: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.registrationStatus) }),
      ...(vehicleDataWithWhatsApp.insuranceStatus && { insuranceStatus: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.insuranceStatus) }),
      ...(vehicleDataWithWhatsApp.whatsappContact && { whatsappContact: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.whatsappContact) })
    };
    
    // Sanitize input data
    const sanitizedData: any = {
      ...fixedData,
      name: sanitizeInput(fixedData.name),
      category: sanitizeInput(fixedData.category),
      price: sanitizeInput(fixedData.price),
      description: sanitizeInput(fixedData.description),
      features: fixedData.features.map((feature: string) => sanitizeInput(feature)),
      image: sanitizeInput(fixedData.image),
      images: fixedData.images.map((img: VehicleImage) => ({
        url: sanitizeInput(img.url),
        label: img.label
      })),
      // Sanitize optional fields
      ...(fixedData.year && { year: fixedData.year }),
      ...(fixedData.mileage && { mileage: sanitizeInput(fixedData.mileage) }),
      ...(fixedData.transmission && { transmission: sanitizeInput(fixedData.transmission) }),
      ...(fixedData.fuelType && { fuelType: sanitizeInput(fixedData.fuelType) }),
      ...(fixedData.dailyRate && { dailyRate: sanitizeInput(fixedData.dailyRate) }),
      ...(fixedData.engineSize && { engineSize: sanitizeInput(fixedData.engineSize) }),
      ...(fixedData.color && { color: sanitizeInput(fixedData.color) }),
      ...(fixedData.condition && { condition: fixedData.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor' | undefined }),
      ...(fixedData.serviceHistory && { serviceHistory: sanitizeInput(fixedData.serviceHistory) }),
      ...(fixedData.accidentHistory && { accidentHistory: sanitizeInput(fixedData.accidentHistory) }),
      ...(fixedData.warranty && { warranty: sanitizeInput(fixedData.warranty) }),
      ...(fixedData.registrationStatus && { registrationStatus: sanitizeInput(fixedData.registrationStatus) }),
      ...(fixedData.insuranceStatus && { insuranceStatus: sanitizeInput(fixedData.insuranceStatus) }),
      ...(fixedData.whatsappContact && { whatsappContact: sanitizeInput(fixedData.whatsappContact) })
    };
    
    const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
    
    if (useStaticData) {
      // For static data, we'll add to localStorage cache
      let vehicles: Vehicle[] = [];
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      
      if (cachedVehicles) {
        try {
          vehicles = JSON.parse(cachedVehicles);
        } catch (e) {
          // If parsing fails, get fresh data
          vehicles = await getVehicles();
        }
      } else {
        // If no cache exists, get fresh data
        vehicles = await getVehicles();
      }
      
      // Add the new vehicle
      const newVehicle: Vehicle = {
        ...sanitizedData as Omit<Vehicle, 'id'>,
        id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      vehicles.push(newVehicle);
      
      // Update localStorage
      localStorage.setItem('vehicles_cache', JSON.stringify(vehicles));
      
      // Update cache
      vehiclesCache = vehicles;
      lastUpdateTimestamp = Date.now();
      
      // Dispatch event to notify other parts of the app that vehicles have been updated
      window.dispatchEvent(new Event('vehiclesUpdated'));
      
      alert('Vehicle added successfully!');
      
      return newVehicle;
    } else {
      const response = await vehicleService.addVehicle(sanitizedData as Omit<Vehicle, 'id'>, token);
      if (response.success && response.vehicle) {
        // Clear cache to force refresh on next getVehicles call
        vehiclesCache = null;
        lastUpdateTimestamp = 0;
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        // Show success message
        alert('Vehicle added successfully!');
        
        return response.vehicle;
      } else {
        console.error('Failed to add vehicle:', response.message);
        
        // Check if it's a token expiration issue
        if (response.message && response.message.includes('Invalid or expired token')) {
          alert('Your session has expired. Please log in again.');
          // Clear the expired token
          localStorage.removeItem('authToken');
          // Redirect to login page
          window.location.href = '/login';
        } else {
          alert(`Failed to add vehicle: ${response.message}`);
        }
        
        return null;
      }
    }
  } catch (error: any) {
    console.error('Failed to add vehicle:', error);
    alert('An error occurred while adding the vehicle. Please try again.');
    return null;
  }
}

export async function updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('Authentication required to update vehicle');
      alert('Authentication required. Please log in again.');
      // Redirect to login page
      window.location.href = '/login';
      return null;
    }
    
    // Validate token before proceeding
    const validation = await authService.validateToken(token);
    if (!validation.valid) {
      console.error('Invalid or expired token');
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return null;
    }
    
    // Show a loading message to the user
    alert('Updating vehicle... This may take a moment as the server wakes up from sleep mode.');
    
    // Ensure WhatsApp contact is included in the data if it exists
    const vehicleDataWithWhatsApp = {
      ...vehicleData,
      ...(vehicleData.whatsappContact && { whatsappContact: vehicleData.whatsappContact })
    };
    
    // Fix any double-encoded data in the input
    const fixedData: any = {
      ...vehicleDataWithWhatsApp,
      ...(vehicleDataWithWhatsApp.name && { name: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.name) }),
      ...(vehicleDataWithWhatsApp.category && { category: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.category) }),
      ...(vehicleDataWithWhatsApp.price && { price: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.price) }),
      ...(vehicleDataWithWhatsApp.description && { description: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.description) }),
      ...(vehicleDataWithWhatsApp.features && { 
        features: vehicleDataWithWhatsApp.features.map((feature: string) => fixDoubleEncodedAmpersands(feature)) 
      }),
      ...(vehicleDataWithWhatsApp.image && { image: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.image) }),
      ...(vehicleDataWithWhatsApp.images && { 
        images: vehicleDataWithWhatsApp.images.map((img: VehicleImage) => ({
          url: fixDoubleEncodedAmpersands(img.url),
          label: img.label
        })) 
      }),
      // Fix optional fields
      ...(vehicleDataWithWhatsApp.year && { year: vehicleDataWithWhatsApp.year }),
      ...(vehicleDataWithWhatsApp.mileage && { mileage: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.mileage) }),
      ...(vehicleDataWithWhatsApp.transmission && { transmission: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.transmission) }),
      ...(vehicleDataWithWhatsApp.fuelType && { fuelType: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.fuelType) }),
      ...(vehicleDataWithWhatsApp.dailyRate && { dailyRate: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.dailyRate) }),
      ...(vehicleDataWithWhatsApp.engineSize && { engineSize: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.engineSize) }),
      ...(vehicleDataWithWhatsApp.color && { color: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.color) }),
      ...(vehicleDataWithWhatsApp.condition && { condition: vehicleDataWithWhatsApp.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor' | undefined }),
      ...(vehicleDataWithWhatsApp.serviceHistory && { serviceHistory: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.serviceHistory) }),
      ...(vehicleDataWithWhatsApp.accidentHistory && { accidentHistory: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.accidentHistory) }),
      ...(vehicleDataWithWhatsApp.warranty && { warranty: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.warranty) }),
      ...(vehicleDataWithWhatsApp.registrationStatus && { registrationStatus: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.registrationStatus) }),
      ...(vehicleDataWithWhatsApp.insuranceStatus && { insuranceStatus: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.insuranceStatus) }),
      ...(vehicleDataWithWhatsApp.whatsappContact && { whatsappContact: fixDoubleEncodedAmpersands(vehicleDataWithWhatsApp.whatsappContact) })
    };
    
    // Sanitize input data
    const sanitizedData: any = {
      ...fixedData,
      ...(fixedData.name && { name: sanitizeInput(fixedData.name) }),
      ...(fixedData.category && { category: sanitizeInput(fixedData.category) }),
      ...(fixedData.price && { price: sanitizeInput(fixedData.price) }),
      ...(fixedData.description && { description: sanitizeInput(fixedData.description) }),
      ...(fixedData.features && { 
        features: fixedData.features.map((feature: string) => sanitizeInput(feature)) 
      }),
      ...(fixedData.image && { image: sanitizeInput(fixedData.image) }),
      ...(fixedData.images && { 
        images: fixedData.images.map((img: VehicleImage) => ({
          url: sanitizeInput(img.url),
          label: img.label
        })) 
      }),
      // Sanitize optional fields
      ...(fixedData.year && { year: fixedData.year }),
      ...(fixedData.mileage && { mileage: sanitizeInput(fixedData.mileage) }),
      ...(fixedData.transmission && { transmission: sanitizeInput(fixedData.transmission) }),
      ...(fixedData.fuelType && { fuelType: sanitizeInput(fixedData.fuelType) }),
      ...(fixedData.dailyRate && { dailyRate: sanitizeInput(fixedData.dailyRate) }),
      ...(fixedData.engineSize && { engineSize: sanitizeInput(fixedData.engineSize) }),
      ...(fixedData.color && { color: sanitizeInput(fixedData.color) }),
      ...(fixedData.condition && { condition: fixedData.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor' | undefined }),
      ...(fixedData.serviceHistory && { serviceHistory: sanitizeInput(fixedData.serviceHistory) }),
      ...(fixedData.accidentHistory && { accidentHistory: sanitizeInput(fixedData.accidentHistory) }),
      ...(fixedData.warranty && { warranty: sanitizeInput(fixedData.warranty) }),
      ...(fixedData.registrationStatus && { registrationStatus: sanitizeInput(fixedData.registrationStatus) }),
      ...(fixedData.insuranceStatus && { insuranceStatus: sanitizeInput(fixedData.insuranceStatus) }),
      ...(fixedData.whatsappContact && { whatsappContact: sanitizeInput(fixedData.whatsappContact) })
    };
    
    const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
    
    if (useStaticData) {
      // For static data, we'll update in localStorage cache
      let vehicles: Vehicle[] = [];
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      
      if (cachedVehicles) {
        try {
          vehicles = JSON.parse(cachedVehicles);
        } catch (e) {
          // If parsing fails, get fresh data
          vehicles = await getVehicles();
        }
      } else {
        // If no cache exists, get fresh data
        vehicles = await getVehicles();
      }
      
      // Find the vehicle to update
      const vehicleIndex = vehicles.findIndex((v: Vehicle) => v.id === vehicleId);
      
      if (vehicleIndex !== -1) {
        // Update the vehicle
        const updatedVehicle = {
          ...vehicles[vehicleIndex],
          ...sanitizedData
        };
        
        // Update the vehicle in the array
        vehicles[vehicleIndex] = updatedVehicle;
        
        // Update localStorage
        localStorage.setItem('vehicles_cache', JSON.stringify(vehicles));
        
        // Update cache
        vehiclesCache = vehicles;
        lastUpdateTimestamp = Date.now();
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        alert('Vehicle updated successfully!');
        
        return updatedVehicle;
      } else {
        alert('Vehicle not found');
        return null;
      }
    } else {
      const response = await vehicleService.updateVehicle(vehicleId, sanitizedData as Partial<Vehicle>, token);
      if (response.success && response.vehicle) {
        // Clear cache to force refresh on next getVehicles call
        vehiclesCache = null;
        lastUpdateTimestamp = 0;
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        // Show success message
        alert('Vehicle updated successfully!');
        
        return response.vehicle;
      } else {
        console.error('Failed to update vehicle:', response.message);
        
        // Check if it's a token expiration issue
        if (response.message && response.message.includes('Invalid or expired token')) {
          alert('Your session has expired. Please log in again.');
          // Clear the expired token
          localStorage.removeItem('authToken');
          // Redirect to login page
          window.location.href = '/login';
        } else {
          alert(`Failed to update vehicle: ${response.message}`);
        }
        
        return null;
      }
    }
  } catch (error: any) {
    console.error('Failed to update vehicle:', error);
    alert('An error occurred while updating the vehicle. Please try again.');
    return null;
  }
}

export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('Authentication required to delete vehicle');
      alert('Authentication required. Please log in again.');
      return false;
    }
    
    // Validate token before proceeding
    const validation = await authService.validateToken(token);
    if (!validation.valid) {
      console.error('Invalid or expired token');
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return false;
    }
    
    // Show a loading message to the user
    alert('Deleting vehicle... This may take a moment as the server wakes up from sleep mode.');
    
    const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
    
    if (useStaticData) {
      // For static data, we'll delete from localStorage cache
      let vehicles: Vehicle[] = [];
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      
      if (cachedVehicles) {
        try {
          vehicles = JSON.parse(cachedVehicles);
        } catch (e) {
          // If parsing fails, get fresh data
          vehicles = await getVehicles();
        }
      } else {
        // If no cache exists, get fresh data
        vehicles = await getVehicles();
      }
      
      // Find the vehicle to delete
      const vehicleIndex = vehicles.findIndex((v: Vehicle) => v.id === id);
      
      if (vehicleIndex !== -1) {
        // Remove the vehicle
        vehicles.splice(vehicleIndex, 1);
        
        // Update localStorage
        localStorage.setItem('vehicles_cache', JSON.stringify(vehicles));
        
        // Update cache
        vehiclesCache = vehicles;
        lastUpdateTimestamp = Date.now();
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        alert('Vehicle deleted successfully!');
        
        return true;
      } else {
        alert('Vehicle not found');
        return false;
      }
    } else {
      const response = await vehicleService.deleteVehicle(id, token);
      if (response.success) {
        // Clear cache to force refresh on next getVehicles call
        vehiclesCache = null;
        lastUpdateTimestamp = 0;
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        // Show success message
        alert('Vehicle deleted successfully!');
        
        return true;
      }
      
      // Check if it's a token expiration issue
      if (response.message && response.message.includes('Invalid or expired token')) {
        alert('Your session has expired. Please log in again.');
        // Clear the expired token
        localStorage.removeItem('authToken');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        alert(`Failed to delete vehicle: ${response.message}`);
      }
      
      return false;
    }
  } catch (error) {
    console.error('Failed to delete vehicle:', error);
    alert('An error occurred while deleting the vehicle. Please try again.');
    return false;
  }
}

export async function updateVehicleStatus(vehicleId: string, status: 'available' | 'sold'): Promise<Vehicle | null> {
  try {
    // Check if we're using static data
    const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
    
    if (useStaticData) {
      // For static data, we'll update the status in localStorage
      // This is a simplified approach for static sites
      
      // Get vehicles from localStorage cache or initialize from static data
      let vehicles: Vehicle[] = [];
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      
      if (cachedVehicles) {
        try {
          vehicles = JSON.parse(cachedVehicles);
        } catch (e) {
          // If parsing fails, initialize from static data
          vehicles = await getVehicles();
        }
      } else {
        // If no cache exists, initialize from static data
        vehicles = await getVehicles();
      }
      
      // Find the vehicle to update
      const vehicleIndex = vehicles.findIndex((v: Vehicle) => v.id === vehicleId);
      
      if (vehicleIndex !== -1) {
        // Update the vehicle status
        const updatedVehicle = {
          ...vehicles[vehicleIndex],
          status
        };
        
        // Update the vehicle in the array
        vehicles[vehicleIndex] = updatedVehicle;
        
        // Save back to localStorage
        localStorage.setItem('vehicles_cache', JSON.stringify(vehicles));
        
        // Update cache
        vehiclesCache = vehicles;
        lastUpdateTimestamp = Date.now();
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        // Show success message
        alert(`Vehicle marked as ${status} successfully!`);
        
        return updatedVehicle;
      } else {
        alert('Vehicle not found');
        return null;
      }
    } else {
      const token = getAuthToken();
      if (!token) {
        console.error('Authentication required to update vehicle status');
        alert('Authentication required. Please log in again.');
        // Redirect to login page
        window.location.href = '/login';
        return null;
      }
      
      // Validate token before proceeding
      const validation = await authService.validateToken(token);
      if (!validation.valid) {
        console.error('Invalid or expired token');
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return null;
      }
      
      // Show a loading message to the user
      alert('Updating vehicle status... This may take a moment as the server wakes up from sleep mode.');
      
      const response = await vehicleService.updateVehicle(vehicleId, { status }, token);
      if (response.success && response.vehicle) {
        // Clear cache to force refresh on next getVehicles call
        vehiclesCache = null;
        lastUpdateTimestamp = 0;
        
        // Dispatch event to notify other parts of the app that vehicles have been updated
        window.dispatchEvent(new Event('vehiclesUpdated'));
        
        // Show success message
        alert(`Vehicle marked as ${status} successfully!`);
        
        return response.vehicle;
      } else {
        console.error('Failed to update vehicle status:', response.message);
        
        // Check if it's a token expiration issue
        if (response.message && response.message.includes('Invalid or expired token')) {
          alert('Your session has expired. Please log in again.');
          // Clear the expired token
          localStorage.removeItem('authToken');
          // Redirect to login page
          window.location.href = '/login';
        } else {
          alert(`Failed to update vehicle status: ${response.message}`);
        }
        
        return null;
      }
    }
  } catch (error: any) {
    console.error('Failed to update vehicle status:', error);
    alert('An error occurred while updating the vehicle status. Please try again.');
    return null;
  }
}