import React, { useEffect, useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, LogOutIcon } from 'lucide-react';
import { getVehicles, deleteVehicle, Vehicle } from '../utils/vehicleStorage';
import { AdminVehicleForm } from '../components/AdminVehicleForm';
export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const ADMIN_PASSWORD = 'zamto2025';
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadVehicles();
    }
  }, []);
  const loadVehicles = () => {
    setVehicles(getVehicles());
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      loadVehicles();
    } else {
      alert('Incorrect password');
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
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
    loadVehicles();
  };
  if (!isAuthenticated) {
    return <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-[#003366] mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent" placeholder="Enter admin password" />
            </div>
            <button type="submit" className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-md font-semibold transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>;
  }
  return <div className="w-full min-h-screen bg-gray-50">
      <div className="bg-[#003366] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Vehicle Inventory Management</h1>
          <button onClick={handleLogout} className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors">
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button onClick={() => {
          setEditingVehicle(null);
          setShowForm(true);
        }} className="flex items-center bg-[#228B22] hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Vehicle
          </button>
        </div>
        {showForm && <AdminVehicleForm vehicle={editingVehicle} onClose={handleFormClose} />}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                {vehicles.map(vehicle => <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={vehicle.image} alt={vehicle.name} className="h-16 w-24 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {vehicle.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.year || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.popular ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(vehicle)} className="text-[#FF6600] hover:text-[#e55a00] mr-4">
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(vehicle.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}