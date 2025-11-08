import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Inventory } from './pages/Inventory';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { VehiclesForSale } from './pages/VehiclesForSale';
import { VehiclesForHire } from './pages/VehiclesForHire';
import { Login } from './pages/Login';

// Protected route component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF6600]"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/vehicles-for-sale" element={<VehiclesForSale />} />
      <Route path="/vehicles-for-hire" element={<VehiclesForHire />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}