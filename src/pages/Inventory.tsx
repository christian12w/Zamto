import React, { useEffect, useState } from 'react';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleDetailsModal } from '../components/VehicleDetailsModal';
import { getVehicles, Vehicle } from '../utils/vehicleStorage';
import { LayoutGridIcon, StarIcon, TruckIcon, CarIcon, Users2Icon, TagIcon, ClockIcon, PickaxeIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Inventory() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialType = urlParams.get('type') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState(initialType);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const categories = [{
    name: 'ALL',
    icon: LayoutGridIcon,
    label: 'All Vehicles'
  }, {
    name: 'POPULAR',
    icon: StarIcon,
    label: 'Popular'
  }, {
    name: 'SUV',
    icon: TruckIcon,
    label: 'SUVs'
  }, {
    name: 'SMALL CARS',
    icon: CarIcon,
    label: 'Small Cars'
  }, {
    name: 'GROUPS & FAMILY CARS',
    icon: Users2Icon,
    label: 'Family Cars'
  }, {
    name: 'PICKUP TRUCKS',
    icon: PickaxeIcon,
    label: 'Pickup Trucks'
  }];

  const types = [{
    name: 'all',
    icon: LayoutGridIcon,
    label: 'All Vehicles'
  }, {
    name: 'sale',
    icon: TagIcon,
    label: 'For Sale'
  }, {
    name: 'hire',
    icon: ClockIcon,
    label: 'For Hire'
  }];

  const loadVehicles = () => {
    setVehicles(getVehicles());
  };

  useEffect(() => {
    loadVehicles();
    // Listen for vehicle updates from admin panel
    const handleVehiclesUpdate = () => {
      loadVehicles();
    };
    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    // Also listen for storage events (when localStorage changes in another tab)
    window.addEventListener('storage', handleVehiclesUpdate);
    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
      window.removeEventListener('storage', handleVehiclesUpdate);
    };
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    // Filter by type first
    if (selectedType !== 'all' && vehicle.type !== selectedType) {
      return false;
    }
    
    // Then filter by category
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'POPULAR') return vehicle.popular;
    return vehicle.category === selectedCategory;
  });

  const handleShowDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  return <div className="w-full">
      <section className="bg-gradient-to-r from-[#003366] to-[#004080] text-white py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Vehicle Inventory
          </h1>
          <p className="text-base sm:text-xl max-w-3xl">
            Browse our extensive collection of quality Japanese imported
            vehicles.
          </p>
          <div className="mt-6 sm:mt-8 flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-6 sm:py-3">
              <span className="text-2xl sm:text-3xl font-bold">{filteredVehicles.length}</span>
              <span className="text-xs sm:text-sm ml-2">Vehicles Available</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-white sticky top-20 z-40 shadow-lg border-b-4 border-[#FF6600]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-3 sm:mb-4">
            {types.map(type => {
            const Icon = type.icon;
            return <button 
              key={type.name} 
              onClick={() => setSelectedType(type.name)} 
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                selectedType === type.name 
                  ? 'bg-gradient-to-r from-[#FF6600] to-[#e55a00] text-white shadow-lg' 
                  : 'bg-gray-100 text-[#003366] hover:bg-gray-200'
              }`}
            >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{type.label}</span>
                </button>;
          })}
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map(category => {
            const Icon = category.icon;
            return <button 
              key={category.name} 
              onClick={() => setSelectedCategory(category.name)} 
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                selectedCategory === category.name 
                  ? 'bg-gradient-to-r from-[#003366] to-[#004080] text-white shadow-lg' 
                  : 'bg-gray-100 text-[#003366] hover:bg-gray-200'
              }`}
            >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{category.label}</span>
                </button>;
          })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onShowDetails={handleShowDetails} 
              />
            ))}
          </div>
          {filteredVehicles.length === 0 && <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🚗</div>
              <p className="text-gray-600 text-lg sm:text-xl font-medium">
                No vehicles found matching your criteria.
              </p>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">Try selecting different filters or check back soon!</p>
            </div>}
        </div>
      </section>
      
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#003366] mb-4 sm:mb-6">
            Don't See What You're Looking For?
          </h2>
          <p className="text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            We regularly update our inventory with new arrivals. Contact us to
            inquire about specific models or to be notified when new vehicles
            arrive.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-md font-semibold transition-colors text-sm sm:text-base"
          >
            Contact Us
          </a>
        </div>
      </section>
      
      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <VehicleDetailsModal 
          vehicle={selectedVehicle} 
          onClose={handleCloseModal} 
        />
      )}
    </div>;
}