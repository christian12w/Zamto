import React, { useState } from 'react';
import { CheckCircleIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, TagIcon, ClockIcon, EyeIcon, MessageCircleIcon } from 'lucide-react';
import { Vehicle } from '../utils/vehicleStorage';

interface VehicleCardProps {
  vehicle: Vehicle;
  onShowDetails: (vehicle: Vehicle) => void;
}

export function VehicleCard({
  vehicle,
  onShowDetails
}: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [{
    url: vehicle.image,
    label: 'exterior' as const
  }];
  
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
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
      {vehicle.popular && <div className="bg-gradient-to-r from-[#FF6600] to-[#e55a00] text-white text-sm font-bold px-4 py-2 flex items-center">
          <SparklesIcon className="h-4 w-4 mr-2" />
          POPULAR CHOICE
        </div>}
      
      {/* Type indicator */}
      <div className={`flex items-center px-4 py-2 ${vehicle.type === 'sale' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
        {vehicle.type === 'sale' ? (
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
      
      <div className="h-56 sm:h-64 overflow-hidden relative group flex-grow">
        <img 
          src={images[currentImageIndex].url} 
          alt={`${vehicle.name} - ${images[currentImageIndex].label}`} 
          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
        />
        {images.length > 1 && <>
            <button 
              onClick={prevImage} 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-1.5">
              {images.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentImageIndex(index)} 
                  className={`transition-all ${index === currentImageIndex ? 'bg-white w-4 h-1.5 sm:w-6 sm:h-2' : 'bg-white bg-opacity-50 w-1.5 h-1.5 sm:w-2 sm:h-2'} rounded-full`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
            <div className="absolute top-2 sm:top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium backdrop-blur-sm">
              {images[currentImageIndex].label.charAt(0).toUpperCase() + images[currentImageIndex].label.slice(1)}
            </div>
          </>}
      </div>
      
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#003366]">{vehicle.name}</h3>
          <span className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold whitespace-nowrap">
            {vehicle.category}
          </span>
        </div>
        <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2 flex-grow">{vehicle.description}</p>
        <ul className="space-y-2 mb-4">
          {vehicle.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
              <CheckCircleIcon className="h-4 w-4 text-[#228B22] mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {/* Display price or daily rate based on vehicle type */}
          {vehicle.type === 'sale' ? (
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-xs text-gray-500 block">Price</span>
                <span className="text-lg sm:text-xl font-bold text-[#003366]">
                  {vehicle.price}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-xs text-gray-500 block">Daily Rate</span>
                <span className="text-lg sm:text-xl font-bold text-[#003366]">
                  {vehicle.dailyRate || 'Contact for rates'}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button 
              onClick={() => onShowDetails(vehicle)}
              className="flex items-center justify-center bg-gradient-to-r from-[#003366] to-[#004080] hover:from-[#004080] hover:to-[#003366] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md w-full text-sm sm:text-base"
            >
              <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              View Details
            </button>
            
            {/* WhatsApp button */}
            <a 
              href={`https://wa.me/${vehicle.whatsappContact?.replace(/\D/g, '') || '260572213038'}?text=Hello,%20I'm%20interested%20in%20the%20${encodeURIComponent(vehicle.name)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md w-full text-sm sm:text-base"
            >
              <MessageCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              WhatsApp
            </a>
            
            <a 
              href="/contact" 
              className="flex items-center justify-center bg-gradient-to-r from-[#FF6600] to-[#e55a00] hover:from-[#e55a00] hover:to-[#FF6600] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md w-full text-sm sm:text-base"
            >
              <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {vehicle.type === 'sale' ? 'Inquire' : 'Book'}
            </a>
          </div>
        </div>
      </div>
    </div>;
}