# Zamto Africa

A modern web application for managing vehicle inventory with admin capabilities, built with React, Vite, and TypeScript.

## Features

- Home page with navigation
- Vehicle inventory display
- Admin interface for vehicle management
- Contact form using EmailJS
- About and Services pages

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Email Integration**: EmailJS
- **Backend**: Node.js with Express (separate server)

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file based on `.env.example`
4. Run `npm run dev` to start the development server

## Available Scripts

- `npm run dev` - Starts the frontend development server
- `npm run build` - Builds the production-ready application
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint to check for code issues
- `npm run backend` - Starts the backend server
- `npm run backend:dev` - Starts the backend server with auto-reload

## Backend Integration

This application now connects to a real backend API. To configure the backend connection:

1. Create a `.env` file in the root directory
2. Add the following environment variable:
   ```
   VITE_API_BASE_URL=your_backend_api_url
   ```
3. The default URL is set to `http://localhost:3001/api` for local development

### Setting up the Backend

1. Install backend dependencies:
   ```bash
   npm install bcrypt express jsonwebtoken cors express-rate-limit
   ```

2. For development, also install:
   ```bash
   npm install --save-dev nodemon
   ```

3. Start the backend server:
   ```bash
   npm run backend
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run backend:dev
   ```

### Default Admin Credentials

The application comes with a default admin user:
- **Username:** admin
- **Password:** admin123

**Important:** Change this password immediately after your first login for security reasons.

## Deployment

### Netlify Deployment

1. Push your code to a GitHub repository
2. Log in to your Netlify account
3. Click "New site from Git"
4. Select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Netlify settings if needed
7. Click "Deploy site"

Alternatively, you can use the Netlify CLI:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify init` to connect your project
3. Set environment variables with `netlify env:set VITE_API_BASE_URL your_production_url`
4. Run `netlify deploy` to deploy

### Backend Deployment

For production deployment of the backend:
1. Set environment variables:
   ```bash
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=3001
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page-level components
├── utils/            # Utility functions
├── App.tsx           # Main App component
├── AppRouter.tsx     # Routing configuration
└── index.tsx         # Entry point
```

## Documentation

- [Setup Guide](SETUP.md) - Complete setup instructions for frontend and backend
- [Backend Integration Guide](BACKEND_INTEGRATION.md) - Detailed API documentation
- [Security Checklist](SECURITY_CHECKLIST.md) - Security considerations and best practices
- [Improvements Summary](IMPROVEMENTS_SUMMARY.md) - Summary of recent improvements