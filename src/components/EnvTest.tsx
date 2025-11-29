// Test environment variables
import React from 'react';

const EnvTest: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
      <h2>Environment Variable Test</h2>
      <p>API Base URL: {apiUrl || 'Not set'}</p>
      <p>Environment: {process.env.NODE_ENV || 'Unknown'}</p>
      <p>Production: {process.env.NODE_ENV === 'production' ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default EnvTest;