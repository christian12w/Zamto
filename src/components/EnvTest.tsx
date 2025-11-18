// Test environment variables
import React from 'react';

const EnvTest: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
      <h2>Environment Variable Test</h2>
      <p>API Base URL: {apiUrl || 'Not set'}</p>
      <p>Environment: {import.meta.env.MODE || 'Unknown'}</p>
      <p>Production: {import.meta.env.PROD ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default EnvTest;