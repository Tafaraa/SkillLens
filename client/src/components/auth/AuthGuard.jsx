import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.jsx';
import { jwtDecode } from 'jwt-decode';

// Authentication guard for production environment
const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { isDarkMode } = useTheme();
  
  // Check if we're in development mode
  const isDevelopment = import.meta.env.MODE === 'development';
  
  // Check if user is already authenticated
  useEffect(() => {
    // Clear auth if token is expired
    const clearExpiredAuth = () => {
      try {
        const authToken = localStorage.getItem('site-auth-token');
        if (authToken) {
          const decoded = jwtDecode(authToken);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem('site-auth-token');
            return false;
          }
          return true;
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('site-auth-token');
        return false;
      }
      return false;
    };
    
    const authToken = localStorage.getItem('site-auth-token');
    const isValidToken = clearExpiredAuth();
    
    if (authToken && isValidToken) {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);
  
  // If we're in development mode, don't apply the guard
  if (isDevelopment) {
    return children;
  }
  
  // If still loading, show a spinner
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // If authenticated, show the children
  if (isAuthenticated) {
    return children;
  }
  
  // Handle login with rate limiting
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Rate limiting to prevent brute force attacks
    if (loginAttempts >= 5) {
      setError('Too many attempts. Please try again later.');
      setTimeout(() => {
        setLoginAttempts(0);
        setError('');
      }, 30000); // Reset after 30 seconds
      return;
    }
    
    if (password === import.meta.env.VITE_ACCESS_PASSWORD) {
      // Create a JWT-like token with expiration
      const now = Date.now();
      const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
      const token = btoa(JSON.stringify({
        iat: now,
        exp: now + expiresIn,
        token: import.meta.env.VITE_ACCESS_TOKEN
      }));
      
      localStorage.setItem('site-auth-token', token);
      setIsAuthenticated(true);
      setError('');
      setLoginAttempts(0);
    } else {
      setLoginAttempts(prev => prev + 1);
      setError(`Invalid password. ${5 - loginAttempts} attempts remaining.`);
    }
  };
  
  // Login screen with security features
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-100 to-white'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            SkillLens
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Private access only
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginAttempts >= 5}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loginAttempts >= 5}
            >
              Access site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthGuard;
