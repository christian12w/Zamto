// Diagnostic component to test API connectivity
import React, { useEffect, useState } from 'react';

const Diagnostic: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check the API URL from environment variables
    const url = import.meta.env.VITE_API_BASE_URL || 'Not set';
    setApiUrl(url);
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`);
      const data = await response.json();
      setTestResult({
        success: true,
        data,
        status: response.status
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px', margin: '10px' }}>
      <h2>API Diagnostic</h2>
      <p>API Base URL: {apiUrl}</p>
      <button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {testResult && (
        <div style={{ marginTop: '10px' }}>
          <h3>Test Result:</h3>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Diagnostic;