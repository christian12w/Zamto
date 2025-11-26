// Static vehicle service that loads data from a local JSON file
import vehiclesData from '../data/vehicles.json';
import { Vehicle } from '../utils/vehicleStorage';

interface VehicleResponse {
  success: boolean;
  vehicles?: Vehicle[];
  vehicle?: Vehicle;
  message?: string;
}

class StaticVehicleService {
  // Get all vehicles from static JSON data with enhanced error handling
  async getVehicles(): Promise<VehicleResponse> {
    try {
      // Simulate network delay for realistic loading experience
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Ensure we have valid vehicle data
      if (!vehiclesData || !Array.isArray(vehiclesData)) {
        throw new Error('Invalid vehicle data format');
      }
      
      // Return the vehicles data from the JSON file
      const vehicles = vehiclesData as unknown as Vehicle[];
      
      // Validate that we have vehicles
      if (vehicles.length === 0) {
        console.warn('No vehicles found in static data');
        return {
          success: true,
          vehicles: [],
          message: 'No vehicles available'
        };
      }
      
      console.log(`Successfully loaded ${vehicles.length} vehicles from static data`);
      return {
        success: true,
        vehicles: vehicles,
        message: 'Vehicles retrieved successfully'
      };
    } catch (error: any) {
      console.error('Failed to retrieve vehicles from static data:', error);
      return {
        success: false,
        message: error.message || 'Failed to retrieve vehicles from static data'
      };
    }
  }

  // For static data, other methods like addVehicle, updateVehicle, etc. 
  // would only work in memory and not persist between sessions
  // We'll implement them for completeness but note they won't persist

  async addVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<VehicleResponse> {
    try {
      // Generate a new ID (in a real implementation, you might want to use a more robust method)
      const newId = ((vehiclesData as unknown as Vehicle[]).length + 1).toString();
      
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: newId
      };
      
      // Note: This won't persist after page refresh since it's static data
      // In a real static implementation, you'd need to update the JSON file
      // or use localStorage for persistence
      
      return {
        success: true,
        vehicle: newVehicle,
        message: 'Vehicle added successfully (note: this is temporary and will not persist after page refresh)'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to add vehicle'
      };
    }
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<VehicleResponse> {
    try {
      // Find the vehicle to update
      const vehicleIndex = (vehiclesData as unknown as Vehicle[]).findIndex((v: any) => v.id === id);
      
      if (vehicleIndex === -1) {
        return {
          success: false,
          message: 'Vehicle not found'
        };
      }
      
      // Update the vehicle (this is temporary and won't persist)
      const updatedVehicle = {
        ...((vehiclesData as unknown as Vehicle[])[vehicleIndex] as Vehicle),
        ...updates
      };
      
      return {
        success: true,
        vehicle: updatedVehicle,
        message: 'Vehicle updated successfully (note: this is temporary and will not persist after page refresh)'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update vehicle'
      };
    }
  }

  async updateVehicleStatus(id: string, status: 'available' | 'sold'): Promise<VehicleResponse> {
    try {
      // Get vehicles from localStorage cache or fallback to static data
      let vehicles: Vehicle[] = [];
      const cachedVehicles = localStorage.getItem('vehicles_cache');
      
      if (cachedVehicles) {
        try {
          vehicles = JSON.parse(cachedVehicles);
        } catch (e) {
          console.error('Failed to parse cached vehicles:', e);
          vehicles = vehiclesData as unknown as Vehicle[];
        }
      } else {
        vehicles = vehiclesData as unknown as Vehicle[];
      }
      
      // Validate vehicles array
      if (!Array.isArray(vehicles)) {
        throw new Error('Invalid vehicles data');
      }
      
      // Find the vehicle to update
      const vehicleIndex = vehicles.findIndex((v: Vehicle) => v.id === id);
      
      if (vehicleIndex === -1) {
        return {
          success: false,
          message: 'Vehicle not found'
        };
      }
      
      // Update the vehicle status
      const updatedVehicle = {
        ...vehicles[vehicleIndex],
        status
      };
      
      // Update the vehicle in the array
      vehicles[vehicleIndex] = updatedVehicle;
      
      // Update localStorage cache
      try {
        localStorage.setItem('vehicles_cache', JSON.stringify(vehicles));
        // Also update the timestamp
        localStorage.setItem('vehicles_cache_timestamp', Date.now().toString());
      } catch (e) {
        console.error('Failed to update localStorage cache:', e);
      }
      
      return {
        success: true,
        vehicle: updatedVehicle,
        message: `Vehicle status updated to ${status}`
      };
    } catch (error: any) {
      console.error('Failed to update vehicle status:', error);
      return {
        success: false,
        message: error.message || 'Failed to update vehicle status'
      };
    }
  }

  async deleteVehicle(id: string): Promise<VehicleResponse> {
    try {
      // Find the vehicle to delete
      const vehicleIndex = (vehiclesData as unknown as Vehicle[]).findIndex((v: any) => v.id === id);
      
      if (vehicleIndex === -1) {
        return {
          success: false,
          message: 'Vehicle not found'
        };
      }
      
      // Remove the vehicle (this is temporary and won't persist)
      return {
        success: true,
        message: 'Vehicle deleted successfully (note: this is temporary and will not persist after page refresh)'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete vehicle'
      };
    }
  }
}

// Export singleton instance
export const staticVehicleService = new StaticVehicleService();