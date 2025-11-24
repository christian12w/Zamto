import React, { useEffect, useState } from 'react';
import { getVehicles } from '../utils/vehicleStorage';

export function VehicleDebug() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehicleData = await getVehicles();
        setVehicles(vehicleData);
        console.log('Vehicles loaded:', vehicleData);
      } catch (err) {
        console.error('Error loading vehicles:', err);
        setError('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">Loading vehicles...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 border border-red-400 rounded">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold mb-4">Vehicle Debug Information</h2>
      <p>Total vehicles: {vehicles.length}</p>
      {vehicles.length > 0 ? (
        <div className="mt-4">
          <h3 className="font-bold">First vehicle:</h3>
          <pre className="bg-white p-4 rounded overflow-auto text-sm">
            {JSON.stringify(vehicles[0], null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-red-500">No vehicles found. This might be why they're not displaying.</p>
      )}
    </div>
  );
}