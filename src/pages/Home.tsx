import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, CarIcon, WrenchIcon, DollarSignIcon, MapPinIcon, ShieldCheckIcon, UsersIcon, ClockIcon, TagIcon } from 'lucide-react';
import { getVehicles, Vehicle } from '../utils/vehicleStorage';

export function Home() {
  const [vehicleCounts, setVehicleCounts] = useState({
    all: 0,
    sale: 0,
    hire: 0,
    popular: 0,
    suv: 0,
    smallCars: 0,
    familyCars: 0,
    pickupTrucks: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicleCounts = async () => {
      try {
        const vehicles = await getVehicles();
        setVehicleCounts({
          all: vehicles.length,
          sale: vehicles.filter(v => v.type === 'sale').length,
          hire: vehicles.filter(v => v.type === 'hire').length,
          popular: vehicles.filter(v => v.popular).length,
          suv: vehicles.filter(v => v.category === 'SUV').length,
          smallCars: vehicles.filter(v => v.category === 'SMALL CARS').length,
          familyCars: vehicles.filter(v => v.category === 'GROUPS & FAMILY CARS').length,
          pickupTrucks: vehicles.filter(v => v.category === 'PICKUP TRUCKS').length
        });
      } catch (error) {
        console.error('Failed to load vehicle counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicleCounts();
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
    name: 'ALL VEHICLES',
    count: vehicleCounts.all
  }, {
    name: 'FOR SALE',
    count: vehicleCounts.sale
  }, {
    name: 'FOR HIRE',
    count: vehicleCounts.hire
  }, {
    name: 'POPULAR',
    count: vehicleCounts.popular
  }, {
    name: 'SUV',
    count: vehicleCounts.suv
  }, {
    name: 'PICKUP TRUCKS',
    count: vehicleCounts.pickupTrucks
  }];

  return <div className="w-full">
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-cover bg-center" style={{
      backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url('https://uploadthingy.s3.us-west-1.amazonaws.com/iqKARi7zZYNxr28KqTMbcq/E5799C1F-7C18-46C0-A5BF-15DE2B697EB9_L0_001-30_10_2025%2C_12_59_14.png')`
    }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              ZAMTO AFRICA COMPANY LTD
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-4 sm:mb-6">
              Your Trusted Partner in Automotive Freedom
            </p>
            <p className="text-sm sm:text-base mb-6">
              Specializing in sales and leasing of Japanese imported vehicles.
              Drive your dreams with quality, reliability, and exceptional
              service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/inventory" 
                className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-md font-semibold transition-colors text-center"
              >
                Browse Inventory
              </Link>
              <Link 
                to="/contact" 
                className="bg-white hover:bg-gray-100 text-[#003366] px-6 py-3 rounded-md font-semibold transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Video Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-3 sm:mb-4">
              Welcome to Zamto Africa
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Discover why we're Zambia's premier destination for quality vehicles
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              {/* Actual video player - responsive and properly fitted */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
                <video 
                  className="w-full h-full object-contain"
                  controls
                  poster="/logo.png"
                  playsInline
                >
                  <source src="/zamto welcoming video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center max-w-3xl mx-auto">
            <p className="text-gray-700 text-sm sm:text-base">
              At Zamto Africa, we are committed to providing you with the best vehicle purchasing and rental experience in Zambia. 
              Our team of experts carefully selects each vehicle in our inventory to ensure quality, reliability, and value.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-3 sm:mb-4">
              Vehicle Categories
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Explore our diverse range of quality vehicles
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {categories.map(category => (
              <Link 
                key={category.name} 
                to="/inventory" 
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center border-2 border-transparent hover:border-[#FF6600]"
              >
                <h3 className="font-bold text-[#003366] mb-1 sm:mb-2 text-sm sm:text-base">
                  {category.name}
                </h3>
                <p className="text-[#228B22] font-semibold text-sm">
                  {loading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#228B22]"></span>
                  ) : (
                    `${category.count} vehicle${category.count !== 1 ? 's' : ''}`
                  )}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-[#003366] to-[#004080] p-6 sm:p-8 rounded-lg text-white">
              <div className="flex items-center mb-3 sm:mb-4">
                <TagIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                <h3 className="text-xl sm:text-2xl font-bold">Vehicles For Sale</h3>
              </div>
              <p className="mb-4 text-sm sm:text-base">
                Browse our extensive collection of quality pre-owned and new vehicles. 
                All vehicles are thoroughly inspected and come with competitive financing options.
              </p>
              <p className="text-2xl sm:text-3xl font-bold mb-4">
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                ) : (
                  `${vehicleCounts.sale} Vehicles Available`
                )}
              </p>
              <Link 
                to="/vehicles-for-sale" 
                className="inline-block bg-[#FF6600] hover:bg-[#e55a00] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base text-center"
              >
                View Vehicles For Sale
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-[#FF6600] to-[#e55a00] p-6 sm:p-8 rounded-lg text-white">
              <div className="flex items-center mb-3 sm:mb-4">
                <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                <h3 className="text-xl sm:text-2xl font-bold">Vehicles For Hire</h3>
              </div>
              <p className="mb-4 text-sm sm:text-base">
                Need a vehicle for a short period? Rent from our fleet of well-maintained vehicles 
                suitable for business trips, family outings, or special occasions.
              </p>
              <p className="text-2xl sm:text-3xl font-bold mb-4">
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                ) : (
                  `${vehicleCounts.hire} Vehicles Available`
                )}
              </p>
              <Link 
                to="/vehicles-for-hire" 
                className="inline-block bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base text-center"
              >
                View Vehicles For Hire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-3 sm:mb-4">
              Why Choose Zamto Africa?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              We're committed to providing you with an exceptional automotive experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="text-[#FF6600] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#003366] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-[#003366]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            Whether you're looking to buy or rent, our team is ready to help you drive away in the vehicle of your dreams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/inventory" 
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-md font-semibold transition-colors text-sm sm:text-base"
            >
              Browse Our Inventory
            </Link>
            <Link 
              to="/contact" 
              className="bg-white hover:bg-gray-100 text-[#003366] px-6 py-3 sm:px-8 sm:py-4 rounded-md font-semibold transition-colors text-sm sm:text-base"
            >
              Schedule a Test Drive
            </Link>
          </div>
        </div>
      </section>
    </div>;
}