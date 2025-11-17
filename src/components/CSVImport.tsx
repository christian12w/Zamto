import React, { useState, useEffect } from 'react';
import { UploadIcon, XIcon } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { useAuth } from '../contexts/AuthContext';

interface CSVImportProps {
  onClose: () => void;
  onImportSuccess: () => void;
}

export function CSVImport({ onClose, onImportSuccess }: CSVImportProps) {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; imported?: number } | null>(null);

  // Debug the token
  useEffect(() => {
    console.log('CSVImport: Token updated:', token);
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setUploadResult({
          success: false,
          message: 'Please select a CSV file'
        });
        return;
      }
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadResult({
          success: false,
          message: 'File size exceeds 10MB limit'
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    // Parse headers
    const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
    
    // Parse rows
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim().replace(/^"|"$/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        result.push(row);
      }
    }
    
    return result;
  };

  const convertToVehicleFormat = (csvData: any[]): any[] => {
    return csvData.map(row => ({
      name: row.name || '',
      category: row.category || 'SUV',
      price: row.price || '',
      dailyRate: row.dailyRate || '',
      image: row.image || '',
      images: row.images ? (() => {
        try {
          return JSON.parse(row.images);
        } catch {
          // If JSON parsing fails, treat as comma-separated URLs
          return row.images.split(',').map((url: string) => ({
            url: url.trim(),
            label: 'exterior'
          }));
        }
      })() : [],
      description: row.description || '',
      features: row.features ? row.features.split(',').map((f: string) => f.trim()) : [],
      popular: row.popular === 'true' || row.popular === '1' || false,
      year: row.year ? parseInt(row.year, 10) : undefined,
      mileage: row.mileage || '',
      transmission: row.transmission || 'Automatic',
      fuelType: row.fuelType || 'Petrol',
      type: row.type || 'sale',
      engineSize: row.engineSize || '',
      doors: row.doors ? parseInt(row.doors, 10) : undefined,
      seats: row.seats ? parseInt(row.seats, 10) : undefined,
      color: row.color || '',
      condition: row.condition || 'Good',
      serviceHistory: row.serviceHistory || '',
      accidentHistory: row.accidentHistory || '',
      warranty: row.warranty || '',
      registrationStatus: row.registrationStatus || '',
      insuranceStatus: row.insuranceStatus || ''
    }));
  };

  const handleImport = async () => {
    if (!file) {
      setUploadResult({
        success: false,
        message: 'Please select a CSV file to import'
      });
      return;
    }

    console.log('Token before import:', token);
    if (!token) {
      setUploadResult({
        success: false,
        message: 'Authentication required. Please log in again.'
      });
      return;
    }

    // Check if token is a valid string
    if (typeof token !== 'string' || token.length === 0) {
      setUploadResult({
        success: false,
        message: 'Invalid authentication token. Please log in again.'
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      // Read the CSV file
      const text = await file.text();
      console.log('CSV text:', text);
      
      // Parse CSV data
      const csvData = parseCSV(text);
      console.log('Parsed CSV data:', csvData);
      
      if (csvData.length === 0) {
        throw new Error('CSV file is empty or invalid');
      }
      
      // Convert to proper vehicle format
      const vehiclesData = convertToVehicleFormat(csvData);
      console.log('Converted vehicles data:', vehiclesData);
      
      if (vehiclesData.length === 0) {
        throw new Error('No valid vehicles found in CSV file');
      }
      
      // Check if vehiclesData is actually an array
      if (!Array.isArray(vehiclesData)) {
        throw new Error('Vehicles data is not an array');
      }
      
      // Check if vehiclesData has valid objects
      if (vehiclesData.some(vehicle => typeof vehicle !== 'object' || vehicle === null)) {
        throw new Error('Vehicles data contains invalid objects');
      }
      
      console.log('Sending vehicles data to API:', vehiclesData);
      console.log('Using token:', token);
      
      // Import vehicles via API
      const response = await vehicleService.importVehicles(vehiclesData, token);
      
      console.log('API response:', response);
      
      if (response.success) {
        setUploadResult({
          success: true,
          message: response.message || 'Vehicles imported successfully',
          imported: response.imported
        });
        
        // Notify parent component of success
        setTimeout(() => {
          onImportSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to import vehicles');
      }
    } catch (error: any) {
      console.error('Import error:', error);
      setUploadResult({
        success: false,
        message: 'Failed to import vehicles: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#003366]">
            Import Vehicles from CSV
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">CSV Import Instructions</h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>CSV file should contain vehicle information with headers</li>
              <li>Required columns: name, category, price, description</li>
              <li>Supported categories: SUV, SMALL CARS, GROUPS & FAMILY CARS, PICKUP TRUCKS</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{file.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={isUploading}
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <button
                  onClick={handleImport}
                  disabled={isUploading}
                  className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Importing...' : 'Import Vehicles'}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                <label className="cursor-pointer bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Select CSV File
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>
          
          {uploadResult && (
            <div className={`p-4 rounded-lg ${uploadResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-medium">{uploadResult.message}</p>
              {uploadResult.imported !== undefined && (
                <p className="mt-1">Successfully imported {uploadResult.imported} vehicles.</p>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}