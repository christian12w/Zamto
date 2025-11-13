/**
 * Diagnose vehicle storage issues
 */
export function diagnoseVehicles(): any {
  const STORAGE_KEY = 'zamto_vehicles';
  
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      return {
        error: 'localStorage is not available',
        canSave: false,
        canLoad: false
      };
    }
    
    // Get raw data
    const rawData = localStorage.getItem(STORAGE_KEY);
    
    if (!rawData) {
      return {
        status: 'No data found',
        vehicleCount: 0,
        rawData: null,
        canSave: true,
        canLoad: true
      };
    }
    
    // Try to parse
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawData);
    } catch (parseError) {
      return {
        error: 'Failed to parse vehicle data',
        parseError: parseError instanceof Error ? parseError.message : String(parseError),
        rawData: rawData,
        canSave: true,
        canLoad: false
      };
    }
    
    // Check if it's an array
    if (!Array.isArray(parsedData)) {
      return {
        error: 'Vehicle data is not an array',
        dataType: typeof parsedData,
        rawData: parsedData,
        canSave: true,
        canLoad: false
      };
    }
    
    // Analyze vehicles
    const vehicles = parsedData;
    const issues: string[] = [];
    
    // Check for duplicate IDs
    const ids = vehicles.map((v: any) => v.id);
    const duplicateIds = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      issues.push(`Found ${duplicateIds.length} duplicate IDs`);
    }
    
    // Check for vehicles without required fields
    const vehiclesWithoutIds = vehicles.filter((v: any) => !v.id);
    if (vehiclesWithoutIds.length > 0) {
      issues.push(`Found ${vehiclesWithoutIds.length} vehicles without IDs`);
    }
    
    const vehiclesWithoutNames = vehicles.filter((v: any) => !v.name);
    if (vehiclesWithoutNames.length > 0) {
      issues.push(`Found ${vehiclesWithoutNames.length} vehicles without names`);
    }
    
    // Check for vehicles with invalid types
    const vehiclesWithInvalidTypes = vehicles.filter((v: any) => v.type !== 'sale' && v.type !== 'hire');
    if (vehiclesWithInvalidTypes.length > 0) {
      issues.push(`Found ${vehiclesWithInvalidTypes.length} vehicles with invalid types`);
    }
    
    return {
      status: 'Success',
      vehicleCount: vehicles.length,
      issues: issues.length > 0 ? issues : ['No issues found'],
      rawDataLength: rawData.length,
      canSave: true,
      canLoad: true,
      sampleVehicles: vehicles.slice(0, 3) // Show first 3 vehicles as samples
    };
  } catch (error) {
    return {
      error: 'Unexpected error during diagnosis',
      errorMessage: error instanceof Error ? error.message : String(error),
      canSave: false,
      canLoad: false
    };
  }
}

/**
 * Attempt to repair vehicle storage
 */
export function repairVehicles(): any {
  const STORAGE_KEY = 'zamto_vehicles';
  
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    
    if (!rawData) {
      return {
        status: 'No data to repair',
        action: 'None required'
      };
    }
    
    let vehicles: any[];
    try {
      vehicles = JSON.parse(rawData);
    } catch (parseError) {
      // If we can't parse it, remove the corrupted data
      localStorage.removeItem(STORAGE_KEY);
      return {
        status: 'Removed corrupted data',
        action: 'Data cleared'
      };
    }
    
    if (!Array.isArray(vehicles)) {
      localStorage.removeItem(STORAGE_KEY);
      return {
        status: 'Removed invalid data structure',
        action: 'Data cleared'
      };
    }
    
    // Fix any issues with vehicles
    const fixedVehicles = vehicles.map((vehicle, index) => {
      // Ensure all required fields are present
      return {
        id: vehicle.id || `auto-${Date.now()}-${index}`,
        name: vehicle.name || `Unnamed Vehicle ${index + 1}`,
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
      status: 'Repaired vehicle data',
      action: `Fixed ${vehicles.length} vehicles`,
      vehicleCount: fixedVehicles.length
    };
  } catch (error) {
    return {
      error: 'Failed to repair vehicles',
      errorMessage: error instanceof Error ? error.message : String(error)
    };
  }
}