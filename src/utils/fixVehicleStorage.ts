// Utility to fix double-encoded data in vehicle storage
const STORAGE_KEY = 'zamto_vehicles';

export function fixDoubleEncodedAmpersands(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  // Fix the repeated ampersand encoding issue
  let fixed = text;
  // Replace multiple &amp; sequences iteratively until no more changes
  let previousLength;
  do {
    previousLength = fixed.length;
    fixed = fixed
      .replace(/&amp;amp;/g, '&amp;')
      .replace(/&amp;quot;/g, '&quot;')
      .replace(/&amp;lt;/g, '&lt;')
      .replace(/&amp;gt;/g, '&gt;')
      .replace(/&amp;#x27;/g, '&#x27;');
  } while (fixed.length < previousLength);
  
  return fixed;
}

export function fixVehicleStorage(): void {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    // Parse the stored data
    const vehicles = JSON.parse(stored);
    
    // Check if this is an array of vehicles
    if (!Array.isArray(vehicles)) return;
    
    // Check if any vehicles have double-encoded data
    let needsFixing = false;
    for (const vehicle of vehicles) {
      // Check common fields for double-encoded ampersands
      if (typeof vehicle.name === 'string' && vehicle.name.includes('&amp;amp;')) {
        needsFixing = true;
        break;
      }
      if (typeof vehicle.category === 'string' && vehicle.category.includes('&amp;amp;')) {
        needsFixing = true;
        break;
      }
      if (typeof vehicle.description === 'string' && vehicle.description.includes('&amp;amp;')) {
        needsFixing = true;
        break;
      }
    }
    
    // If no fixing needed, return early
    if (!needsFixing) return;
    
    console.log('Fixing double-encoded data in vehicle storage...');
    
    // Fix all vehicles
    const fixedVehicles = vehicles.map((vehicle: any) => {
      return {
        ...vehicle,
        name: fixDoubleEncodedAmpersands(vehicle.name),
        category: fixDoubleEncodedAmpersands(vehicle.category),
        price: fixDoubleEncodedAmpersands(vehicle.price),
        description: fixDoubleEncodedAmpersands(vehicle.description),
        features: Array.isArray(vehicle.features) 
          ? vehicle.features.map((feature: string) => fixDoubleEncodedAmpersands(feature))
          : vehicle.features,
        image: fixDoubleEncodedAmpersands(vehicle.image),
        images: Array.isArray(vehicle.images)
          ? vehicle.images.map((img: any) => ({
              ...img,
              url: fixDoubleEncodedAmpersands(img.url)
            }))
          : vehicle.images,
        mileage: fixDoubleEncodedAmpersands(vehicle.mileage),
        transmission: fixDoubleEncodedAmpersands(vehicle.transmission),
        fuelType: fixDoubleEncodedAmpersands(vehicle.fuelType),
        dailyRate: fixDoubleEncodedAmpersands(vehicle.dailyRate),
        engineSize: fixDoubleEncodedAmpersands(vehicle.engineSize),
        color: fixDoubleEncodedAmpersands(vehicle.color),
        serviceHistory: fixDoubleEncodedAmpersands(vehicle.serviceHistory),
        accidentHistory: fixDoubleEncodedAmpersands(vehicle.accidentHistory),
        warranty: fixDoubleEncodedAmpersands(vehicle.warranty),
        registrationStatus: fixDoubleEncodedAmpersands(vehicle.registrationStatus),
        insuranceStatus: fixDoubleEncodedAmpersands(vehicle.insuranceStatus)
      };
    });
    
    // Save the fixed data back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedVehicles));
    console.log('Successfully fixed double-encoded data in vehicle storage');
  } catch (error) {
    console.error('Error fixing vehicle storage data:', error);
  }
}