import React, { useEffect, useState } from 'react';
import { VehicleCard } from '../components/VehicleCard';
import { getVehicles, Vehicle } from '../utils/vehicleStorage';
import { LayoutGridIcon, StarIcon, TruckIcon, CarIcon, Users2Icon } from 'lucide-react';
export function Inventory() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'POPULAR') return vehicle.popular;
    return vehicle.category === selectedCategory;
  });
  return <div className="w-full">
      <section className="bg-gradient-to-r from-[#003366] to-[#004080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Vehicle Inventory
          </h1>
          <p className="text-xl max-w-3xl">
            Browse our extensive collection of quality Japanese imported
            vehicles.
          </p>
          <div className="mt-8 flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-3xl font-bold">{vehicles.length}</span>
              <span className="text-sm ml-2">Vehicles Available</span>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 bg-white sticky top-20 z-40 shadow-lg border-b-4 border-[#FF6600]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => {
            const Icon = category.icon;
            return <button key={category.name} onClick={() => setSelectedCategory(category.name)} className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 ${selectedCategory === category.name ? 'bg-gradient-to-r from-[#FF6600] to-[#e55a00] text-white shadow-lg' : 'bg-gray-100 text-[#003366] hover:bg-gray-200'}`}>
                  <Icon className="h-5 w-5" />
                  <span>{category.label}</span>
                </button>;
          })}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
          </div>
          {filteredVehicles.length === 0 && <div className="text-center py-16">
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-gray-600 text-xl font-medium">
                No vehicles found in this category.
              </p>
              <p className="text-gray-500 mt-2">Please check back soon!</p>
            </div>}
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Don't See What You're Looking For?
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            We regularly update our inventory with new arrivals. Contact us to
            inquire about specific models or to be notified when new vehicles
            arrive.
          </p>
          <a href="/contact" className="inline-block bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-md font-semibold transition-colors">
            Contact Us
          </a>
        </div>
      </section>
    </div>;
}