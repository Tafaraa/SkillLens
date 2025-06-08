import React, { useState, useEffect } from 'react';

// Notification event bus
const listeners = [];
let notificationId = 0;

export const notify = (message, type = 'info', duration = 3000) => {
  const id = ++notificationId;
  const notification = { id, message, type, duration };
  
  // Notify all listeners
  listeners.forEach(listener => listener(notification));
  
  return id;
};

export const notifySuccess = (message, duration = 3000) => notify(message, 'success', duration);
export const notifyError = (message, duration = 3000) => notify(message, 'error', duration);
export const notifyInfo = (message, duration = 3000) => notify(message, 'info', duration);
export const notifyWarning = (message, duration = 3000) => notify(message, 'warning', duration);

export const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Subscribe to notifications
    const handleNotification = (notification) => {
      setNotifications(prev => [...prev, notification]);
      
      // Auto-dismiss after duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, notification.duration);
    };
    
    listeners.push(handleNotification);
    
    // Cleanup
    return () => {
      const index = listeners.indexOf(handleNotification);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  
  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between transition-all transform animate-fade-in max-w-sm
            ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${notification.type === 'info' ? 'bg-blue-500 text-white' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
          `}
        >
          <span>{notification.message}</span>
          <button 
            onClick={() => handleDismiss(notification.id)}
            className="ml-3 text-white hover:text-gray-200 focus:outline-none"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
