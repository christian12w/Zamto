import React from 'react';
import { XIcon, CarIcon, TagIcon, ClockIcon, CheckCircleIcon, PhoneIcon, UsersIcon, PaletteIcon, ShoppingCartIcon, CheckIcon, CalendarIcon, FuelIcon, SettingsIcon } from 'lucide-react';
import { Vehicle, updateVehicleStatus } from '../utils/vehicleStorage';

interface VehicleDetailsModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export function VehicleDetailsModal({ vehicle, onClose }: VehicleDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [{
    url: vehicle.image,
    label: 'exterior'
  }];
  
  // Check if user is admin (simplified check)
  const isAdmin = !!localStorage.getItem('authToken');
  
  const handleStatusChange = async (status: 'available' | 'sold') => {
    if (window.confirm(`Are you sure you want to mark this vehicle as ${status}?`)) {
      await updateVehicleStatus(vehicle.id, status);
      // Close the modal after updating status
      onClose();
    }
  };
  
  // Preload next image for smoother experience
  React.useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const img = new Image();
      img.src = images[nextIndex].url;
    }
  }, [currentImageIndex, images]);
  
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#003366]">
            {vehicle.name}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Image Gallery */}
          <div className="relative h-64 md:h-80 overflow-hidden rounded-lg mb-6">
            <img 
              src={images[currentImageIndex].url} 
              alt={`${vehicle.name} - ${images[currentImageIndex].label}`} 
              className="w-full h-full object-contain"
              loading="lazy"
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentImageIndex(index)} 
                      className={`transition-all ${index === currentImageIndex ? 'bg-white w-8 h-2' : 'bg-white bg-opacity-50 w-2 h-2'} rounded-full`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                  {images[currentImageIndex].label.charAt(0).toUpperCase() + images[currentImageIndex].label.slice(1)}
                </div>
              </>
            )}
          </div>
          
          {/* Status indicator */}
          {vehicle.status === 'sold' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-red-100 text-red-800">
              <ShoppingCartIcon className="h-4 w-4 mr-1" />
              SOLD
            </div>
          )}
          
          {/* Vehicle Type Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
            vehicle.type === 'sale' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {vehicle.type === 'sale' ? (
              <>
                <TagIcon className="h-4 w-4 mr-1" />
                FOR SALE
              </>
            ) : (
              <>
                <ClockIcon className="h-4 w-4 mr-1" />
                FOR HIRE
              </>
            )}
          </div>
          
          {/* Price Information */}
          <div className="mb-6">
            {vehicle.type === 'sale' ? (
              <div>
                <span className="text-sm text-gray-500 block">Price</span>
                <span className="text-3xl font-bold text-[#003366]">
                  {vehicle.price}
                </span>
                {vehicle.status === 'sold' && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                    <ShoppingCartIcon className="h-4 w-4 mr-1" />
                    SOLD
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span className="text-sm text-gray-500 block">Daily Rate</span>
                <span className="text-3xl font-bold text-[#003366]">
                  {vehicle.dailyRate || 'Contact for rates'}
                </span>
              </div>
            )}
          </div>
          
          {/* Admin controls for marking vehicle as sold/available */}
          {isAdmin && vehicle.type === 'sale' && (
            <div className="mb-6">
              <div className="flex gap-3">
                {vehicle.status !== 'sold' ? (
                  <button
                    onClick={() => handleStatusChange('sold')}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Mark as Sold
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('available')}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Mark as Available
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#003366] mb-2">Description</h3>
            <p className="text-gray-700">{vehicle.description}</p>
          </div>
          
          {/* Key Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#003366] mb-3">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vehicle.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#228B22] mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Technical Specifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#003366] mb-3">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-[#003366] mr-2" />
                <div>
                  <span className="text-sm text-gray-500 block">Year</span>
                  <span className="font-medium">{vehicle.year || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <SettingsIcon className="h-5 w-5 text-[#003366] mr-2" />
                <div>
                  <span className="text-sm text-gray-500 block">Mileage</span>
                  <span className="font-medium">{vehicle.mileage || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <SettingsIcon className="h-5 w-5 text-[#003366] mr-2" />
                <div>
                  <span className="text-sm text-gray-500 block">Transmission</span>
                  <span className="font-medium">{vehicle.transmission || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <FuelIcon className="h-5 w-5 text-[#003366] mr-2" />
                <div>
                  <span className="text-sm text-gray-500 block">Fuel Type</span>
                  <span className="font-medium">{vehicle.fuelType || 'N/A'}</span>
                </div>
              </div>
              
              {vehicle.engineSize && (
                <div className="flex items-center">
                  <CarIcon className="h-5 w-5 text-[#003366] mr-2" />
                  <div>
                    <span className="text-sm text-gray-500 block">Engine Size</span>
                    <span className="font-medium">{vehicle.engineSize}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-[#003366] mr-2" />
                <div>
                  <span className="text-sm text-gray-500 block">Doors/Seats</span>
                  <span className="font-medium">
                    {vehicle.doors ? `${vehicle.doors} doors` : 'N/A'} / 
                    {vehicle.seats ? ` ${vehicle.seats} seats` : ' N/A'}
                  </span>
                </div>
              </div>
              
              {vehicle.color && (
                <div className="flex items-center">
                  <PaletteIcon className="h-5 w-5 text-[#003366] mr-2" />
                  <div>
                    <span className="text-sm text-gray-500 block">Color</span>
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Condition & History */}
          {(vehicle.condition || vehicle.serviceHistory || vehicle.accidentHistory) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#003366] mb-3">Condition & History</h3>
              <div className="space-y-3">
                {vehicle.condition && (
                  <div>
                    <span className="text-sm text-gray-500 block">Condition</span>
                    <span className="font-medium">{vehicle.condition}</span>
                  </div>
                )}
                
                {vehicle.serviceHistory && (
                  <div>
                    <span className="text-sm text-gray-500 block">Service History</span>
                    <p className="font-medium">{vehicle.serviceHistory}</p>
                  </div>
                )}
                
                {vehicle.accidentHistory && (
                  <div>
                    <span className="text-sm text-gray-500 block">Accident History</span>
                    <p className="font-medium">{vehicle.accidentHistory}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Additional Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {vehicle.warranty && (
              <div>
                <span className="text-sm text-gray-500 block">Warranty</span>
                <span className="font-medium">{vehicle.warranty}</span>
              </div>
            )}
            
            {vehicle.registrationStatus && (
              <div>
                <span className="text-sm text-gray-500 block">Registration Status</span>
                <span className="font-medium">{vehicle.registrationStatus}</span>
              </div>
            )}
            
            {vehicle.type === 'hire' && vehicle.insuranceStatus && (
              <div>
                <span className="text-sm text-gray-500 block">Insurance Status</span>
                <span className="font-medium">{vehicle.insuranceStatus}</span>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <div className="flex justify-center pt-4 border-t">
            <a 
              href="/contact" 
              className="flex items-center bg-gradient-to-r from-[#FF6600] to-[#e55a00] hover:from-[#e55a00] hover:to-[#FF6600] text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              {vehicle.type === 'sale' ? 'Inquire About Purchase' : 'Book for Hire'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default icons for missing imports
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
