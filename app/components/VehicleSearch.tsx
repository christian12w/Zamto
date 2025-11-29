'use client'

import { useState, useEffect } from 'react'
import { Search, Car, Filter, X, Tag, Clock } from 'lucide-react'
import Link from 'next/link'

interface Vehicle {
  slug: string
  name: string
  category?: string
  price?: string
  dailyRate?: string
  image?: string
  type?: 'sale' | 'hire'
  year?: number | null
  transmission?: string
  fuelType?: string
  availability?: string
}

interface SearchFilters {
  query: string
  category: string
  type: string
  minPrice: string
  maxPrice: string
  transmission: string
}

export default function VehicleSearch({ vehicles }: { vehicles: Vehicle[] }) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    transmission: ''
  })
  
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles)
  const [showFilters, setShowFilters] = useState(false)
  
  // Get unique categories and transmissions for filter options
  const categories = Array.from(new Set(vehicles.map(v => v.category).filter(Boolean))) as string[]
  const transmissions = Array.from(new Set(vehicles.map(v => v.transmission).filter(Boolean))) as string[]
  
  // Filter vehicles based on search criteria
  useEffect(() => {
    const filtered = vehicles.filter(vehicle => {
      // Text search
      if (filters.query && !vehicle.name.toLowerCase().includes(filters.query.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (filters.category && vehicle.category !== filters.category) {
        return false
      }
      
      // Type filter
      if (filters.type && vehicle.type !== filters.type) {
        return false
      }
      
      // Transmission filter
      if (filters.transmission && vehicle.transmission !== filters.transmission) {
        return false
      }
      
      // Price filtering would require parsing price strings
      // For simplicity, we'll skip detailed price filtering in this implementation
      
      return true
    })
    
    setFilteredVehicles(filtered)
  }, [filters, vehicles])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      transmission: ''
    })
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            name="query"
            placeholder="Search by vehicle name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
            value={filters.query}
            onChange={handleInputChange}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>
      
      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#003366]">Advanced Filters</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-[#FF6B35] hover:text-[#e05a2a] font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                value={filters.category}
                onChange={handleInputChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                value={filters.type}
                onChange={handleInputChange}
              >
                <option value="">All Types</option>
                <option value="sale">For Sale</option>
                <option value="hire">For Hire</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select
                name="transmission"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                value={filters.transmission}
                onChange={handleInputChange}
              >
                <option value="">All Transmissions</option>
                {transmissions.map(transmission => (
                  <option key={transmission} value={transmission}>{transmission}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e05a2a] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#003366]">
          {filteredVehicles.length} Vehicle{filteredVehicles.length !== 1 ? 's' : ''} Found
        </h2>
      </div>
      
      {/* Results Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.slice(0, 6).map((vehicle) => (
            <div key={vehicle.slug} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {vehicle.image ? (
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-[#003366]">{vehicle.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    vehicle.type === 'sale' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {vehicle.type === 'sale' ? 'FOR SALE' : 'FOR HIRE'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{vehicle.category}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex h-2 w-2 mr-2">
                      <span className={`animate-ping absolute h-2 w-2 rounded-full ${
                        vehicle.availability === 'Available' ? 'bg-green-400' : 'bg-red-400'
                      } opacity-75`}></span>
                      <span className={`relative h-2 w-2 rounded-full ${
                        vehicle.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                    </span>
                    <span>{vehicle.availability || 'Available'}</span>
                  </div>
                  {vehicle.year && (
                    <span className="text-sm text-gray-500">Year: {vehicle.year}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {vehicle.transmission && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {vehicle.transmission}
                      </span>
                    )}
                    {vehicle.fuelType && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {vehicle.fuelType}
                      </span>
                    )}
                  </div>
                  <Link 
                    href={`/vehicles/${vehicle.slug}`}
                    className="px-4 py-2 bg-[#003366] text-white text-sm rounded-lg hover:bg-[#002244] transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No vehicles found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
      
      {/* View All Button */}
      {filteredVehicles.length > 0 && (
        <div className="text-center mt-8">
          <Link 
            href="/vehicles"
            className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-bold rounded-lg hover:bg-[#e05a2a] transition-colors"
          >
            View All Vehicles
          </Link>
        </div>
      )}
    </div>
  )
}