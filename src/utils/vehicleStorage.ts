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

// Fetch vehicles from API with better error handling and offline fallback
async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    console.log('Fetching vehicles from API...');
    const startTime = Date.now();
    
    const response = await vehicleService.getVehicles();
    const endTime = Date.now();
    console.log(`API call completed in ${endTime - startTime}ms`);
    
    if (response.success && response.vehicles) {
      console.log(`Received ${response.vehicles.length} vehicles from API`);
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
  } catch (error: any) {
    console.error('Failed to fetch vehicles from API:', error);
    
    // If we have cached vehicles, return them as fallback for offline use
    if (vehiclesCache && vehiclesCache.length > 0) {
      console.log('Returning cached vehicles due to network error');
      return vehiclesCache;
    }
    
    // If it's a timeout or network error, try one more time
    if (error.message && (error.message.includes('timeout') || error.message.includes('network'))) {
      console.log('Retrying vehicle fetch due to network issue...');
      try {
        // Wait 2 seconds and try again
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryResponse = await vehicleService.getVehicles();
        if (retryResponse.success && retryResponse.vehicles) {
          return retryResponse.vehicles.map(vehicle => {
            const vehicleWithId = vehicle as Vehicle & { _id?: string };
            return {
              ...vehicle,
              id: vehicle.id || vehicleWithId._id || Math.random().toString(36).substr(2, 9)
            };
          });
        }
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        // Still return cached vehicles if available
        if (vehiclesCache && vehiclesCache.length > 0) {
          console.log('Returning cached vehicles after retry failure');
          return vehiclesCache;
        }
      }
    }
    
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

// Function to get vehicles with caching and offline support
export async function getVehicles(): Promise<Vehicle[]> {
  const now = Date.now();
  
  // Check if cache is valid (less than 30 minutes old)
  if (vehiclesCache && (now - lastUpdateTimestamp) < CACHE_DURATION) {
    return vehiclesCache;
  }
  
  // Fetch from API
  const vehicles = await fetchVehicles();
  
  // Update cache
  vehiclesCache = vehicles;
  lastUpdateTimestamp = now;
  
  // Save to persistent storage
  saveCacheToStorage(vehicles);
  
  // Send to service worker for offline caching
  try {
    // Dynamically import to avoid circular dependency
    const indexModule = await import('../index');
    if (indexModule && typeof indexModule.cacheVehiclesInServiceWorker === 'function') {
      indexModule.cacheVehiclesInServiceWorker(vehicles);
    }
  } catch (error) {
    console.log('Service worker caching not available');
  }
  
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

// Function to get vehicles with offline fallback
export async function getVehiclesWithOfflineSupport(): Promise<Vehicle[]> {
  try {
    const vehicles = await getVehicles();
    return vehicles;
  } catch (error) {
    console.error('Error getting vehicles:', error);
    
    // Try to get from localStorage cache as fallback
    if (vehiclesCache && vehiclesCache.length > 0) {
      console.log('Returning vehicles from memory cache');
      return vehiclesCache;
    }
    
    try {
      const cachedVehicles = localStorage.getItem(VEHICLE_CACHE_KEY);
      if (cachedVehicles) {
        const vehicles = JSON.parse(cachedVehicles);
        console.log('Returning vehicles from localStorage cache');
        return vehicles;
      }
    } catch (storageError) {
      console.error('Error reading from localStorage:', storageError);
    }
    
    // Return empty array if all else fails
    return [];
  }
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
  } catch (error: any) {
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
    
    // Log the update attempt
    console.log('Attempting to update vehicle:', id, updates);
    
    // Show a temporary loading state to the user
    const startTime = Date.now();
    
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
    
    console.log('Sending sanitized updates:', sanitizedUpdates);
    
    const response = await vehicleService.updateVehicle(id, sanitizedUpdates, token);
    const endTime = Date.now();
    console.log(`Vehicle update took ${endTime - startTime}ms`);
    
    if (response.success) {
      // Clear cache to force refresh on next getVehicles call
      vehiclesCache = null;
      lastUpdateTimestamp = 0;
      
      // Dispatch event to notify other parts of the app that vehicles have been updated
      window.dispatchEvent(new Event('vehiclesUpdated'));
      
      console.log('Vehicle updated successfully:', response.vehicle);
      return true;
    } else {
      console.error('Failed to update vehicle:', response.message);
      alert(`Failed to update vehicle: ${response.message}`);
      return false;
    }
  } catch (error: any) {
    console.error('Failed to update vehicle:', error);
    if (error.message && error.message.includes('timeout')) {
      alert('Request timeout - the server took too long to respond. Please try again or check your network connection.');
    } else {
      alert('An error occurred while updating the vehicle. Please try again.');
    }
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

// Export function to get current cache
export function getCurrentVehicleCache(): Vehicle[] | null {
  return vehiclesCache;
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

// Background refresh function to update cache without blocking UI
let backgroundRefreshTimeout: NodeJS.Timeout | null = null;
let keepAliveInterval: NodeJS.Timeout | null = null;

// Function to send keep-alive ping to server
async function sendKeepAlivePing() {
  try {
    // Only ping if we have vehicles in cache (meaning user has visited the site)
    if (vehiclesCache && vehiclesCache.length > 0) {
      const response = await fetch(`${(import.meta as any).env.VITE_API_BASE_URL}/keep-alive`);
      if (response.ok) {
        console.log('Keep-alive ping sent successfully');
      }
    }
  } catch (error) {
    console.log('Keep-alive ping failed (server might be sleeping):', error);
    // This is expected when server is asleep, we'll wake it up with the next real request
  }
}

function scheduleBackgroundRefresh() {
  // Clear any existing scheduled refresh
  if (backgroundRefreshTimeout) {
    clearTimeout(backgroundRefreshTimeout);
  }
  
  // Schedule refresh for 5 minutes from now
  backgroundRefreshTimeout = setTimeout(async () => {
    try {
      console.log('Performing background vehicle cache refresh');
      const freshVehicles = await fetchVehicles();
      
      // Update cache
      vehiclesCache = freshVehicles;
      lastUpdateTimestamp = Date.now();
      
      // Save to persistent storage
      saveCacheToStorage(freshVehicles);
      
      // Dispatch event to notify UI of updated data
      window.dispatchEvent(new Event('vehiclesCacheUpdated'));
      
      // Schedule next refresh
      scheduleBackgroundRefresh();
    } catch (error) {
      console.error('Background refresh failed:', error);
      // Try again in 1 minute if failed
      backgroundRefreshTimeout = setTimeout(scheduleBackgroundRefresh, 60 * 1000);
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// Start keep-alive pings every 10 minutes
function startKeepAlivePings() {
  // Clear any existing keep-alive interval
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  
  // Send a ping every 10 minutes to keep server awake
  keepAliveInterval = setInterval(sendKeepAlivePing, 10 * 60 * 1000); // 10 minutes
}

// Start background refresh and keep-alive when module loads
scheduleBackgroundRefresh();
startKeepAlivePings();

// Clear intervals on module unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (backgroundRefreshTimeout) {
      clearTimeout(backgroundRefreshTimeout);
    }
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
    }
  });
}
