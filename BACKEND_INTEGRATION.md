# Backend Integration Guide

This document provides instructions for setting up a real backend for the Zamto Africa application.

## Overview

The frontend application has been updated to connect to a real backend API instead of using mock services. This guide will help you set up the backend and configure the frontend to work with it.

## Backend API Endpoints

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change user password

### User Management
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### Vehicle Management
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Add a new vehicle (admin only)
- `PUT /api/vehicles/:id` - Update a vehicle (admin only)
- `DELETE /api/vehicles/:id` - Delete a vehicle (admin only)

## Request/Response Format

### Login
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin|user",
    "createdAt": "ISO date string",
    "lastLogin": "ISO date string"
  },
  "token": "JWT token",
  "message": "string"
}
```

### Register
**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin|user",
    "createdAt": "ISO date string"
  },
  "token": "JWT token",
  "message": "string"
}
```

### Get Users
**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "admin|user",
      "createdAt": "ISO date string",
      "lastLogin": "ISO date string"
    }
  ],
  "message": "string"
}
```

### Delete User
**Response:**
```json
{
  "success": true,
  "message": "string"
}
```

### Change Password
**Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "string"
}
```

## Environment Configuration

### Frontend Configuration
The frontend uses the following environment variable:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

This can be set in a `.env` file in the root directory of the frontend project.

### Backend Implementation Requirements

1. **Authentication**: Implement JWT-based authentication
2. **Password Security**: Use proper password hashing (bcrypt recommended)
3. **Rate Limiting**: Implement rate limiting for authentication endpoints
4. **Input Validation**: Validate all input data
5. **Error Handling**: Return appropriate HTTP status codes and error messages
6. **CORS**: Configure CORS to allow requests from the frontend origin

## Example Backend Implementation

Here's a basic example of how you might implement the backend using Node.js and Express:

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// In-memory storage (replace with a real database)
const users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$...', // hashed password
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
  
  // Find user
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
  
  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  
  // Generate token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Return success response
  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    },
    token,
    message: 'Login successful'
  });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required'
    });
  }
  
  // Check if user already exists
  if (users.some(u => u.username === username || u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'Username or email already exists'
    });
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create new user
  const newUser = {
    id: (users.length + 1).toString(),
    username,
    email,
    password: hashedPassword,
    role: 'admin', // For this admin panel, all users are admins
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Generate token
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Return success response
  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    },
    token,
    message: 'User registered successfully'
  });
});

// Get users endpoint (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  // Return all users (excluding passwords)
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json({
    success: true,
    users: usersWithoutPasswords,
    message: 'Users retrieved successfully'
  });
});

// Delete user endpoint (admin only)
app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  // Prevent deleting the last admin
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userToDelete = users.find(u => u.id === id);
  
  if (userToDelete && userToDelete.role === 'admin' && adminCount <= 1) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete the last admin user'
    });
  }
  
  // Delete user
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Change password endpoint
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }
  
  // Find user
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Check current password
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }
  
  // Check if new password is different
  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password'
    });
  }
  
  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);
  
  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Logout endpoint
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a real implementation, you would invalidate the token
  // For JWT, this typically involves maintaining a blacklist
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
```

## Security Considerations

1. **Use HTTPS in production**: Always use HTTPS for production deployments
2. **Environment variables**: Store sensitive data like JWT secrets in environment variables
3. **Rate limiting**: Implement rate limiting to prevent brute force attacks
4. **Input validation**: Validate and sanitize all input data
5. **Password policies**: Enforce strong password policies
6. **Token expiration**: Set appropriate token expiration times
7. **Error handling**: Avoid exposing sensitive information in error messages

## Testing the Integration

1. Start your backend server
2. Update the `VITE_API_BASE_URL` in your `.env` file to match your backend URL
3. Start the frontend application
4. Test the authentication flow by logging in with valid credentials
5. Test user management features in the admin panel