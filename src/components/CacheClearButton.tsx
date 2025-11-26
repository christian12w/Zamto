import React from 'react';

interface CacheClearButtonProps {
  className?: string;
}

export function CacheClearButton({ className = '' }: CacheClearButtonProps) {
  const handleClearCache = () => {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear cache storage
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Show success message
      alert('Cache cleared successfully! The page will now reload.');
      
      // Reload the page to show fresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache. Please try manually refreshing the page.');
    }
  };

  return (
    <button
      onClick={handleClearCache}
      className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors ${className}`}
    >
      Clear Cache & Reload
    </button>
  );
}