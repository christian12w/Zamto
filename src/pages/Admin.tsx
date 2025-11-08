import React, { useState, useEffect, useCallback } from 'react';
import { AdminVehicleForm } from '../components/AdminVehicleForm';
import { VehicleCard } from '../components/VehicleCard';
import { UserManagement } from '../components/UserManagement';
import { getVehicles, deleteVehicle, Vehicle } from '../utils/vehicleStorage';
import { initializeDefaultUser, getCurrentUser, logoutUser } from '../utils/userManagement';
import { PlusIcon, EyeIcon, EditIcon, TrashIcon, UserIcon, LogOutIcon } from 'lucide-react';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Initialize default user
  useEffect(() => {
    initializeDefaultUser();
  }, []);

  // Load vehicles with useCallback for performance
  const loadVehicles = useCallback(() => {
    setVehicles(getVehicles());
  }, []);

  useEffect(() => {
    loadVehicles();
    
    // Listen for vehicle updates
    const handleVehiclesUpdate = () => {
      // Debounce the update to prevent excessive re-renders
      setTimeout(loadVehicles, 100);
    };
    
    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    window.addEventListener('storage', handleVehiclesUpdate);
    
    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
      window.removeEventListener('storage', handleVehiclesUpdate);
    };
  }, [loadVehicles]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, we're using a simple authentication
    // In a real application, this should be properly secured
    const userCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');
    const hashedPassword = btoa(password);
    
    if (userCredentials[username] === hashedPassword) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      // Update last login
      const users = JSON.parse(localStorage.getItem('zamto_admin_users') || '[]');
      const userIndex = users.findIndex((user: any) => user.username === username);
      if (userIndex !== -1) {
        users[userIndex].lastLogin = new Date().toISOString();
        localStorage.setItem('zamto_admin_users', JSON.stringify(users));
      }
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id);
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
    // Reload vehicles to reflect any changes
    loadVehicles();
  };

  const handleUserManagementClose = () => {
    setShowUserManagement(false);
    // Refresh users list
    loadVehicles();
  };

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-[#003366] mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" 
                placeholder="Enter username" 
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" 
                placeholder="Enter password" 
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>;
  }

  return <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with user info and logout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {currentUser}!</p>
          </div>
          <div className="flex gap-2">
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-gray-600">Manage your vehicle inventory</p>
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="flex items-center bg-[#FF6600] hover:bg-[#e55a00] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Vehicle
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Vehicles</h3>
            <p className="text-3xl font-bold text-[#003366]">{vehicles.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">For Sale</h3>
            <p className="text-3xl font-bold text-[#003366]">{vehicles.filter(v => v.type === 'sale').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">For Hire</h3>
            <p className="text-3xl font-bold text-[#003366]">{vehicles.filter(v => v.type === 'hire').length}</p>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No vehicles match your search criteria.' : 'No vehicles found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        <UserManagement 
          onClose={handleUserManagementClose} 
        />
      )}
    </div>;
}