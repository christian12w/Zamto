import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, CarIcon, WrenchIcon, DollarSignIcon, MapPinIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import { getVehicles } from '../utils/vehicleStorage';
export function Home() {
  const [vehicleCounts, setVehicleCounts] = useState({
    all: 0,
    popular: 0,
    suv: 0,
    smallCars: 0,
    familyCars: 0
  });
  useEffect(() => {
    const vehicles = getVehicles();
    setVehicleCounts({
      all: vehicles.length,
      popular: vehicles.filter(v => v.popular).length,
      suv: vehicles.filter(v => v.category === 'SUV').length,
      smallCars: vehicles.filter(v => v.category === 'SMALL CARS').length,
      familyCars: vehicles.filter(v => v.category === 'GROUPS & FAMILY CARS').length
    });
  }, []);
  const features = [{
    icon: <CarIcon className="h-8 w-8" />,
    title: 'Extensive Vehicle Selection',
    description: 'A wide array of new and pre-owned vehicles to suit every preference and budget.'
  }, {
    icon: <UsersIcon className="h-8 w-8" />,
    title: 'Customer-Centric Approach',
    description: 'We prioritize your needs and ensure a personalized and transparent buying process.'
  }, {
    icon: <ShieldCheckIcon className="h-8 w-8" />,
    title: 'Quality Assurance',
    description: 'All pre-owned vehicles are thoroughly inspected for your peace of mind.'
  }, {
    icon: <WrenchIcon className="h-8 w-8" />,
    title: 'Expert Service',
    description: 'Our certified technicians provide reliable and efficient maintenance and repair services.'
  }, {
    icon: <DollarSignIcon className="h-8 w-8" />,
    title: 'Competitive Pricing & Financing',
    description: 'We offer attractive prices and flexible financing solutions.'
  }, {
    icon: <MapPinIcon className="h-8 w-8" />,
    title: 'Convenient Location',
    description: "Strategically located at Handyman's Great East Road, Lusaka, Zambia for easy access."
  }];
  const categories = [{
    name: 'ALL',
    count: vehicleCounts.all
  }, {
    name: 'POPULAR',
    count: vehicleCounts.popular
  }, {
    name: 'SUV',
    count: vehicleCounts.suv
  }, {
    name: 'SMALL CARS',
    count: vehicleCounts.smallCars
  }, {
    name: 'GROUPS & FAMILY CARS',
    count: vehicleCounts.familyCars
  }];
  return <div className="w-full">
      <section className="relative h-[600px] bg-cover bg-center" style={{
      backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url('https://uploadthingy.s3.us-west-1.amazonaws.com/iqKARi7zZYNxr28KqTMbcq/E5799C1F-7C18-46C0-A5BF-15DE2B697EB9_L0_001-30_10_2025%2C_12_59_14.png')`
    }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ZAMTO AFRICA COMPANY LTD
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Your Trusted Partner in Automotive Freedom
            </p>
            <p className="text-lg mb-8">
              Specializing in sales and leasing of Japanese imported vehicles.
              Drive your dreams with quality, reliability, and exceptional
              service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/inventory" className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-md font-semibold transition-colors">
                Browse Inventory
              </Link>
              <Link to="/contact" className="bg-white hover:bg-gray-100 text-[#003366] px-8 py-3 rounded-md font-semibold transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
              Vehicle Categories
            </h2>
            <p className="text-gray-600">
              Explore our diverse range of quality vehicles
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map(category => <Link key={category.name} to="/inventory" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center border-2 border-transparent hover:border-[#FF6600]">
                <h3 className="font-bold text-[#003366] mb-2">
                  {category.name}
                </h3>
                <p className="text-[#228B22] font-semibold">
                  {category.count} vehicle{category.count !== 1 ? 's' : ''}
                </p>
              </Link>)}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Zamto Africa, we are more than just car sellers; we are
              automotive enthusiasts passionate about connecting people with
              quality vehicles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-[#FF6600] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#003366] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#003366] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Visit our showroom or contact us today to explore our extensive
            collection of Japanese imported vehicles.
          </p>
          <Link to="/contact" className="inline-block bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-md font-semibold transition-colors">
            Get Started
          </Link>
        </div>
      </section>
    </div>;
}