import React, { useState, useEffect } from 'react';
import { XIcon, UploadIcon, TrashIcon } from 'lucide-react';
import { addVehicle, updateVehicle, Vehicle, VehicleImage } from '../utils/vehicleStorage';

interface AdminVehicleFormProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export function AdminVehicleForm({
  vehicle,
  onClose
}: AdminVehicleFormProps) {
  const [formData, setFormData] = useState({
    name: vehicle?.name || '',
    category: vehicle?.category || 'SUV',
    price: vehicle?.price || '',
    dailyRate: vehicle?.dailyRate || '',
    description: vehicle?.description || '',
    features: vehicle?.features?.join(', ') || '',
    popular: vehicle?.popular || false,
    year: vehicle?.year || new Date().getFullYear(),
    mileage: vehicle?.mileage || '',
    transmission: vehicle?.transmission || 'Automatic',
    fuelType: vehicle?.fuelType || 'Petrol',
    type: vehicle?.type || 'sale',
    engineSize: vehicle?.engineSize || '',
    doors: vehicle?.doors || 4,
    seats: vehicle?.seats || 5,
    color: vehicle?.color || '',
    condition: vehicle?.condition || 'Good',
    serviceHistory: vehicle?.serviceHistory || '',
    accidentHistory: vehicle?.accidentHistory || '',
    warranty: vehicle?.warranty || '',
    registrationStatus: vehicle?.registrationStatus || '',
    insuranceStatus: vehicle?.insuranceStatus || ''
  });
  
  const [images, setImages] = useState<VehicleImage[]>(vehicle?.images && vehicle.images.length > 0 ? vehicle.images : []);
  const imageLabels: Array<'exterior' | 'interior' | 'front' | 'back' | 'additional'> = ['exterior', 'interior', 'front', 'back', 'additional'];
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  
  // Initialize images from vehicle prop when it changes
  useEffect(() => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setImages(vehicle.images);
    } else if (vehicle?.image) {
      // For backward compatibility with old vehicles that only have a single image
      setImages([{
        url: vehicle.image,
        label: 'exterior'
      }]);
    }
    
    // Initialize form data when vehicle prop changes
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        category: vehicle.category || 'SUV',
        price: vehicle.price || '',
        dailyRate: vehicle.dailyRate || '',
        description: vehicle.description || '',
        features: vehicle.features?.join(', ') || '',
        popular: vehicle.popular || false,
        year: vehicle.year || new Date().getFullYear(),
        mileage: vehicle.mileage || '',
        transmission: vehicle.transmission || 'Automatic',
        fuelType: vehicle.fuelType || 'Petrol',
        type: vehicle.type || 'sale',
        engineSize: vehicle.engineSize || '',
        doors: vehicle.doors || 4,
        seats: vehicle.seats || 5,
        color: vehicle.color || '',
        condition: vehicle.condition || 'Good',
        serviceHistory: vehicle.serviceHistory || '',
        accidentHistory: vehicle.accidentHistory || '',
        warranty: vehicle.warranty || '',
        registrationStatus: vehicle.registrationStatus || '',
        insuranceStatus: vehicle.insuranceStatus || ''
      });
    }
  }, [vehicle]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, label: (typeof imageLabels)[number]) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear previous error for this label
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[label];
      return newErrors;
    });
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadErrors(prev => ({
        ...prev,
        [label]: 'File size exceeds 10MB limit'
      }));
      return;
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onloadstart = () => {
      // Show loading state if needed
    };
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove existing image with same label if any
      const filteredImages = images.filter(img => img.label !== label);
      setImages([...filteredImages, {
        url: base64String,
        label
      }]);
    };
    
    reader.onerror = () => {
      setUploadErrors(prev => ({
        ...prev,
        [label]: 'Failed to read file'
      }));
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = (label: (typeof imageLabels)[number]) => {
    setImages(images.filter(img => img.label !== label));
    // Clear error for this label if it exists
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[label];
      return newErrors;
    });
  };

  const getImageForLabel = (label: (typeof imageLabels)[number]) => {
    return images.find(img => img.label === label);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow submission even if no images are uploaded
    // But show a warning if no images
    if (images.length === 0) {
      const confirmSubmit = window.confirm('You have not uploaded any images. Are you sure you want to submit without images?');
      if (!confirmSubmit) {
        return;
      }
    }
    
    const vehicleData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0),
      images: images,
      image: images[0]?.url || '' // Set main image as first image for backward compatibility
    };
    
    try {
      let success = false;
      if (vehicle) {
        success = await updateVehicle(vehicle.id, vehicleData);
      } else {
        const newVehicle = await addVehicle(vehicleData);
        success = newVehicle !== null;
      }
      
      if (success) {
        onClose();
      } else {
        alert('Failed to save vehicle. Please try again.');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('An error occurred while saving the vehicle. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#003366]">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vehicle Photos (Upload at least one photo)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageLabels.map(label => {
              const existingImage = getImageForLabel(label);
              const error = uploadErrors[label];
              return <div key={label} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {label} View
                    </label>
                    {error && (
                      <div className="text-red-500 text-xs mb-2">{error}</div>
                    )}
                    {existingImage ? <div className="relative">
                        <img src={existingImage.url} alt={label} className="w-full h-32 object-cover rounded" />
                        <button type="button" onClick={() => removeImage(label)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div> : <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 rounded">
                        <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Click to upload
                        </span>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, label)} className="hidden" />
                      </label>}
                  </div>;
            })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload photos showing exterior, interior, front view, back view,
              and an additional angle. Images up to 10MB are accepted.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Name
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., Toyota Land Cruiser" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type *
              </label>
              <select name="type" required value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent">
                <option value="sale">For Sale</option>
                <option value="hire">For Hire</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent">
                <option value="SUV">SUV</option>
                <option value="SMALL CARS">Small Cars</option>
                <option value="GROUPS & FAMILY CARS">
                  Groups & Family Cars
                </option>
                <option value="PICKUP TRUCKS">Pickup Trucks</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'sale' ? 'Price' : 'Price'}
              </label>
              <input type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., ZMW 450,000" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'hire' ? 'Daily Rate' : 'Daily Rate'}
              </label>
              <input type="text" name="dailyRate" value={formData.dailyRate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., ZMW 500/day" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., 2018" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage
              </label>
              <input type="text" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., 85,000 km" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission
              </label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engine Size
              </label>
              <input type="text" name="engineSize" value={formData.engineSize} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., 2.0L, 3.5L V6" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Doors
              </label>
              <input type="number" name="doors" value={formData.doors} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., 4" min="2" max="5" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seating Capacity
              </label>
              <input type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., 5" min="2" max="8" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., White, Silver" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent">
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange} className="rounded border-gray-300 text-[#FF6600] focus:ring-[#FF6600]" />
                <span className="text-sm font-medium text-gray-700">
                  Mark as Popular
                </span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="Brief description of the vehicle" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (comma-separated)
            </label>
            <input type="text" name="features" value={formData.features} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., 4WD, 7-seater, Leather interior, Sunroof" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service History
              </label>
              <textarea name="serviceHistory" rows={3} value={formData.serviceHistory} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="Details about service history" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accident History
              </label>
              <textarea name="accidentHistory" rows={3} value={formData.accidentHistory} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="Details about accident history (if any)" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Information
              </label>
              <input type="text" name="warranty" value={formData.warranty} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., 12 months, 20,000 km" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Status
              </label>
              <input type="text" name="registrationStatus" value={formData.registrationStatus} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., Valid until 2026" />
            </div>
            
            {formData.type === 'hire' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Status
                </label>
                <input type="text" name="insuranceStatus" value={formData.insuranceStatus} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="e.g., Comprehensive, Valid until 2025" />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-[#FF6600] hover:bg-[#e55a00] text-white rounded-md font-semibold transition-colors">
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>;
}