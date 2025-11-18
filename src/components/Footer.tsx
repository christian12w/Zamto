import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';

export function Footer() {
  return <footer className="bg-[#003366] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-[#FF6600] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Our Location</p>
                  <p className="text-gray-300 text-sm">
                    Handyman's Great East Road, Plot 1222, Roma Park, Lusaka, Zambia
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-[#FF6600] flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Call Us</p>
                  <p className="text-gray-300 text-sm">+260 572 213 038</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-[#FF6600] flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Email Us</p>
                  <p className="text-gray-300 text-sm">zamtoafrica@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links - Centered */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-center">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              <div className="space-y-2">
                <Link to="/vehicles-for-sale" className="block text-gray-300 hover:text-[#FF6600] transition-colors text-sm text-center">
                  Vehicles For Sale
                </Link>
                <Link to="/vehicles-for-hire" className="block text-gray-300 hover:text-[#FF6600] transition-colors text-sm text-center">
                  Vehicles For Hire
                </Link>
                <Link to="/inventory" className="block text-gray-300 hover:text-[#FF6600] transition-colors text-sm text-center">
                  All Inventory
                </Link>
              </div>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-300 hover:text-[#FF6600] transition-colors text-sm text-center">
                  About Us
                </Link>
                <Link to="/services" className="block text-gray-300 hover:text-[#FF6600] transition-colors text-sm text-center">
                  Services
                </Link>
                <Link to="/contact" className="block text-gray-300 hover:text-[#FF6600] transition-colors text-sm text-center">
                  Contact
                </Link>
              </div>
            </div>
          </div>
          
          {/* Follow Us Section - Horizontal Icons */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-6 justify-start sm:justify-center lg:justify-start">
              <a href="https://www.facebook.com/profile.php?id=61581947339658&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-[#FF6600] transition-colors">
                <div className="bg-white rounded-full p-2">
                  <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs mt-2 text-center">Car Sales</span>
              </a>
              <a href="https://www.facebook.com/share/16yfxxVNUf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-[#FF6600] transition-colors">
                <div className="bg-white rounded-full p-2">
                  <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs mt-2 text-center">Car Rentals</span>
              </a>
              <a href="https://www.instagram.com/zamtoafrica?igsh=MWN3b3ZxMGk0OXIzaA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-[#FF6600] transition-colors">
                <div className="bg-white rounded-full p-2">
                  <svg className="h-5 w-5 text-[#E4405F]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.668.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-xs mt-2 text-center">Instagram</span>
              </a>
              <a href="http://www.tiktok.com/@zamtoafrica" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-[#FF6600] transition-colors">
                <div className="bg-white rounded-full p-2">
                  <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </div>
                <span className="text-xs mt-2 text-center">TikTok</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-500 mt-8 pt-6 text-center text-gray-400">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Zamto Africa Company Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}