import React, { useState } from 'react';
import { testVehicleStorage } from '../utils/testVehicleStorage';
import { useAuth } from '../contexts/AuthContext';

export function Test() {
  const { user } = useAuth();
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Override console.log to capture output
  const runTest = () => {
    setIsRunning(true);
    setTestOutput([]);
    
    // Capture console.log output
    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      logs.push(message);
      setTestOutput(prev => [...prev, message]);
      originalLog.apply(console, args);
    };
    
    try {
      testVehicleStorage();
    } catch (error) {
      console.error('Test failed with error:', error);
      logs.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setTestOutput(logs);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  // If user is not authenticated or is not admin, redirect to login (handled by route protection)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">Vehicle Storage Test</h1>
            <p className="text-gray-600 mt-2">Test the vehicle storage functionality</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Run Test</h2>
          </div>
          <div className="p-6">
            <button
              onClick={runTest}
              disabled={isRunning}
              className="px-6 py-3 bg-[#FF6600] hover:bg-[#e55a00] text-white rounded-md font-semibold transition-colors disabled:opacity-50"
            >
              {isRunning ? 'Running Test...' : 'Run Vehicle Storage Test'}
            </button>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Test Output:</h3>
              <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
                {testOutput.length > 0 ? (
                  <pre className="text-sm whitespace-pre-wrap">
                    {testOutput.join('\n')}
                  </pre>
                ) : (
                  <p className="text-gray-500">Click "Run Vehicle Storage Test" to see output</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;