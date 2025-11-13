import React, { useEffect, useState } from 'react';
import { getVehicles, Vehicle } from '../utils/vehicleStorage';

export function TestCategories() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  useEffect(() => {
    setVehicles(getVehicles());
  }, []);
  
  // Group vehicles by category
  const vehiclesByCategory: Record<string, Vehicle[]> = {};
  vehicles.forEach(vehicle => {
    if (!vehiclesByCategory[vehicle.category]) {
      vehiclesByCategory[vehicle.category] = [];
    }
    vehiclesByCategory[vehicle.category].push(vehicle);
  });
  
  // Test the specific category
  const familyCarsCategory = 'GROUPS & FAMILY CARS';
  const familyCarsVehicles = vehicles.filter(v => v.category === familyCarsCategory);
  const familyCarsVehicles2 = vehicles.filter(v => v.category.includes('FAMILY'));
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vehicle Categories Test</h1>
      <div className="mb-4">
        <p>Total vehicles: {vehicles.length}</p>
      </div>
      
      <div className="mb-6 p-4 border rounded bg-yellow-50">
        <h2 className="text-xl font-semibold mb-2">Category String Analysis</h2>
        <p>Looking for exact category: "{familyCarsCategory}"</p>
        <p>Length: {familyCarsCategory.length}</p>
        <p>Char codes: [{familyCarsCategory.split('').map(c => c.charCodeAt(0)).join(', ')}]</p>
        <p>Found {familyCarsVehicles.length} vehicles with exact match</p>
        <p>Found {familyCarsVehicles2.length} vehicles with "FAMILY" in category</p>
      </div>
      
      {Object.entries(vehiclesByCategory).map(([category, categoryVehicles]) => (
        <div key={category} className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">
            Category: "{category}" ({categoryVehicles.length} vehicles)
          </h2>
          <div className="mb-2 text-sm">
            <p>Length: {category.length}</p>
            <p>Char codes: [{category.split('').map(c => c.charCodeAt(0)).join(', ')}]</p>
            <p>Matches target: {category === familyCarsCategory ? 'YES' : 'NO'}</p>
          </div>
          <ul className="list-disc pl-5">
            {categoryVehicles.map(vehicle => (
              <li key={vehicle.id}>
                {vehicle.name} ({vehicle.type})
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <div className="mt-8 p-4 border rounded bg-blue-50">
        <h2 className="text-xl font-semibold mb-2">Test Specific Category Filtering</h2>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Testing "GROUPS & FAMILY CARS" filter:</h3>
          <p>{familyCarsVehicles.length} vehicles found with exact match</p>
          {familyCarsVehicles.map(vehicle => (
            <div key={vehicle.id} className="ml-4">
              - {vehicle.name} ({vehicle.type})
            </div>
          ))}
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Testing vehicles with "FAMILY" in category:</h3>
          <p>{familyCarsVehicles2.length} vehicles found with "FAMILY" in category</p>
          {familyCarsVehicles2.map(vehicle => (
            <div key={vehicle.id} className="ml-4">
              - {vehicle.name} ({vehicle.type}) - Category: "{vehicle.category}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}