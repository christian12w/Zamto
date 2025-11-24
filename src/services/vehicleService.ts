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
const API_TIMEOUT = 45000; // Increase timeout to 45 seconds for better performance with large datasets

class VehicleService {
  // Helper function to make API requests with timeout
  private async apiRequest(endpoint: string, options: RequestInit, token?: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
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
      console.log(`API request completed with status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('Request timeout after', API_TIMEOUT, 'ms');
        throw new Error('Request timeout - the server took too long to respond. This might be due to server sleep mode. Please try again.');
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Helper function to make API requests with retry logic for server sleep mode
  private async apiRequestWithRetry(endpoint: string, options: RequestInit, token?: string, maxRetries: number = 3) {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`API request attempt ${attempt}/${maxRetries} to: ${API_BASE_URL}${endpoint}`);
        const result = await this.apiRequest(endpoint, options, token);
        return result;
      } catch (error: any) {
        lastError = error;
        console.log(`API request attempt ${attempt} failed:`, error.message);
        
        // If it's not a timeout error, don't retry
        if (!error.message || !error.message.includes('timeout')) {
          throw error;
        }
        
        // If it's the last attempt, throw the error
        if (attempt === maxRetries) {
          throw new Error(`Request failed after ${maxRetries} attempts. The server might be waking up from sleep mode. Please try again in a moment.`);
        }
        
        // Wait before retrying (exponential backoff: 2s, 4s, 8s, etc.)
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${waitTime}ms before retry ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw lastError || new Error('Unknown error occurred');
  }

  // Get all vehicles with pagination support
  async getVehicles(page: number = 1, limit: number = 50): Promise<VehicleResponse> {
    try {
      // Check if we have cached data that's still valid (cache for 5 minutes)
      const cacheKey = `vehicles_page_${page}_limit_${limit}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      if (cachedData && cacheTimestamp) {
        const ageInMinutes = (Date.now() - parseInt(cacheTimestamp)) / (1000 * 60);
        if (ageInMinutes < 5) { // Cache for 5 minutes
          console.log('Returning cached vehicle data');
          return {
            success: true,
            vehicles: JSON.parse(cachedData),
            message: 'Vehicles retrieved from cache'
          };
        }
      }
      
      // For now, we'll fetch all vehicles but we can add pagination later
      console.log(`Fetching vehicles from API: ${API_BASE_URL}/vehicles?page=${page}&limit=${limit}`);
      const response = await this.apiRequestWithRetry(`/vehicles?page=${page}&limit=${limit}`, {
        method: 'GET',
      });
      
      console.log('API response:', response);
      
      // Cache the response
      if (response.vehicles) {
        localStorage.setItem(cacheKey, JSON.stringify(response.vehicles));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      }
      
      return {
        success: true,
        vehicles: response.vehicles,
        message: response.message || 'Vehicles retrieved successfully'
      };
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      return {
        success: false,
        message: error.message || 'Failed to retrieve vehicles. Please check your network connection and API configuration.'
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
      
      const response = await this.apiRequestWithRetry('/vehicles', {
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
      
      const response = await this.apiRequestWithRetry(`/vehicles/${id}`, {
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
      
      const response = await this.apiRequestWithRetry(`/vehicles/${id}`, {
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
      
      const response = await this.apiRequestWithRetry('/vehicles/import', {
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

// Function to ping the server to keep it alive
export async function keepServerAlive(): Promise<void> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    await fetch(`${(import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/keep-alive`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Server keep-alive ping sent');
  } catch (error) {
    console.log('Server keep-alive ping failed (this is normal when server is sleeping):', error);
  }
}

// Set up periodic keep-alive pings
if (typeof window !== 'undefined') {
  // Ping every 10 minutes to keep server alive
  setInterval(() => {
    keepServerAlive();
  }, 10 * 60 * 1000); // 10 minutes
  
  // Also ping when the page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      keepServerAlive();
    }
  });
}

// Export singleton instance
export const vehicleService = new VehicleService();