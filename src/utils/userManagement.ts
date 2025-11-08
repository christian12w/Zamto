export interface AdminUser {
  id: string;
  username: string;
  createdAt: string;
  lastLogin?: string;
}

const USERS_STORAGE_KEY = 'zamto_admin_users';
const CURRENT_USER_KEY = 'zamto_current_admin';

// Get all admin users
export function getAdminUsers(): AdminUser[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save admin users to localStorage
export function saveAdminUsers(users: AdminUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Add a new admin user
export function addAdminUser(username: string, password: string): AdminUser {
  // Get existing users
  const users = getAdminUsers();
  
  // Hash the password (in a real app, this should be done server-side)
  const hashedPassword = btoa(password); // Simple base64 encoding for demo purposes
  
  // Create new user object
  const newUser: AdminUser = {
    id: Date.now().toString(),
    username,
    createdAt: new Date().toISOString()
  };
  
  // Save user credentials separately (in a real app, this should be in a secure database)
  const userCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');
  userCredentials[username] = hashedPassword;
  localStorage.setItem('admin_credentials', JSON.stringify(userCredentials));
  
  // Add new user to users list
  users.push(newUser);
  saveAdminUsers(users);
  
  return newUser;
}

// Authenticate user
export function authenticateUser(username: string, password: string): boolean {
  const userCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');
  const hashedPassword = btoa(password);
  
  if (userCredentials[username] === hashedPassword) {
    // Update last login
    const users = getAdminUsers();
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString();
      saveAdminUsers(users);
    }
    
    // Set current user
    localStorage.setItem(CURRENT_USER_KEY, username);
    return true;
  }
  
  return false;
}

// Get current logged in user
export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Delete user
export function deleteAdminUser(username: string): void {
  // Remove from users list
  const users = getAdminUsers().filter(user => user.username !== username);
  saveAdminUsers(users);
  
  // Remove credentials
  const userCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');
  delete userCredentials[username];
  localStorage.setItem('admin_credentials', JSON.stringify(userCredentials));
}

// Initialize with default admin user if none exists
export function initializeDefaultUser(): void {
  const users = getAdminUsers();
  if (users.length === 0) {
    // Create default admin user
    addAdminUser('admin', 'admin123');
  }
}