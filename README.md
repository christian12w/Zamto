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

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the production-ready application
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint to check for code issues

## Deployment

### Netlify Deployment

1. Push your code to a GitHub repository
2. Log in to your Netlify account
3. Click "New site from Git"
4. Select your repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

Alternatively, you can use the Netlify CLI:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify init` to connect your project
3. Run `netlify deploy` to deploy

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