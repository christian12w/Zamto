import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Register service worker for offline functionality
let swRegistration: ServiceWorkerRegistration | null = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        swRegistration = registration;
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Function to send vehicles data to service worker for caching
export function cacheVehiclesInServiceWorker(vehicles: any[]) {
  if (swRegistration && swRegistration.active) {
    swRegistration.active.postMessage({
      type: 'CACHE_VEHICLES',
      vehicles: vehicles
    });
    console.log('Sent vehicles to service worker for caching');
  }
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);