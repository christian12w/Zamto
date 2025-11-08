import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { PlusIcon, TrashIcon, UserIcon } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
}

interface UserManagementProps {
  onClose: () => void;
}

export function UserManagement({ onClose }: UserManagementProps) {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load users on component mount
  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const loadUsers = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await authService.getUsers(token);
      if (response.success && response.users) {
        setUsers(response.users);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      setIsLoading(true);
      // Add new user
      const response = await authService.register({ username, email, password });
      
      if (response.success) {
        // Reset form
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        setSuccess('User added successfully');
        
        // Reload users
        await loadUsers();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to add user');
      }
    } catch (err) {
      setError('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (users.length <= 1) {
      setError('Cannot delete the last user');
      return;
    }
    
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        setIsLoading(true);
        const response = await authService.deleteUser(token, userId);
        
        if (response.success) {
          setSuccess('User deleted successfully');
          await loadUsers();
        } else {
          setError(response.message || 'Failed to delete user');
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#003366]">
            User Management
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {/* Add User Form */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Admin User
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md">
                  {success}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  placeholder="Enter username"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  placeholder="Enter email"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  placeholder="Enter password (min. 6 characters)"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center bg-[#FF6600] hover:bg-[#e55a00] text-white px-4 py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Users List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Admin Users ({users.length})
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-[#FF6600]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No admin users found</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString() 
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    className="text-red-600 hover:text-red-900 flex items-center"
                    disabled={users.length <= 1 || isLoading}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}