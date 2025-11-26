import React, { useState } from 'react';
import { CheckCircleIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, TagIcon, ClockIcon, EyeIcon, ShoppingCartIcon, CheckIcon } from 'lucide-react';
import { Vehicle } from '../utils/vehicleStorage';
import { updateVehicleStatus } from '../utils/vehicleStorage';

interface VehicleCardProps {
  vehicle: Vehicle;
  onShowDetails: (vehicle: Vehicle) => void;
}

export function VehicleCard({
  vehicle,
  onShowDetails
}: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Ensure vehicle has required properties
  if (!vehicle) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <p className="text-gray-600">Invalid vehicle data</p>
      </div>
    );
  }
  
  // Fallback for missing vehicle properties
  const safeVehicle = {
    id: vehicle.id || 'unknown',
    name: vehicle.name || 'Unnamed Vehicle',
    category: vehicle.category || 'Uncategorized',
    price: vehicle.price || 'Price not available',
    image: vehicle.image || '/placeholder.jpg',
    images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : [{
      url: vehicle.image || '/placeholder.jpg',
      label: 'exterior' as const
    }],
    description: vehicle.description || 'No description available',
    features: vehicle.features && Array.isArray(vehicle.features) ? vehicle.features : [],
    popular: vehicle.popular || false,
    type: vehicle.type || 'sale',
    status: vehicle.status || 'available',
    whatsappContact: vehicle.whatsappContact || '+260572213038',
    dailyRate: vehicle.dailyRate || undefined
  };
  
  const images = safeVehicle.images;
  
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  // Check if user is admin (simplified check)
  const isAdmin = !!localStorage.getItem('authToken');

  const handleStatusChange = async (status: 'available' | 'sold') => {
    if (window.confirm(`Are you sure you want to mark this vehicle as ${status}?`)) {
      const result = await updateVehicleStatus(vehicle.id, status);
      if (result) {
        // Update the vehicle in the component state if needed
        // This will trigger a re-render with the new status
        window.dispatchEvent(new Event('vehiclesUpdated'));
      }
    }
  };

  // Optimize image loading by preloading next image
  React.useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      const img = new Image();
      img.src = images[nextIndex].url;
    }
  }, [currentImageIndex, images]);

  return <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-[#FF6600] h-full flex flex-col">
      {safeVehicle.popular && <div className="bg-gradient-to-r from-[#FF6600] to-[#e55a00] text-white text-sm font-bold px-4 py-2 flex items-center">
          <SparklesIcon className="h-4 w-4 mr-2" />
          POPULAR CHOICE
        </div>}
      
      {/* Status indicator */}
      {safeVehicle.status === 'sold' && (
        <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 flex items-center justify-center">
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          SOLD
        </div>
      )}
      
      {/* Type indicator */}
      <div className={`flex items-center px-4 py-2 ${safeVehicle.type === 'sale' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
        {safeVehicle.type === 'sale' ? (
          <>
            <TagIcon className="h-4 w-4 mr-2" />
            <span className="font-semibold">FOR SALE</span>
          </>
        ) : (
          <>
            <ClockIcon className="h-4 w-4 mr-2" />
            <span className="font-semibold">FOR HIRE</span>
          </>
        )}
      </div>
      
      {/* Fixed the image container to be more responsive on mobile */}
      <div className="h-48 sm:h-56 md:h-64 overflow-hidden relative group flex-grow">
        <img 
          src={images[currentImageIndex].url} 
          alt={`${safeVehicle.name} - ${images[currentImageIndex].label}`} 
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
        />
        {/* Zamto logo on image */}
        <a 
          href="/contact" 
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white hover:bg-gray-100 text-[#003366] p-1.5 rounded-full opacity-90 hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white z-10 shadow-md hover:scale-110 border-2 border-[#003366]"
          aria-label="Contact Zamto Africa"
        >
          <img src="/logo.png" alt="Zamto Africa" className="h-4 w-4 object-contain" />
        </a>
        
        {images.length > 1 && <>
            <button 
              onClick={prevImage} 
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentImageIndex(index)} 
                  className={`transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-6 h-2' : 'bg-white bg-opacity-50 w-2 h-2'} rounded-full`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
            <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
              {images[currentImageIndex].label.charAt(0).toUpperCase() + images[currentImageIndex].label.slice(1)}
            </div>
          </>}
      </div>
      
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#003366]">{safeVehicle.name}</h3>
          <span className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold whitespace-nowrap">
            {safeVehicle.category}
          </span>
        </div>
        <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2 flex-grow">{safeVehicle.description}</p>
        <ul className="space-y-2 mb-4">
          {safeVehicle.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
              <CheckCircleIcon className="h-4 w-4 text-[#228B22] mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {/* Display price or daily rate based on vehicle type */}
          {safeVehicle.type === 'sale' ? (
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-xs text-gray-500 block">Price</span>
                <span className="text-lg sm:text-xl font-bold text-[#003366]">
                  {safeVehicle.price}
                </span>
              </div>
              {safeVehicle.status === 'sold' && (
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                  SOLD
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-xs text-gray-500 block">Daily Rate</span>
                <span className="text-lg sm:text-xl font-bold text-[#003366]">
                  {safeVehicle.dailyRate ? safeVehicle.dailyRate : 'Contact for rates'}
                </span>
              </div>
            </div>
          )}
          
          {/* Admin controls for marking vehicle as sold/available */}
          {isAdmin && safeVehicle.type === 'sale' && (
            <div className="mb-3 flex gap-2">
              {safeVehicle.status !== 'sold' ? (
                <button
                  onClick={() => handleStatusChange('sold')}
                  className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  <ShoppingCartIcon className="h-4 w-4 mr-1" />
                  Mark as Sold
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('available')}
                  className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Mark as Available
                </button>
              )}
            </div>
          )}
          
          {/* Improved button layout for better fit on mobile and web */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button 
              onClick={() => onShowDetails(safeVehicle)}
              className="flex items-center justify-center bg-gradient-to-r from-[#003366] to-[#004080] hover:from-[#004080] hover:to-[#003366] text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md w-full"
            >
              <EyeIcon className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="truncate text-sm sm:text-base">View Details</span>
            </button>
            
            {/* WhatsApp button */}
            <a 
              href={`https://wa.me/${safeVehicle.whatsappContact?.replace(/\D/g, '') || '260572213038'}?text=Hello,%20I'm%20interested%20in%20the%20${encodeURIComponent(safeVehicle.name)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.480-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.361.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="truncate text-sm sm:text-base">WhatsApp</span>
            </a>
            
            <a 
              href="/contact" 
              className="flex items-center justify-center bg-gradient-to-r from-[#FF6600] to-[#e55a00] hover:from-[#e55a00] hover:to-[#FF6600] text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md w-full"
            >
              <PhoneIcon className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="truncate text-sm sm:text-base">{safeVehicle.type === 'sale' ? 'Inquire' : 'Book'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>;
}