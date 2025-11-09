// Mock authentication service that simulates backend API calls
// In a real application, this would connect to an actual backend server

import { hashPassword, validateEmail, validatePassword, checkRateLimit } from '../utils/security';

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

// Mock database - in a real app this would be a actual database
let mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  }
];

// Store user passwords separately (in a real app, these would be properly hashed)
let userPasswords: Record<string, string> = {
  'admin': hashPassword('admin123') // username: hashed password
};

// Mock tokens - in a real app this would be handled by the backend
const mockTokens: Record<string, string> = {
  '1': 'mock-jwt-token-admin-123'
};

class AuthService {
  // Simulate API delay
  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Login user with security enhancements
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay();
    
    // Rate limiting
    const ipIdentifier = 'login_' + credentials.username;
    if (!checkRateLimit(ipIdentifier)) {
      return {
        success: false,
        message: 'Too many login attempts. Please try again later.'
      };
    }
    
    // Input validation
    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        message: 'Username and password are required'
      };
    }
    
    const user = mockUsers.find(
      u => u.username === credentials.username
    );
    
    // Check if user exists and password matches
    if (user && userPasswords[user.username] === hashPassword(credentials.password)) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      
      return {
        success: true,
        user: { ...user },
        token: mockTokens[user.id],
        message: 'Login successful'
      };
    }
    
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }

  // Register new user with security enhancements
  async register(data: RegisterData): Promise<AuthResponse> {
    await this.delay();
    
    // Rate limiting
    const ipIdentifier = 'register_' + data.username;
    if (!checkRateLimit(ipIdentifier)) {
      return {
        success: false,
        message: 'Too many registration attempts. Please try again later.'
      };
    }
    
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
    
    // Check if username already exists
    if (mockUsers.some(u => u.username === data.username)) {
      return {
        success: false,
        message: 'Username already exists'
      };
    }
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === data.email)) {
      return {
        success: false,
        message: 'Email already registered'
      };
    }
    
    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      username: data.username,
      email: data.email,
      role: 'admin', // For this admin panel, all users are admins
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Store hashed password
    userPasswords[data.username] = hashPassword(data.password);
    
    // Generate token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    mockTokens[newUser.id] = token;
    
    return {
      success: true,
      user: newUser,
      token,
      message: 'User registered successfully'
    };
  }

  // Get all users (admin only) with security enhancements
  async getUsers(token: string): Promise<{ success: boolean; users?: User[]; message?: string }> {
    await this.delay();
    
    // Validate token format
    if (!token) {
      return {
        success: false,
        message: 'Authentication required'
      };
    }
    
    // Validate token (simplified for demo)
    const userId = Object.keys(mockTokens).find(id => mockTokens[id] === token);
    if (!userId) {
      return {
        success: false,
        message: 'Invalid authentication token'
      };
    }
    
    // Check if user is admin
    const user = mockUsers.find(u => u.id === userId);
    if (!user || user.role !== 'admin') {
      return {
        success: false,
        message: 'Access denied. Admin privileges required.'
      };
    }
    
    return {
      success: true,
      users: [...mockUsers],
      message: 'Users retrieved successfully'
    };
  }

  // Delete user (admin only) with security enhancements
  async deleteUser(token: string, userId: string): Promise<{ success: boolean; message?: string }> {
    await this.delay();
    
    // Validate inputs
    if (!token || !userId) {
      return {
        success: false,
        message: 'Token and user ID are required'
      };
    }
    
    // Validate token (simplified for demo)
    const requesterId = Object.keys(mockTokens).find(id => mockTokens[id] === token);
    if (!requesterId) {
      return {
        success: false,
        message: 'Invalid authentication token'
      };
    }
    
    // Check if user is admin
    const requester = mockUsers.find(u => u.id === requesterId);
    if (!requester || requester.role !== 'admin') {
      return {
        success: false,
        message: 'Access denied. Admin privileges required.'
      };
    }
    
    // Prevent deleting the last admin
    const adminCount = mockUsers.filter(u => u.role === 'admin').length;
    const userToDelete = mockUsers.find(u => u.id === userId);
    
    if (userToDelete && userToDelete.role === 'admin' && adminCount <= 1) {
      return {
        success: false,
        message: 'Cannot delete the last admin user'
      };
    }
    
    // Delete user
    if (userToDelete) {
      delete userPasswords[userToDelete.username];
    }
    mockUsers = mockUsers.filter(u => u.id !== userId);
    delete mockTokens[userId];
    
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }

  // Logout user
  async logout(token: string): Promise<{ success: boolean; message?: string }> {
    await this.delay();
    
    // In a real app, you would invalidate the token on the backend
    // For this mock, we'll just return success
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  // Change password with security enhancements
  async changePassword(
    token: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    await this.delay();
    
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
    
    // Validate token (simplified for demo)
    const userId = Object.keys(mockTokens).find(id => mockTokens[id] === token);
    if (!userId) {
      return {
        success: false,
        message: 'Invalid authentication token'
      };
    }
    
    // Find user
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    // Verify current password
    if (userPasswords[user.username] !== hashPassword(currentPassword)) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }
    
    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      return {
        success: false,
        message: 'New password must be different from current password'
      };
    }
    
    // Update password
    userPasswords[user.username] = hashPassword(newPassword);
    
    return {
      success: true,
      message: 'Password changed successfully'
    };
  }
}

// Export singleton instance
export const authService = new AuthService();