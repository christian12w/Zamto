import { useState, useEffect, useCallback } from 'react';
import { AdminVehicleForm } from '../components/AdminVehicleForm';
import { VehicleCard } from '../components/VehicleCard';
import { UserManagement } from '../components/UserManagement';
import { CSVImport } from '../components/CSVImport';
import { PerformanceDashboard } from '../components/PerformanceDashboard';
import { getVehicles, refreshVehicles, deleteVehicle, Vehicle, clearVehicleCache, updateVehicleStatus } from '../utils/vehicleStorage';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, EyeIcon, EditIcon, TrashIcon, UserIcon, LogOutIcon, UploadIcon, BarChartIcon, X, ShoppingCartIcon, CheckIcon, RefreshCwIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Admin() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Debounce function for vehicle updates
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const loadVehicles = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      const vehicleData = await getVehicles(forceRefresh);
      setVehicles(vehicleData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Handle vehicle updates with debouncing
  useEffect(() => {
    const handleVehiclesUpdated = debounce(() => {
      loadVehicles();
    }, 300); // 300ms debounce

    window.addEventListener('vehiclesUpdated', handleVehiclesUpdated);
    
    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdated);
    };
  }, [loadVehicles]);

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await loadVehicles(true);
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehicle(null);
    // Only refresh if we actually made changes
    // loadVehicles(); // Removed automatic refresh to prevent constant reloading
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        const success = await deleteVehicle(id);
        if (success) {
          // Force refresh after delete
          await loadVehicles(true);
        }
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  const handleMarkAsSold = async (vehicle: Vehicle) => {
    try {
      const updatedVehicle = await updateVehicleStatus(vehicle.id, 'sold');
      if (updatedVehicle) {
        // Force refresh after status change
        await loadVehicles(true);
      }
    } catch (error) {
      console.error('Failed to update vehicle status:', error);
    }
  };

  const handleMarkAsAvailable = async (vehicle: Vehicle) => {
    try {
      const updatedVehicle = await updateVehicleStatus(vehicle.id, 'available');
      if (updatedVehicle) {
        // Force refresh after status change
        await loadVehicles(true);
      }
    } catch (error) {
      console.error('Failed to update vehicle status:', error);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.price.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.username}! Manage your vehicle inventory here.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={logout}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
              >
                <LogOutIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
              
              <Link 
                to="/" 
                className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                View Site
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
                  <p className="text-2xl font-semibold text-gray-900">{vehicles.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCartIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Available</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => v.status !== 'sold').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Sold</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {vehicles.filter(v => v.status === 'sold').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Vehicle
          </button>
          
          <button
            onClick={() => {
              // Import the createTestVehicle function
              import('../utils/vehicleStorage').then(module => {
                module.createTestVehicle();
              });
            }}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
            disabled={loading}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Test Vehicle
          </button>
          
          <button
            onClick={() => {
              // Import the resetVehiclesToOriginal function
              import('../utils/resetVehicles').then(module => {
                module.resetVehiclesToOriginal().then(success => {
                  if (success) {
                    alert('Vehicles reset to original 17 vehicles successfully!');
                    // Refresh the vehicle list
                    loadVehicles();
                  } else {
                    alert('Failed to reset vehicles. Please try again.');
                  }
                });
              });
            }}
            className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
            disabled={loading}
          >
            <RefreshCwIcon className="h-5 w-5 mr-2" />
            Restore Original Vehicles
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={refreshLoading}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCwIcon className={`h-5 w-5 mr-2 ${refreshLoading ? 'animate-spin' : ''}`} />
            {refreshLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <button
            onClick={() => setShowCSVImport(true)}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Import CSV
          </button>
          
          <button
            onClick={() => setShowUserManagement(true)}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Users
          </button>
          
          <button
            onClick={() => setShowPerformanceDashboard(true)}
            className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
          >
            <BarChartIcon className="h-5 w-5 mr-2" />
            Performance
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              placeholder="Search vehicles..."
              className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Last Update Info */}
        {lastUpdate && (
          <div className="mb-4 text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Vehicles Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="relative">
                <VehicleCard 
                  key={vehicle.id}
                  vehicle={vehicle} 
                  onShowDetails={() => handleEditVehicle(vehicle)}
                />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleEditVehicle(vehicle)}
                    className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-md transition-colors"
                    title="Edit"
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="bg-white hover:bg-gray-100 text-red-600 p-2 rounded-full shadow-md transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  
                  {vehicle.status === 'sold' ? (
                    <button
                      onClick={() => handleMarkAsAvailable(vehicle)}
                      className="bg-white hover:bg-gray-100 text-green-600 p-2 rounded-full shadow-md transition-colors"
                      title="Mark as Available"
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsSold(vehicle)}
                      className="bg-white hover:bg-gray-100 text-purple-600 p-2 rounded-full shadow-md transition-colors"
                      title="Mark as Sold"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* No Vehicles Found */}
        {!loading && filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <CarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No vehicles match your search.' : 'Get started by adding a new vehicle.'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Vehicle
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button
                onClick={handleFormClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <AdminVehicleForm
              vehicle={editingVehicle}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
      
      {showCSVImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Import Vehicles from CSV</h2>
              <button
                onClick={() => setShowCSVImport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <CSVImport onClose={() => setShowCSVImport(false)} onImportSuccess={() => loadVehicles(true)} />
          </div>
        </div>
      )}
      
      {showUserManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button
                onClick={() => setShowUserManagement(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <UserManagement onClose={() => setShowUserManagement(false)} />
          </div>
        </div>
      )}
      
      {showPerformanceDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Performance Dashboard</h2>
              <button
                onClick={() => setShowPerformanceDashboard(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <PerformanceDashboard />
          </div>
        </div>
      )}
    </div>
  );
}

// Icons (these would typically be imported)
function CarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

export default Admin;