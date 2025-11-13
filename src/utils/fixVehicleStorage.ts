/**
 * Fix vehicle storage issues in localStorage
 */
export function fixVehicleStorage(): { success: boolean; message: string } {
  try {
    const STORAGE_KEY = 'zamto_vehicles';
    
    // Get current data
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return { success: true, message: 'No vehicle data found - nothing to fix' };
    }
    
    // Try to parse the data
    let vehicles: any[];
    try {
      vehicles = JSON.parse(stored);
    } catch (parseError) {
      console.error('Error parsing vehicle data:', parseError);
      // If we can't parse it, remove the corrupted data
      localStorage.removeItem(STORAGE_KEY);
      return { success: true, message: 'Removed corrupted vehicle data' };
    }
    
    // Validate that it's an array
    if (!Array.isArray(vehicles)) {
      console.error('Vehicle data is not an array:', typeof vehicles);
      localStorage.removeItem(STORAGE_KEY);
      return { success: true, message: 'Removed invalid vehicle data structure' };
    }
    
    // Fix any vehicles that might have issues
    const fixedVehicles = vehicles.map(vehicle => {
      // Ensure all required fields are present
      return {
        id: vehicle.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: vehicle.name || 'Unknown Vehicle',
        category: vehicle.category || 'SUV',
        price: vehicle.price || 'Price not set',
        image: vehicle.image || '',
        images: Array.isArray(vehicle.images) ? vehicle.images : 
                vehicle.image ? [{ url: vehicle.image, label: 'exterior' }] : [],
        description: vehicle.description || '',
        features: Array.isArray(vehicle.features) ? vehicle.features : [],
        popular: Boolean(vehicle.popular),
        type: vehicle.type === 'hire' ? 'hire' : 'sale',
        ...vehicle // Keep all other properties
      };
    });
    
    // Save the fixed data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedVehicles));
    
    return { 
      success: true, 
      message: `Fixed ${vehicles.length} vehicles in storage` 
    };
  } catch (error) {
    console.error('Error fixing vehicle storage:', error);
    return { 
      success: false, 
      message: `Failed to fix vehicle storage: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Clear vehicle storage cache to force a refresh
 */
export function clearVehicleStorageCache(): void {
  // Dispatch event to notify other parts of the app
  window.dispatchEvent(new Event('vehiclesUpdated'));
  console.log('Vehicle storage cache cleared');
}