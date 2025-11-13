# Zamto Africa - Setup Guide

This guide will help you set up both the frontend and backend for the Zamto Africa vehicle inventory application.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js) or yarn

## Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   Create a `.env` file in the root directory with the following content:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at http://localhost:5173

## Backend Setup

1. **Install backend dependencies:**
   ```bash
   npm install bcrypt express jsonwebtoken cors express-rate-limit
   ```
   
   For development, also install:
   ```bash
   npm install --save-dev nodemon
   ```

2. **Start the backend server:**
   ```bash
   npm run backend
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run backend:dev
   ```
   
   The backend will be available at http://localhost:3001

## Default Admin Credentials

The application comes with a default admin user:
- **Username:** admin
- **Password:** admin123

**Important:** Change this password immediately after your first login for security reasons.

## API Endpoints

Once the backend is running, the following API endpoints will be available:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change user password

### User Management (Admin only)
- `GET /api/users` - Get all users
- `DELETE /api/users/:id` - Delete a user

### Vehicle Management
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Add a new vehicle (admin only)
- `PUT /api/vehicles/:id` - Update a vehicle (admin only)
- `DELETE /api/vehicles/:id` - Delete a vehicle (admin only)

## Development Workflow

1. Start the backend server:
   ```bash
   npm run backend:dev
   ```

2. In a separate terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to http://localhost:5173

4. Log in with the default admin credentials

5. You can now manage vehicles and users through the admin panel

## Production Deployment

### Frontend
1. Build the frontend for production:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory, which can be deployed to any static hosting service.

### Backend
1. Set environment variables:
   ```bash
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=3001
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

## Troubleshooting

### Common Issues

1. **CORS errors:**
   Make sure the backend server is running and the `VITE_API_BASE_URL` in your `.env` file matches the backend URL.

2. **Connection refused:**
   Ensure both the frontend and backend servers are running on their respective ports.

3. **Login fails with "Invalid username or password":**
   Make sure you're using the correct default credentials (admin/admin123) or have created a new user.

### Getting Help

If you encounter any issues not covered in this guide:
1. Check the browser console and terminal for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that the required ports are not being used by other applications

For additional support, please refer to the [Backend Integration Guide](BACKEND_INTEGRATION.md) for more detailed information about the API endpoints and implementation details.