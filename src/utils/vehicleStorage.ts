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
}

export interface VehicleImage {
  url: string;
  label: 'exterior' | 'interior' | 'front' | 'back' | 'additional';
}

// Cache for vehicles to avoid repeated API calls
let vehiclesCache: Vehicle[] | null = null;
// Cache for the last time API was called
let lastUpdateTimestamp: number = 0;
const CACHE_DURATION = 2000; // 2 second cache duration for better performance

// Get auth token from localStorage (for admin operations)
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Fetch vehicles from API
async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const response = await vehicleService.getVehicles();
    if (response.success && response.vehicles) {
      // Ensure all vehicles have proper IDs
      return response.vehicles.map(vehicle => {
        // Handle case where vehicle might come from MongoDB with _id instead of id
        const vehicleWithId = vehicle as Vehicle & { _id?: string };
        return {
          ...vehicle,
          id: vehicle.id || vehicleWithId._id || Math.random().toString(36).substr(2, 9)
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch vehicles from API:', error);
    return [];
  }
}

// Save vehicles to API (admin only)
async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  // For API-based storage, we don't need to save the entire list
  // Individual add/update/delete operations are handled separately
  // This function is kept for compatibility with existing code
  vehiclesCache = null;
  lastUpdateTimestamp = 0;
}

// Function to get vehicles with caching
export async function getVehicles(): Promise<Vehicle[]> {
  const now = Date.now();
  
  // Check if cache is valid
  if (vehiclesCache && (now - lastUpdateTimestamp) < CACHE_DURATION) {
    return vehiclesCache;
  }
  
  // Fetch from API
  const vehicles = await fetchVehicles();
  
  // Update cache
  vehiclesCache = vehicles;
  lastUpdateTimestamp = now;
  
  return vehicles;
}

// Synchronous version for backward compatibility (uses cache or fetches if needed)
export function getVehiclesSync(): Vehicle[] {
  if (vehiclesCache) {
    return vehiclesCache;
  }
  
  // This is not ideal, but maintains backward compatibility
  // In a real app, you'd want to use the async version
  getVehicles(); // Trigger fetch
  return []; // Return empty array for now
}

// Function to force refresh vehicles (bypass cache)
export async function refreshVehicles(): Promise<Vehicle[]> {
  // Clear cache
  vehiclesCache = null;
  lastUpdateTimestamp = 0;
  
  // Get fresh data
  return await getVehicles();
}

export async function addVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('Authentication required to add vehicle');
      alert('Authentication required. Please log in again.');
      return null;
    }
    
    // Fix any double-encoded data in the input
    const fixedData: any = {
      ...vehicleData,
      name: fixDoubleEncodedAmpersands(vehicleData.name),
      category: fixDoubleEncodedAmpersands(vehicleData.category),
      price: fixDoubleEncodedAmpersands(vehicleData.price),
      description: fixDoubleEncodedAmpersands(vehicleData.description),
      features: vehicleData.features.map((feature: string) => fixDoubleEncodedAmpersands(feature)),
      image: fixDoubleEncodedAmpersands(vehicleData.image),
      images: vehicleData.images.map((img: VehicleImage) => ({
        url: fixDoubleEncodedAmpersands(img.url),
        label: img.label
      })),
      // Fix optional fields
      ...(vehicleData.year && { year: vehicleData.year }),
      ...(vehicleData.mileage && { mileage: fixDoubleEncodedAmpersands(vehicleData.mileage) }),
      ...(vehicleData.transmission && { transmission: fixDoubleEncodedAmpersands(vehicleData.transmission) }),
      ...(vehicleData.fuelType && { fuelType: fixDoubleEncodedAmpersands(vehicleData.fuelType) }),
      ...(vehicleData.dailyRate && { dailyRate: fixDoubleEncodedAmpersands(vehicleData.dailyRate) }),
      ...(vehicleData.engineSize && { engineSize: fixDoubleEncodedAmpersands(vehicleData.engineSize) }),
      ...(vehicleData.color && { color: fixDoubleEncodedAmpersands(vehicleData.color) }),
      ...(vehicleData.condition && { condition: vehicleData.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor' | undefined }),
      ...(vehicleData.serviceHistory && { serviceHistory: fixDoubleEncodedAmpersands(vehicleData.serviceHistory) }),
      ...(vehicleData.accidentHistory && { accidentHistory: fixDoubleEncodedAmpersands(vehicleData.accidentHistory) }),
      ...(vehicleData.warranty && { warranty: fixDoubleEncodedAmpersands(vehicleData.warranty) }),
      ...(vehicleData.registrationStatus && { registrationStatus: fixDoubleEncodedAmpersands(vehicleData.registrationStatus) }),
      ...(vehicleData.insuranceStatus && { insuranceStatus: fixDoubleEncodedAmpersands(vehicleData.insuranceStatus) })
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
      ...(fixedData.insuranceStatus && { insuranceStatus: sanitizeInput(fixedData.insuranceStatus) })
    };
    
    const response = await vehicleService.addVehicle(sanitizedData as Omit<Vehicle, 'id'>, token);
    if (response.success && response.vehicle) {
      // Clear cache to force refresh on next getVehicles call
      vehiclesCache = null;
      lastUpdateTimestamp = 0;
      
      // Dispatch event to notify other parts of the app that vehicles have been updated
      window.dispatchEvent(new Event('vehiclesUpdated'));
      
      return response.vehicle;
    } else {
      console.error('Failed to add vehicle:', response.message);
      alert(`Failed to add vehicle: ${response.message}`);
      return null;
    }
  } catch (error) {
    console.error('Failed to add vehicle:', error);
    alert('An error occurred while adding the vehicle. Please try again.');
    return null;
  }
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('Authentication required to update vehicle');
      alert('Authentication required. Please log in again.');
      return false;
    }
    
    // Fix any double-encoded data in updates
    const fixedUpdates: Partial<Vehicle> = {};
    Object.keys(updates).forEach(key => {
      const value = updates[key as keyof Vehicle];
      if (typeof value === 'string') {
        fixedUpdates[key as keyof Vehicle] = fixDoubleEncodedAmpersands(value) as any;
      } else if (Array.isArray(value)) {
        // Handle arrays (features, images)
        if (key === 'features') {
          fixedUpdates[key as keyof Vehicle] = value.map((item: any) => 
            typeof item === 'string' ? fixDoubleEncodedAmpersands(item) : item
          ) as any;
        } else if (key === 'images') {
          fixedUpdates[key as keyof Vehicle] = value.map((img: any) => ({
            url: fixDoubleEncodedAmpersands(img.url),
            label: img.label
          })) as any;
        } else {
          fixedUpdates[key as keyof Vehicle] = value as any;
        }
      } else {
        fixedUpdates[key as keyof Vehicle] = value as any;
      }
    });
    
    // Sanitize updates
    const sanitizedUpdates: Partial<Vehicle> = {};
    Object.keys(fixedUpdates).forEach(key => {
      const value = fixedUpdates[key as keyof Vehicle];
      if (typeof value === 'string') {
        sanitizedUpdates[key as keyof Vehicle] = sanitizeInput(value) as any;
      } else if (Array.isArray(value)) {
        // Handle arrays (features, images)
        if (key === 'features') {
          sanitizedUpdates[key as keyof Vehicle] = value.map((item: any) => 
            typeof item === 'string' ? sanitizeInput(item) : item
          ) as any;
        } else if (key === 'images') {
          sanitizedUpdates[key as keyof Vehicle] = value.map((img: any) => ({
            url: sanitizeInput(img.url),
            label: img.label
          })) as any;
        } else {
          sanitizedUpdates[key as keyof Vehicle] = value as any;
        }
      } else {
        sanitizedUpdates[key as keyof Vehicle] = value as any;
      }
    });
    
    const response = await vehicleService.updateVehicle(id, sanitizedUpdates, token);
    if (response.success) {
      // Clear cache to force refresh on next getVehicles call
      vehiclesCache = null;
      lastUpdateTimestamp = 0;
      
      // Dispatch event to notify other parts of the app that vehicles have been updated
      window.dispatchEvent(new Event('vehiclesUpdated'));
      
      return true;
    } else {
      console.error('Failed to update vehicle:', response.message);
      alert(`Failed to update vehicle: ${response.message}`);
      return false;
    }
  } catch (error) {
    console.error('Failed to update vehicle:', error);
    alert('An error occurred while updating the vehicle. Please try again.');
    return false;
  }
}

export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error('Authentication required to delete vehicle');
      return false;
    }
    
    const response = await vehicleService.deleteVehicle(id, token);
    if (response.success) {
      // Clear cache to force refresh on next getVehicles call
      vehiclesCache = null;
      lastUpdateTimestamp = 0;
      
      // Dispatch event to notify other parts of the app that vehicles have been updated
      window.dispatchEvent(new Event('vehiclesUpdated'));
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to delete vehicle:', error);
    return false;
  }
}

export function clearVehicleCache(): void {
  vehiclesCache = null;
  lastUpdateTimestamp = 0;
  console.log('Vehicle cache cleared');
}

export function getVehicleCacheInfo(): { 
  isCached: boolean; 
  cacheAge: number; 
  cacheSize: number;
  cacheDuration: number;
} {
  const now = Date.now();
  const cacheAge = vehiclesCache ? now - lastUpdateTimestamp : 0;
  return {
    isCached: vehiclesCache !== null,
    cacheAge,
    cacheSize: vehiclesCache ? vehiclesCache.length : 0,
    cacheDuration: CACHE_DURATION
  };
}