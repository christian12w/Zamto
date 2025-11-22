import { Vehicle } from './vehicleStorage';

/**
 * Search vehicles by query string
 * @param vehicles Array of vehicles to search through
 * @param query Search query string
 * @returns Filtered array of vehicles matching the query
 */
export function searchVehicles(vehicles: Vehicle[], query: string): Vehicle[] {
  if (!query) return vehicles;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return vehicles.filter(vehicle => {
    // Search in vehicle name
    if (vehicle.name.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in vehicle description
    if (vehicle.description.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in vehicle category
    if (vehicle.category.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in vehicle features
    if (vehicle.features.some(feature => feature.toLowerCase().includes(normalizedQuery))) return true;
    
    // Search in vehicle color
    if (vehicle.color && vehicle.color.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in vehicle engine size
    if (vehicle.engineSize && vehicle.engineSize.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in vehicle transmission
    if (vehicle.transmission && vehicle.transmission.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in vehicle fuel type
    if (vehicle.fuelType && vehicle.fuelType.toLowerCase().includes(normalizedQuery)) return true;
    
    return false;
  });
}