import React, { useState, useEffect } from 'react';
import { getVehicles, getVehicleCacheInfo, clearVehicleCache } from '../utils/vehicleStorage';
import { Vehicle } from '../utils/vehicleStorage';

export function CacheDiagnostic() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiagnosticInfo();
  }, []);

  const loadDiagnosticInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get vehicles
      const vehicleData = await getVehicles();
      setVehicles(vehicleData);
      
      // Get cache info
      const info = getVehicleCacheInfo();
      setCacheInfo(info);
    } catch (err) {
      setError('Failed to load diagnostic information: ' + (err as Error).message);
      console.error('Diagnostic error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    clearVehicleCache();
    loadDiagnosticInfo();
    alert('Vehicle cache cleared!');
  };

  const formatCacheAge = (age: number) => {
    if (age < 1000) return `${age}ms`;
    if (age < 60000) return `${(age / 1000).toFixed(1)}s`;
    return `${(age / 60000).toFixed(1)}min`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#003366] mb-6">Cache Diagnostic</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cache Information</h2>
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366]"></div>
          ) : cacheInfo ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Cached:</span>
                <span className={cacheInfo.isCached ? 'text-green-600' : 'text-red-600'}>
                  {cacheInfo.isCached ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cache Age:</span>
                <span>{formatCacheAge(cacheInfo.cacheAge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cache Size:</span>
                <span>{cacheInfo.cacheSize} vehicles</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cache Duration:</span>
                <span>{formatCacheAge(cacheInfo.cacheDuration)}</span>
              </div>
            </div>
          ) : (
            <p>No cache information available</p>
          )}
          <button
            onClick={handleClearCache}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            Clear Vehicle Cache
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Vehicle Data</h2>
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366]"></div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Vehicles:</span>
                <span>{vehicles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">For Sale:</span>
                <span>{vehicles.filter(v => v.type === 'sale').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">For Hire:</span>
                <span>{vehicles.filter(v => v.type === 'hire').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Popular:</span>
                <span>{vehicles.filter(v => v.popular).length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Vehicle List</h2>
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366]"></div>
        ) : vehicles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popular</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{vehicle.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {vehicle.status || 'available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.popular ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No vehicles found</p>
        )}
      </div>
      
      <div className="mt-6 flex gap-4">
        <button
          onClick={loadDiagnosticInfo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-colors"
        >
          Refresh Data
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}