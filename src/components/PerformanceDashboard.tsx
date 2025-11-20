// Performance dashboard to display vehicle data load times and statistics
import React, { useState, useEffect } from 'react';
import { VehicleDataStorage } from '../utils/vehicleDataStorage';

interface LoadStatistics {
  average: number;
  minimum: number;
  maximum: number;
  samples: number;
}

export function PerformanceDashboard() {
  const [loadStats, setLoadStats] = useState<LoadStatistics | null>(null);
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Update statistics periodically
    const interval = setInterval(() => {
      const stats = VehicleDataStorage.getLoadStatistics();
      setLoadStats(stats);
      setVehiclesCount(VehicleDataStorage.getVehicles().length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExportData = () => {
    const jsonData = VehicleDataStorage.exportAsJson();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicles-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const success = VehicleDataStorage.importFromJson(content);
        if (success) {
          alert('Data imported successfully!');
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all vehicle data?')) {
      VehicleDataStorage.clearData();
    }
  };

  const handleTestLoad = async () => {
    setIsRecording(true);
    VehicleDataStorage.startLoadTimer();
    
    // Simulate a load operation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    const loadTime = VehicleDataStorage.endLoadTimer();
    
    // Add a test vehicle with the load time
    VehicleDataStorage.addVehicle({
      name: `Test Vehicle ${Date.now()}`,
      category: 'SUV',
      price: 'ZMW 300,000',
      description: 'Test vehicle for performance monitoring',
      features: ['Performance Test'],
      type: 'sale',
      popular: false,
      images: [{
        url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
        label: 'exterior'
      }]
    });
    
    setIsRecording(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">Performance Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Vehicles</h3>
          <p className="text-3xl font-bold text-[#003366]">{vehiclesCount}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Avg Load Time</h3>
          <p className="text-3xl font-bold text-[#003366]">
            {loadStats ? `${loadStats.average.toFixed(2)}ms` : 'N/A'}
          </p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Last Load Time</h3>
          <p className="text-3xl font-bold text-[#003366]">
            {loadStats ? `${loadStats.maximum.toFixed(2)}ms` : 'N/A'}
          </p>
        </div>
      </div>
      
      {loadStats && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Load Time Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Average</p>
              <p className="font-semibold">{loadStats.average.toFixed(2)}ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Minimum</p>
              <p className="font-semibold">{loadStats.minimum.toFixed(2)}ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Maximum</p>
              <p className="font-semibold">{loadStats.maximum.toFixed(2)}ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Samples</p>
              <p className="font-semibold">{loadStats.samples}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleTestLoad}
          disabled={isRecording}
          className="px-4 py-2 bg-[#003366] text-white rounded-md hover:bg-[#004080] disabled:opacity-50"
        >
          {isRecording ? 'Recording...' : 'Test Load Time'}
        </button>
        
        <button
          onClick={handleExportData}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Export Data
        </button>
        
        <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
        </label>
        
        <button
          onClick={handleClearData}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Clear Data
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>This dashboard tracks vehicle data load times and allows you to export/import data as JSON files.</p>
        <p>You can commit these files to GitHub for persistent storage.</p>
      </div>
    </div>
  );
}