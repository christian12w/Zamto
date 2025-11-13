import { Vehicle } from './vehicleStorage';

const STORAGE_KEY = 'zamto_vehicles';

/**
 * Reset vehicle data in localStorage to default values
 * This function clears all existing vehicle data and restores the default vehicles
 */
export function resetVehicles(): void {
  // Clear the cache
  localStorage.removeItem(STORAGE_KEY);
  
  // Dispatch event to notify other parts of the app
  window.dispatchEvent(new Event('vehiclesUpdated'));
  
  console.log('Vehicle data has been reset to defaults');
}

/**
 * Clear all vehicle data from localStorage
 * This function removes all vehicle data completely
 */
export function clearAllVehicles(): void {
  // Clear the cache
  localStorage.removeItem(STORAGE_KEY);
  
  // Dispatch event to notify other parts of the app
  window.dispatchEvent(new Event('vehiclesUpdated'));
  
  console.log('All vehicle data has been cleared');
}

/**
 * Get the current number of vehicles in localStorage
 */
export function getVehicleCount(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return 0;
  }
  
  try {
    const vehicles: Vehicle[] = JSON.parse(stored);
    return vehicles.length;
  } catch (error) {
    console.error('Error parsing vehicle data:', error);
    return 0;
  }
}