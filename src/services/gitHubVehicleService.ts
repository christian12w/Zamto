// GitHub-based vehicle storage service for Netlify Functions
import { Vehicle } from '../utils/vehicleStorage';

interface GitHubVehicleResponse {
  vehicles: Vehicle[];
}

interface GitHubApiResponse {
  success: boolean;
  vehicle?: Vehicle;
  message?: string;
}

class GitHubVehicleService {
  private apiBase: string;

  constructor() {
    // Use Netlify Functions in production, fallback to mock in development
    this.apiBase = process.env.NODE_ENV === 'production' 
      ? '/.netlify/functions/api' 
      : 'http://localhost:8888/.netlify/functions/api';
  }

  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await fetch(`${this.apiBase}/vehicles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: GitHubVehicleResponse = await response.json();
      return data.vehicles || [];
    } catch (error) {
      console.error('Failed to fetch vehicles from GitHub:', error);
      // Fallback to localStorage or mock data
      return this.getFallbackVehicles();
    }
  }

  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> {
    try {
      const response = await fetch(`${this.apiBase}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GitHubApiResponse = await response.json();
      if (result.success && result.vehicle) {
        return result.vehicle;
      } else {
        throw new Error(result.message || 'Failed to create vehicle');
      }
    } catch (error) {
      console.error('Failed to create vehicle in GitHub:', error);
      throw error;
    }
  }

  async updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const response = await fetch(`${this.apiBase}/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GitHubApiResponse = await response.json();
      if (result.success && result.vehicle) {
        return result.vehicle;
      } else {
        throw new Error(result.message || 'Failed to update vehicle');
      }
    } catch (error) {
      console.error('Failed to update vehicle in GitHub:', error);
      throw error;
    }
  }

  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBase}/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GitHubApiResponse = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Failed to delete vehicle from GitHub:', error);
      throw error;
    }
  }

  private getFallbackVehicles(): Vehicle[] {
    // Return some mock data if GitHub is unavailable
    return [
      {
        id: '1',
        name: 'Toyota Land Cruiser',
        category: 'SUV',
        price: '$45,000',
        image: '/images/vehicles/landcruiser.jpg',
        images: [],
        description: 'Reliable 4x4 vehicle for off-road adventures',
        features: ['4WD', 'Automatic', 'Diesel'],
        popular: true,
        year: 2022,
        mileage: '15,000 km',
        transmission: 'Automatic',
        fuelType: 'Diesel',
        type: 'sale',
        dailyRate: '',
        status: 'available'
      },
      {
        id: '2',
        name: 'Toyota Hilux',
        category: 'Pickup',
        price: '$150/day',
        image: '/images/vehicles/hilux.jpg',
        images: [],
        description: 'Durable pickup for hire',
        features: ['4WD', 'Manual', 'Diesel'],
        popular: false,
        year: 2023,
        mileage: '5,000 km',
        transmission: 'Manual',
        fuelType: 'Diesel',
        type: 'hire',
        dailyRate: '$150/day',
        status: 'available'
      }
    ];
  }
}

export const gitHubVehicleService = new GitHubVehicleService();
