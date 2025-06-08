import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RouteTransition component that applies subtle transitions when routes change
 * This component wraps the main content and handles transitions using Framer Motion
 */
export const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0.95 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.95 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="w-full"
      >
        <main className="flex-grow">
          {children}
        </main>
      </motion.div>
    </AnimatePresence>
  );
};
