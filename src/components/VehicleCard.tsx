import React, { useState } from 'react';
import { CheckCircleIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
import { Vehicle } from '../utils/vehicleStorage';
interface VehicleCardProps {
  vehicle: Vehicle;
}
export function VehicleCard({
  vehicle
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
  return <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF6600]">
      {vehicle.popular && <div className="bg-gradient-to-r from-[#FF6600] to-[#e55a00] text-white text-sm font-bold px-4 py-2 flex items-center">
          <SparklesIcon className="h-4 w-4 mr-2" />
          POPULAR CHOICE
        </div>}
      <div className="h-56 overflow-hidden relative group">
        <img src={images[currentImageIndex].url} alt={`${vehicle.name} - ${images[currentImageIndex].label}`} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
        {images.length > 1 && <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {images.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`transition-all ${index === currentImageIndex ? 'bg-white w-6 h-2' : 'bg-white bg-opacity-50 w-2 h-2'} rounded-full`} />)}
            </div>
            <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
              {images[currentImageIndex].label.charAt(0).toUpperCase() + images[currentImageIndex].label.slice(1)}
            </div>
          </>}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-[#003366]">{vehicle.name}</h3>
          <span className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full font-semibold">
            {vehicle.category}
          </span>
        </div>
        <p className="text-gray-600 mb-5 line-clamp-2">{vehicle.description}</p>
        <ul className="space-y-2.5 mb-5">
          {vehicle.features.map((feature, index) => <li key={index} className="flex items-center text-sm text-gray-700">
              <CheckCircleIcon className="h-5 w-5 text-[#228B22] mr-2 flex-shrink-0" />
              {feature}
            </li>)}
        </ul>
        <div className="border-t-2 border-gray-100 pt-5 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500 block">Starting at</span>
            <span className="text-2xl font-bold text-[#003366]">
              {vehicle.price}
            </span>
          </div>
          <a href="/contact" className="flex items-center bg-gradient-to-r from-[#FF6600] to-[#e55a00] hover:from-[#e55a00] hover:to-[#FF6600] text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md">
            <PhoneIcon className="h-5 w-5 mr-2" />
            Inquire
          </a>
        </div>
      </div>
    </div>;
}