// Frontend API Test Component
import React, { useEffect, useState } from 'react';

const APITest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [vehiclesStatus, setVehiclesStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        
        // Test health endpoint
        const healthResponse = await fetch('https://zamto-1.onrender.com/api/health');
        const healthData = await healthResponse.json();
        setHealthStatus(healthData);
        
        // Test vehicles endpoint
        const vehiclesResponse = await fetch('https://zamto-1.onrender.com/api/vehicles');
        const vehiclesData = await vehiclesResponse.json();
        setVehiclesStatus(vehiclesData);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Testing API connectivity...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
      <h2>API Test Results</h2>
      
      <h3>Health Check:</h3>
      <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
      
      <h3>Vehicles Data:</h3>
      <pre>{JSON.stringify(vehiclesStatus, null, 2)}</pre>
    </div>
  );
};

export default APITest;