import React, { useState, useEffect } from 'react';
import { getVehicles } from '../utils/vehicleStorage';
import { resetVehicles, clearAllVehicles, getVehicleCount } from '../utils/resetVehicles';
import { diagnoseVehicles, repairVehicles } from '../utils/diagnoseVehicles';
import { useAuth } from '../contexts/AuthContext';

export function Debug() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [localStorageData, setLocalStorageData] = useState('');
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [repairResult, setRepairResult] = useState<any>(null);

  // Load vehicles
  const loadVehicles = () => {
    try {
      const vehiclesData = getVehicles();
      setVehicles(vehiclesData);
      setVehicleCount(vehiclesData.length);
      
      // Get raw localStorage data
      const rawData = localStorage.getItem('zamto_vehicles');
      setLocalStorageData(rawData || 'No data found');
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  // Reset to default vehicles
  const handleResetVehicles = () => {
    if (window.confirm('Are you sure you want to reset all vehicles to default data?')) {
      resetVehicles();
      loadVehicles();
    }
  };

  // Clear all vehicles
  const handleClearVehicles = () => {
    if (window.confirm('Are you sure you want to clear all vehicle data?')) {
      clearAllVehicles();
      loadVehicles();
    }
  };

  // Refresh data
  const handleRefresh = () => {
    loadVehicles();
  };

  // Diagnose vehicle storage
  const handleDiagnose = () => {
    const result = diagnoseVehicles();
    setDiagnosis(result);
  };

  // Repair vehicle storage
  const handleRepair = () => {
    const result = repairVehicles();
    setRepairResult(result);
    loadVehicles(); // Refresh after repair
  };

  useEffect(() => {
    loadVehicles();
    
    // Listen for vehicle updates
    const handleVehiclesUpdate = () => {
      setTimeout(loadVehicles, 100);
    };
    
    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    
    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
    };
  }, []);

  // If user is not authenticated or is not admin, redirect to login (handled by route protection)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">Debug Dashboard</h1>
            <p className="text-gray-600 mt-2">Vehicle inventory debugging tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Vehicle Count</h3>
            <p className="text-3xl font-bold text-[#003366]">{vehicleCount}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Storage Status</h3>
            <p className="text-lg font-bold text-green-600">Connected</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">User Role</h3>
            <p className="text-lg font-bold text-[#003366] capitalize">{user.role}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Debug Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
              >
                Refresh Data
              </button>
              <button
                onClick={handleDiagnose}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors"
              >
                Diagnose Storage
              </button>
              <button
                onClick={handleRepair}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-semibold transition-colors"
              >
                Repair Storage
              </button>
              <button
                onClick={handleResetVehicles}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-semibold transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleClearVehicles}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors"
              >
                Clear All Data
              </button>
            </div>
            
            {diagnosis && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">Diagnosis Results:</h3>
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(diagnosis, null, 2)}
                </pre>
              </div>
            )}
            
            {repairResult && (
              <div className="mt-4 p-4 bg-green-100 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">Repair Results:</h3>
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(repairResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Vehicle List</h2>
            </div>
            <div className="p-6">
              {vehicles.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-800">{vehicle.name}</h3>
                        <span className="text-sm text-gray-500">ID: {vehicle.id}</span>
                      </div>
                      <p className="text-sm text-gray-600">{vehicle.category} - {vehicle.type}</p>
                      <p className="text-sm text-gray-600">
                        {vehicle.type === 'sale' ? vehicle.price : vehicle.dailyRate}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No vehicles found</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Raw Data</h2>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-700 mb-2">LocalStorage Content:</h3>
              <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-x-auto max-h-96">
                {localStorageData || 'No data'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}