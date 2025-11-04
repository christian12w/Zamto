import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, MailIcon, FacebookIcon, InstagramIcon } from 'lucide-react';
export function Footer() {
  return <footer className="bg-[#003366] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ZAMTO AFRICA</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for all your automotive needs. Specializing
              in sales and leasing of Japanese imported vehicles.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-[#FF6600] mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Handyman's Great East Road, Plot 1222, Roma Park, Lusaka,
                  Zambia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-[#FF6600] flex-shrink-0" />
                <span className="text-gray-300">+260 572 213 038</span>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-[#FF6600] flex-shrink-0" />
                <span className="text-gray-300">zamtoafrica@gmail.com</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-300 hover:text-[#FF6600] transition-colors">
                About Us
              </Link>
              <Link to="/services" className="block text-gray-300 hover:text-[#FF6600] transition-colors">
                Our Services
              </Link>
              <Link to="/inventory" className="block text-gray-300 hover:text-[#FF6600] transition-colors">
                Vehicle Inventory
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-[#FF6600] transition-colors">
                Contact Us
              </Link>
              <Link to="/admin" className="block text-gray-400 hover:text-[#FF6600] transition-colors text-sm">
                Admin
              </Link>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com/61579938793214" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6600] transition-colors">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/zamtoafrica" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6600] transition-colors">
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Zamto Africa Company Ltd. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}