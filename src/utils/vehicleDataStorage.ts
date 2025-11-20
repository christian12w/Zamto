// Vehicle data storage utility for GitHub storage simulation
// This simulates storing vehicle data in a JSON file that could be committed to GitHub

interface VehicleData {
  id: string;
  name: string;
  category: string;
  price?: string;
  dailyRate?: string;
  description: string;
  features: string[];
  type: 'sale' | 'hire';
  popular: boolean;
  images: Array<{
    url: string;
    label: string;
  }>;
  metadata: {
    createdAt: string;
    lastUpdated: string;
    loadTimeMs?: number;
  };
}

class VehicleDataStorage {
  private static readonly DATA_FILE = 'vehicles-data.json';
  private static vehicles: VehicleData[] = [];
  private static loadStartTime: number = 0;

  // Start timing for load operation
  static startLoadTimer() {
    this.loadStartTime = performance.now();
  }

  // End timing and record load time
  static endLoadTimer() {
    if (this.loadStartTime > 0) {
      const loadTime = performance.now() - this.loadStartTime;
      console.log(`Vehicle data load time: ${loadTime.toFixed(2)}ms`);
      return loadTime;
    }
    return 0;
  }

  // Add a vehicle to storage
  static addVehicle(vehicle: Omit<VehicleData, 'metadata' | 'id'>): VehicleData {
    const newVehicle: VehicleData = {
      ...vehicle,
      id: `veh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    };
    
    this.vehicles.push(newVehicle);
    this.saveToStorage();
    return newVehicle;
  }

  // Update a vehicle
  static updateVehicle(id: string, updates: Partial<VehicleData>): VehicleData | null {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehicles[index] = {
        ...this.vehicles[index],
        ...updates,
        metadata: {
          ...this.vehicles[index].metadata,
          lastUpdated: new Date().toISOString()
        }
      };
      this.saveToStorage();
      return this.vehicles[index];
    }
    return null;
  }

  // Get all vehicles
  static getVehicles(): VehicleData[] {
    return [...this.vehicles];
  }

  // Get vehicles by type
  static getVehiclesByType(type: 'sale' | 'hire'): VehicleData[] {
    return this.vehicles.filter(v => v.type === type);
  }

  // Save to localStorage (simulating GitHub file storage)
  private static saveToStorage() {
    try {
      const dataToSave = {
        vehicles: this.vehicles,
        lastSaved: new Date().toISOString(),
        totalVehicles: this.vehicles.length
      };
      localStorage.setItem(this.DATA_FILE, JSON.stringify(dataToSave, null, 2));
      console.log(`Saved ${this.vehicles.length} vehicles to storage`);
    } catch (error) {
      console.error('Failed to save vehicle data:', error);
    }
  }

  // Load from localStorage
  static loadFromStorage() {
    try {
      this.startLoadTimer();
      const data = localStorage.getItem(this.DATA_FILE);
      if (data) {
        const parsed = JSON.parse(data);
        this.vehicles = parsed.vehicles || [];
        const loadTime = this.endLoadTimer();
        
        // Add load time to each vehicle's metadata
        if (loadTime > 0) {
          this.vehicles = this.vehicles.map(vehicle => ({
            ...vehicle,
            metadata: {
              ...vehicle.metadata,
              loadTimeMs: loadTime
            }
          }));
        }
        
        console.log(`Loaded ${this.vehicles.length} vehicles from storage in ${loadTime.toFixed(2)}ms`);
        return true;
      }
      this.endLoadTimer();
      return false;
    } catch (error) {
      console.error('Failed to load vehicle data:', error);
      this.endLoadTimer();
      return false;
    }
  }

  // Export data as JSON string (for GitHub commit)
  static exportAsJson(): string {
    return JSON.stringify({
      vehicles: this.vehicles,
      exportDate: new Date().toISOString(),
      totalVehicles: this.vehicles.length
    }, null, 2);
  }

  // Import data from JSON
  static importFromJson(jsonString: string): boolean {
    try {
      this.startLoadTimer();
      const data = JSON.parse(jsonString);
      this.vehicles = data.vehicles || [];
      const loadTime = this.endLoadTimer();
      
      // Add load time to metadata
      if (loadTime > 0) {
        this.vehicles = this.vehicles.map(vehicle => ({
          ...vehicle,
          metadata: {
            ...vehicle.metadata,
            loadTimeMs: loadTime
          }
        }));
      }
      
      this.saveToStorage();
      console.log(`Imported ${this.vehicles.length} vehicles in ${loadTime.toFixed(2)}ms`);
      return true;
    } catch (error) {
      console.error('Failed to import vehicle data:', error);
      this.endLoadTimer();
      return false;
    }
  }

  // Clear all data
  static clearData() {
    this.vehicles = [];
    localStorage.removeItem(this.DATA_FILE);
    console.log('Cleared all vehicle data');
  }

  // Get load statistics
  static getLoadStatistics() {
    const loadTimes = this.vehicles
      .map(v => v.metadata.loadTimeMs)
      .filter((time): time is number => time !== undefined);
    
    if (loadTimes.length === 0) return null;
    
    const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    const minLoadTime = Math.min(...loadTimes);
    const maxLoadTime = Math.max(...loadTimes);
    
    return {
      average: avgLoadTime,
      minimum: minLoadTime,
      maximum: maxLoadTime,
      samples: loadTimes.length
    };
  }
}

// Initialize storage on module load
VehicleDataStorage.loadFromStorage();

export { VehicleDataStorage, type VehicleData };