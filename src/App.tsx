import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

export function App() {
  return <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen w-full bg-white">
          <Navigation />
          <main className="flex-grow">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>;
}