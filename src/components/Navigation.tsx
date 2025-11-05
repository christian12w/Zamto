import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, CarIcon, ClockIcon } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [{
    path: '/',
    label: 'Home'
  }, {
    path: '/about',
    label: 'About Us'
  }, {
    path: '/services',
    label: 'Services'
  }, {
    path: '/vehicles-for-sale',
    label: 'Vehicles For Sale'
  }, {
    path: '/vehicles-for-hire',
    label: 'Vehicles For Hire'
  }, {
    path: '/inventory',
    label: 'All Inventory'
  }, {
    path: '/contact',
    label: 'Contact'
  }];

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return <nav className="bg-[#003366] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Zamto Africa Logo" className="h-12 w-12 md:h-16 md:w-16 object-contain" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold tracking-wide">
                ZAMTO AFRICA
              </span>
              <span className="text-xs text-gray-300 hidden sm:block">
                Your Trusted Partner
              </span>
            </div>
          </Link>
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path) ? 'bg-[#FF6600] text-white' : 'hover:bg-[#004080] hover:text-white'}`}>
                {link.label}
              </Link>)}
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-md hover:bg-[#004080] focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#004080] absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={handleLinkClick}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'bg-[#FF6600] text-white' 
                    : 'hover:bg-[#003366] text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>;
}