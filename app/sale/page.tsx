        'use client';

import React, { useEffect, useState } from 'react';
import { VehicleCard } from '../../src/components/VehicleCard';
import { VehicleDetailsModal } from '../../src/components/VehicleDetailsModal';
import { getVehicles as getVehiclesWithOfflineSupport, Vehicle } from '../../src/utils/vehicleStorage';
import { LayoutGridIcon, StarIcon, TruckIcon, CarIcon, Users2Icon, PickaxeIcon } from 'lucide-react';

export default function VehiclesForSale() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

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

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const vehicleData = await getVehiclesWithOfflineSupport();
      console.log('Loaded sale vehicles:', vehicleData);
      console.log('Total sale vehicles loaded:', vehicleData.length);
      
      // Log the type of each vehicle for debugging
      vehicleData.forEach((vehicle, index) => {
        console.log(`Sale Vehicle ${index}: ${vehicle.name}, type: ${vehicle.type}, category: ${vehicle.category}`);
      });
      
      // Filter for sale vehicles only
      const saleVehicles = vehicleData.filter(vehicle => vehicle.type === 'sale');
      console.log('Filtered sale vehicles:', saleVehicles);
      console.log('Total sale vehicles after filtering:', saleVehicles.length);
      
      setVehicles(saleVehicles);
    } catch (error) {
      console.error('Error loading sale vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'POPULAR') return vehicle.popular;
    
    // For category matching, we'll do a more robust comparison
    // Trim whitespace and normalize the strings for comparison
    const vehicleCategory = vehicle.category ? vehicle.category.trim() : '';
    const selectedCategoryNormalized = selectedCategory.trim();
    
    return vehicleCategory === selectedCategoryNormalized;
  });

  const handleShowDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  return <div className="w-full">
      <section className="bg-gradient-to-r from-[#FF6600] to-[#e55a00] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Vehicles For Sale
          </h1>
          <p className="text-xl max-w-3xl">
            Browse our selection of quality pre-owned vehicles at competitive prices. All vehicles undergo thorough inspection.
          </p>
          <div className="mt-8 flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
              ) : (
                <>
                  <span className="text-3xl font-bold">{filteredVehicles.length}</span>
                  <span className="text-sm ml-2">Vehicles Available</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white sticky top-20 z-40 shadow-lg border-b-4 border-[#003366]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => {
            const Icon = category.icon;
            return <button 
              key={category.name} 
              onClick={() => setSelectedCategory(category.name)} 
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 ${selectedCategory === category.name ? 'bg-gradient-to-r from-[#003366] to-[#004080] text-white shadow-lg' : 'bg-gray-100 text-[#003366] hover:bg-gray-200'}`}
              disabled={loading}
            >
                  <Icon className="h-5 w-5" />
                  <span>{category.label}</span>
                </button>;
          })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6600]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredVehicles.map(vehicle => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onShowDetails={handleShowDetails} 
                  />
                ))}
              </div>
              {filteredVehicles.length === 0 && <div className="text-center py-16">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-gray-600 text-xl font-medium">
                    No vehicles found matching your criteria.
                  </p>
                  <p className="text-gray-500 mt-2">Try selecting different filters or check back soon!</p>
                </div>}
            </>
          )}
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-6">
            Looking for a Specific Vehicle?
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Our sales team can help you find the perfect vehicle for your needs. 
            Contact us to discuss your requirements and schedule a viewing.
          </p>
          <a href="/contact" className="inline-block bg-[#003366] hover:bg-[#002244] text-white px-8 py-3 rounded-md font-semibold transition-colors">
            Contact Us
          </a>
        </div>
      </section>

      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={handleCloseModal}
        />
      )}
    </div>;
}