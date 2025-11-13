// Vehicle service that connects to the backend API
import { Vehicle, VehicleImage } from '../utils/vehicleStorage';

interface VehicleResponse {
  success: boolean;
  vehicles?: Vehicle[];
  vehicle?: Vehicle;
  message?: string;
  imported?: number;
}

// Backend API configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

class VehicleService {
  // Helper function to make API requests with timeout
  private async apiRequest(endpoint: string, options: RequestInit, token?: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get all vehicles
  async getVehicles(): Promise<VehicleResponse> {
    try {
      const response = await this.apiRequest('/vehicles', {
        method: 'GET',
      });
      
      return {
        success: true,
        vehicles: response.vehicles,
        message: response.message || 'Vehicles retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve vehicles'
      };
    }
  }

  // Add a new vehicle (admin only)
  async addVehicle(vehicleData: Omit<Vehicle, 'id'>, token: string): Promise<VehicleResponse> {
    try {
      // Validate token
      if (!token) {
        return {
          success: false,
          message: 'Authentication required'
        };
      }
      
      const response = await this.apiRequest('/vehicles', {
        method: 'POST',
        body: JSON.stringify(vehicleData),
      }, token);
      
      return {
        success: true,
        vehicle: response.vehicle,
        message: response.message || 'Vehicle added successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to add vehicle'
      };
    }
  }

  // Update a vehicle (admin only)
  async updateVehicle(id: string, updates: Partial<Vehicle>, token: string): Promise<VehicleResponse> {
    try {
      // Validate inputs
      if (!token || !id) {
        return {
          success: false,
          message: 'Token and vehicle ID are required'
        };
      }
      
      const response = await this.apiRequest(`/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }, token);
      
      return {
        success: true,
        vehicle: response.vehicle,
        message: response.message || 'Vehicle updated successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update vehicle'
      };
    }
  }

  // Delete a vehicle (admin only)
  async deleteVehicle(id: string, token: string): Promise<VehicleResponse> {
    try {
      // Validate inputs
      if (!token || !id) {
        return {
          success: false,
          message: 'Token and vehicle ID are required'
        };
      }
      
      const response = await this.apiRequest(`/vehicles/${id}`, {
        method: 'DELETE',
      }, token);
      
      return {
        success: true,
        message: response.message || 'Vehicle deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete vehicle'
      };
    }
  }

  // Import vehicles from CSV (admin only)
  async importVehicles(vehicles: Omit<Vehicle, 'id'>[], token: string): Promise<VehicleResponse> {
    try {
      // Validate inputs
      if (!token || !Array.isArray(vehicles)) {
        return {
          success: false,
          message: 'Token and vehicles array are required'
        };
      }
      
      const response = await this.apiRequest('/vehicles/import', {
        method: 'POST',
        body: JSON.stringify({ vehicles }),
      }, token);
      
      return {
        success: true,
        message: response.message || 'Vehicles imported successfully',
        imported: response.imported
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to import vehicles'
      };
    }
  }
}

// Export singleton instance
export const vehicleService = new VehicleService();