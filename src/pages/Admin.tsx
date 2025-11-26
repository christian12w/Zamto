import { useState, useEffect, useCallback } from 'react';
import { AdminVehicleForm } from '../components/AdminVehicleForm';
import { VehicleCard } from '../components/VehicleCard';
import { UserManagement } from '../components/UserManagement';
import { CSVImport } from '../components/CSVImport';
import { PerformanceDashboard } from '../components/PerformanceDashboard';
import { getVehicles, refreshVehicles, deleteVehicle, Vehicle, clearVehicleCache, updateVehicleStatus } from '../utils/vehicleStorage';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, EyeIcon, EditIcon, TrashIcon, UserIcon, LogOutIcon, UploadIcon, BarChartIcon, X, ShoppingCartIcon, CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Admin() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load vehicles with useCallback for performance
  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      // Use refreshVehicles to bypass cache and get fresh data
      const freshVehicles = await refreshVehicles();
      setVehicles(freshVehicles);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
    
    // Listen for vehicle updates
    const handleVehiclesUpdate = () => {
      // Debounce the update to prevent excessive re-renders
      setTimeout(() => {
        loadVehicles();
      }, 100);
    };
    
    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    window.addEventListener('storage', handleVehiclesUpdate);
    
    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
      window.removeEventListener('storage', handleVehiclesUpdate);
    };
  }, [loadVehicles]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id);
      loadVehicles();
    }
  };

  const handleStatusChange = async (id: string, status: 'available' | 'sold') => {
    if (window.confirm(`Are you sure you want to mark this vehicle as ${status}?`)) {
      await updateVehicleStatus(id, status);
      loadVehicles();
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehicle(null);
    // Clear vehicle cache and reload vehicles to reflect any changes
    clearVehicleCache();
    loadVehicles();
  };

  const handleUserManagementClose = () => {
    setShowUserManagement(false);
    // Refresh users list
    loadVehicles();
  };

  const handleCSVImportClose = () => {
    setShowCSVImport(false);
    // Refresh vehicle list after CSV import
    clearVehicleCache();
    loadVehicles();
  };

  const handleImportSuccess = () => {
    // Refresh vehicle list after successful import
    clearVehicleCache();
    loadVehicles();
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If user is not authenticated, redirect to login (handled by route protection)
  if (!user) {
    return null; // This should never happen as the route should protect this
  }

  return <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with user info and logout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user.username}!</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                // Import the createTestVehicle function
                import('../utils/vehicleStorage').then(module => {
                  module.createTestVehicle();
                });
              }}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Test Vehicle
            </button>
            <button 
              onClick={() => {
                // Import the VehicleDataStorage and create sample vehicles
                import('../utils/vehicleDataStorage').then(module => {
                  const { VehicleDataStorage } = module;
                  
                  // Create sample vehicles
                  VehicleDataStorage.addVehicle({
                    name: 'Toyota Land Cruiser Prado',
                    category: 'SUV',
                    price: 'ZMW 450,000',
                    description: 'Premium SUV perfect for Zambian terrain. Powerful, reliable, and luxurious.',
                    features: ['4WD', '7-seater', 'Leather interior', 'Sunroof'],
                    type: 'sale',
                    popular: true,
                    images: [{
                      url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
                      label: 'exterior'
                    }]
                  });
                  
                  VehicleDataStorage.addVehicle({
                    name: 'Ford Ranger Wildtrak',
                    category: 'PICKUP TRUCKS',
                    dailyRate: 'ZMW 750/day',
                    description: 'Robust pickup truck ideal for work and adventure.',
                    features: ['4WD', 'Payload capacity 1,000kg', 'Towing capacity 3,500kg'],
                    type: 'hire',
                    popular: true,
                    images: [{
                      url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
                      label: 'exterior'
                    }]
                  });
                  
                  alert('Sample vehicles added to JSON storage!');
                });
              }}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Sample Vehicles
            </button>
            <button 
              onClick={() => {
                // Import the clearTestVehicles function
                import('../utils/vehicleStorage').then(module => {
                  module.clearTestVehicles();
                  // Refresh the vehicle list
                  loadVehicles();
                });
              }}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear Test Vehicles
            </button>
            <button 
              onClick={() => setShowCSVImport(true)} 
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              <UploadIcon className="h-5 w-5 mr-2" />
              Import CSV
            </button>
            <button 
              onClick={() => setShowForm(true)} 
              className="flex items-center bg-[#FF6600] hover:bg-[#e55a00] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Vehicle
            </button>
            <button 
              onClick={() => {
                // More comprehensive cache clearing
                try {
                  // Clear localStorage
                  localStorage.clear();
                  
                  // Clear sessionStorage
                  sessionStorage.clear();
                  
                  // Clear service worker caches
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => {
                        caches.delete(name);
                      });
                    });
                  }
                  
                  // Unregister service worker
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                      registrations.forEach(registration => {
                        registration.unregister();
                      });
                    });
                  }
                  
                  // Show success message and reload
                  alert('All caches cleared successfully! The page will now reload with fresh data.');
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to clear all caches:', error);
                  // Fallback to basic cache clearing
                  localStorage.removeItem('vehicles_cache');
                  localStorage.removeItem('vehicles_cache_timestamp');
                  window.location.reload();
                }
              }}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear All Cache & Reload
            </button>
            <button 
              onClick={() => setShowPerformanceDashboard(true)}
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <BarChartIcon className="h-5 w-5 mr-2" />
              Performance
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-gray-600">Manage your vehicle inventory</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link 
              to="/debug" 
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Debug
            </Link>
            <Link 
              to="/cache-diagnostic" 
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Cache Diagnostic
            </Link>
            <Link 
              to="/test" 
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Test
            </Link>
            <button 
              onClick={() => setShowUserManagement(true)}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Users
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <LogOutIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Vehicles</h3>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#003366]"></div>
            ) : (
              <p className="text-3xl font-bold text-[#003366]">{vehicles.length}</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">For Sale</h3>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#003366]"></div>
            ) : (
              <p className="text-3xl font-bold text-[#003366]">{vehicles.filter(v => v.type === 'sale').length}</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">For Hire</h3>
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#003366]"></div>
            ) : (
              <p className="text-3xl font-bold text-[#003366]">{vehicles.filter(v => v.type === 'hire').length}</p>
            )}
          </div>
        </div>

        {/* Vehicle List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6600]"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Popular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map(vehicle => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={vehicle.images[0]?.url || vehicle.image} 
                            alt={vehicle.name} 
                            className="h-12 w-12 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800';
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{vehicle.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.type === 'sale' ? vehicle.price : vehicle.dailyRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.year || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.popular ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vehicle.type === 'sale' ? (
                            vehicle.status === 'sold' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Sold
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Available
                              </span>
                            )
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              For Hire
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 mb-2">
                            {vehicle.type === 'sale' ? (
                              vehicle.status !== 'sold' ? (
                                <button
                                  onClick={() => handleStatusChange(vehicle.id, 'sold')}
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                  title="Mark as Sold"
                                >
                                  <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Sold</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(vehicle.id, 'available')}
                                  className="text-green-600 hover:text-green-900 flex items-center"
                                  title="Mark as Available"
                                >
                                  <CheckIcon className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Available</span>
                                </button>
                              )
                            ) : (
                              <span className="text-gray-500 text-sm">Not applicable</span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(vehicle)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <EditIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(vehicle.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No vehicles match your search criteria.' : 'No vehicles found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Form Modal */}
      {showForm && (
        <AdminVehicleForm 
          vehicle={editingVehicle} 
          onClose={handleFormClose} 
        />
      )}
      
      {/* User Management Modal */}
      {showUserManagement && (
        <UserManagement onClose={handleUserManagementClose} />
      )}
      
      {/* Performance Dashboard Modal */}
      {showPerformanceDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#003366]">
                Performance Dashboard
              </h2>
              <button 
                onClick={() => setShowPerformanceDashboard(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <PerformanceDashboard />
            </div>
          </div>
        </div>
      )}
      
      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImport 
          onClose={handleCSVImportClose} 
          onImportSuccess={handleImportSuccess}
        />
      )}
    </div>;
}