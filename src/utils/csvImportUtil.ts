// CSV to Vehicle converter utility
const csv = require('csv-parser');
const fs = require('fs');

interface VehicleImage {
  url: string;
  label: 'exterior' | 'interior' | 'front' | 'back' | 'additional';
}

interface CSVRow {
  [key: string]: string;
}

interface VehicleData {
  name: string;
  category: string;
  price: string;
  dailyRate?: string;
  image: string;
  images: VehicleImage[];
  description: string;
  features: string[];
  popular: boolean;
  year?: number;
  mileage: string;
  transmission: string;
  fuelType: string;
  type: string;
  engineSize: string;
  doors?: number;
  seats?: number;
  color: string;
  condition: string;
  serviceHistory: string;
  accidentHistory: string;
  warranty: string;
  registrationStatus: string;
  insuranceStatus: string;
}

class CSVImportUtil {
  /**
   * Convert CSV file to vehicle objects
   * @param {string} filePath - Path to the CSV file
   * @returns {Promise<VehicleData[]>} - Array of vehicle objects
   */
  static async csvToVehicles(filePath: string): Promise<VehicleData[]> {
    return new Promise((resolve, reject) => {
      const vehicles: VehicleData[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: CSVRow) => {
          // Convert CSV row to vehicle object
          const vehicle: VehicleData = {
            name: row.name || '',
            category: row.category || 'SUV',
            price: row.price || '',
            dailyRate: row.dailyRate || '',
            image: row.image || '',
            images: this.parseImages(row.images),
            description: row.description || '',
            features: this.parseFeatures(row.features),
            popular: this.parseBoolean(row.popular),
            year: row.year ? parseInt(row.year) : undefined,
            mileage: row.mileage || '',
            transmission: row.transmission || 'Automatic',
            fuelType: row.fuelType || 'Petrol',
            type: row.type || 'sale',
            engineSize: row.engineSize || '',
            doors: row.doors ? parseInt(row.doors) : undefined,
            seats: row.seats ? parseInt(row.seats) : undefined,
            color: row.color || '',
            condition: row.condition || 'Good',
            serviceHistory: row.serviceHistory || '',
            accidentHistory: row.accidentHistory || '',
            warranty: row.warranty || '',
            registrationStatus: row.registrationStatus || '',
            insuranceStatus: row.insuranceStatus || ''
          };
          
          vehicles.push(vehicle);
        })
        .on('end', () => {
          resolve(vehicles);
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });
  }
  
  /**
   * Parse images from CSV string
   * @param {string} imagesStr - Comma-separated images string
   * @returns {VehicleImage[]} - Array of image objects
   */
  static parseImages(imagesStr: string): VehicleImage[] {
    if (!imagesStr) return [];
    
    try {
      // If it's already a JSON array
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // If it's a comma-separated string
      return imagesStr.split(',').map((url: string) => ({
        url: url.trim(),
        label: 'exterior' // Default label
      }));
    }
    
    return [];
  }
  
  /**
   * Parse features from CSV string
   * @param {string} featuresStr - Comma-separated features string
   * @returns {string[]} - Array of features
   */
  static parseFeatures(featuresStr: string): string[] {
    if (!featuresStr) return [];
    return featuresStr.split(',').map((feature: string) => feature.trim());
  }
  
  /**
   * Parse boolean value from CSV string
   * @param {string} boolStr - Boolean string
   * @returns {boolean} - Parsed boolean value
   */
  static parseBoolean(boolStr: string): boolean {
    if (!boolStr) return false;
    return boolStr.toLowerCase() === 'true' || boolStr === '1';
  }
}

export default CSVImportUtil;