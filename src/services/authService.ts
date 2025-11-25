// Authentication service that connects to a real backend API
import { hashPassword, validateEmail, validatePassword } from '../utils/security';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Backend API configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// Hardcoded admin credentials for static site
const STATIC_ADMIN_USER = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@zamtoafrica.com',
  role: 'admin' as const,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

const STATIC_ADMIN_PASSWORD = 'admin123';

class AuthService {
  // Helper function to make API requests with timeout
  private async apiRequest(endpoint: string, options: RequestInit) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
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

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Check if we're using static data
      const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
      
      if (useStaticData) {
        // Static authentication for demo purposes
        if (credentials.username === STATIC_ADMIN_USER.username && 
            credentials.password === STATIC_ADMIN_PASSWORD) {
          // Generate a simple token for static mode
          const token = btoa(`${STATIC_ADMIN_USER.username}:${STATIC_ADMIN_PASSWORD}:${Date.now()}`);
          
          return {
            success: true,
            user: STATIC_ADMIN_USER,
            token,
            message: 'Login successful'
          };
        } else {
          return {
            success: false,
            message: 'Invalid username or password'
          };
        }
      } else {
        // Input validation
        if (!credentials.username || !credentials.password) {
          return {
            success: false,
            message: 'Username and password are required'
          };
        }
        
        const response = await this.apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message || 'Login successful'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Invalid username or password'
      };
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if we're using static data
      const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
      
      if (useStaticData) {
        // Static mode - registration not supported
        return {
          success: false,
          message: 'Registration not available in static mode'
        };
      } else {
        // Input validation
        if (!data.username || !data.email || !data.password) {
          return {
            success: false,
            message: 'Username, email, and password are required'
          };
        }
        
        // Email validation
        if (!validateEmail(data.email)) {
          return {
            success: false,
            message: 'Invalid email format'
          };
        }
        
        // Password validation
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
          return {
            success: false,
            message: passwordValidation.message
          };
        }
        
        const response = await this.apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message || 'User registered successfully'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // Get all users (admin only)
  async getUsers(token: string): Promise<{ success: boolean; users?: User[]; message?: string }> {
    try {
      // Check if we're using static data
      const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
      
      if (useStaticData) {
        // Static mode - only return the admin user
        return {
          success: true,
          users: [STATIC_ADMIN_USER],
          message: 'Users retrieved successfully'
        };
      } else {
        // Validate token format
        if (!token) {
          return {
            success: false,
            message: 'Authentication required'
          };
        }
        
        const response = await this.apiRequest('/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        return {
          success: true,
          users: response.users,
          message: response.message || 'Users retrieved successfully'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve users'
      };
    }
  }

  // Delete user (admin only)
  async deleteUser(token: string, userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Check if we're using static data
      const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
      
      if (useStaticData) {
        // Static mode - deletion not supported
        return {
          success: false,
          message: 'User deletion not available in static mode'
        };
      } else {
        // Validate inputs
        if (!token || !userId) {
          return {
            success: false,
            message: 'Token and user ID are required'
          };
        }
        
        const response = await this.apiRequest(`/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        return {
          success: true,
          message: response.message || 'User deleted successfully'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete user'
      };
    }
  }

  // Logout user
  async logout(token: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Check if we're using static data
      const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
      
      if (useStaticData) {
        // Static mode - just clear local storage
        return {
          success: true,
          message: 'Logged out successfully'
        };
      } else {
        if (!token) {
          return {
            success: false,
            message: 'Authentication required'
          };
        }
        
        await this.apiRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        return {
          success: true,
          message: 'Logged out successfully'
        };
      }
    } catch (error: any) {
      // Even if logout fails on the backend, we should clear local state
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  // Change password
  async changePassword(
    token: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Check if we're using static data
      const useStaticData = (import.meta as any).env.VITE_USE_STATIC_DATA === 'true';
      
      if (useStaticData) {
        // Static mode - password change not supported
        return {
          success: false,
          message: 'Password change not available in static mode'
        };
      } else {
        // Validate inputs
        if (!token || !currentPassword || !newPassword) {
          return {
            success: false,
            message: 'All fields are required'
          };
        }
        
        // Password validation for new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
          return {
            success: false,
            message: passwordValidation.message
          };
        }
        
        const response = await this.apiRequest('/auth/change-password', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        
        return {
          success: true,
          message: response.message || 'Password changed successfully'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to change password'
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();