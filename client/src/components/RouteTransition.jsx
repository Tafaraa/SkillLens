import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RouteTransition component that applies subtle transitions when routes change
 * This component doesn't wrap the routes but instead monitors location changes
 * and applies CSS classes to the main content area
 */
const RouteTransition = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Apply a subtle transition when the route changes
    const mainContent = document.querySelector('main');
    if (mainContent) {
      // Add a subtle opacity transition
      mainContent.style.opacity = '0.98';
      
      // Quick timeout to trigger the animation
      setTimeout(() => {
        mainContent.style.opacity = '1';
      }, 10);
    }
  }, [location.pathname]);
  
  // This component doesn't render anything visible
  return null;
};

export default RouteTransition;
