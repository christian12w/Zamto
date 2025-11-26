import vehiclesData from '../data/vehicles.json';
import { Vehicle } from './vehicleStorage';

/**
 * Reset vehicles data to original 17 vehicles
 * This function will reset the localStorage cache to the original vehicle data
 */
export async function resetVehiclesToOriginal(): Promise<boolean> {
  try {
    // Update localStorage cache with original vehicle data
    localStorage.setItem('vehicles_cache', JSON.stringify(vehiclesData));
    localStorage.setItem('vehicles_cache_timestamp', Date.now().toString());
    
    // Also update the old storage key if it exists
    localStorage.setItem('zamto_vehicles', JSON.stringify(vehiclesData));
    
    console.log(`Successfully reset vehicles cache with ${vehiclesData.length} original vehicles`);
    
    // Dispatch event to notify other parts of the app that vehicles have been updated
    window.dispatchEvent(new Event('vehiclesUpdated'));
    
    return true;
  } catch (error) {
    console.error('Failed to reset vehicles cache:', error);
    return false;
  }
}

/**
 * Get current vehicles from cache
 */
export function getCurrentVehicles(): Vehicle[] {
  try {
    const cachedVehicles = localStorage.getItem('vehicles_cache');
    if (cachedVehicles) {
      return JSON.parse(cachedVehicles);
    }
    return [];
  } catch (error) {
    console.error('Failed to get current vehicles:', error);
    return [];
  }
}

/**
 * Get vehicle count in cache
 */
export function getVehicleCount(): number {
  try {
    const cachedVehicles = localStorage.getItem('vehicles_cache');
    if (cachedVehicles) {
      const vehicles = JSON.parse(cachedVehicles);
      return vehicles.length;
    }
    return 0;
  } catch (error) {
    console.error('Failed to get vehicle count:', error);
    return 0;
  }
}