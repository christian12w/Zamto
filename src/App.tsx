import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Inventory } from './pages/Inventory';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
export function App() {
  return <BrowserRouter>
      <div className="flex flex-col min-h-screen w-full bg-white">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>;
}