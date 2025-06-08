import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { jwtDecode } from 'jwt-decode';
import ThemeToggle from '../ThemeToggle';
import { motion } from 'framer-motion';
import apiService from '../../services/api';

// Authentication guard for production environment
const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  const { isDarkMode = false } = useTheme();
  
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
  const handleLogin = async (e) => {
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
    
    try {
      const response = await apiService.checkPassword(password);
      if (response.success) {
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
    } catch (err) {
      console.error('Login error:', err);
      setLoginAttempts(prev => prev + 1);
      setError(err.response?.data?.detail || 'An error occurred during login. Please try again.');
    }
  };
  
  // Login screen with security features
  return (
    <div className={`min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden` + (isDarkMode ? ' bg-black' : ' bg-white')}> 
      {/* Animated code background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          {[...Array(40)].map((_, i) => {
            const yStart = Math.random() * 90;
            const xStart = Math.random() * 90;
            const phraseList = [
              'function()', 'const data = []', 'import React',
              'export default', 'class App', '<Component />',
              'useState()', 'useEffect()', '{ code }', '// comment',
              'npm install', 'git commit', 'python -m venv', 'docker build',
              'async/await', 'try/catch', 'map()', 'filter()'
            ];
            const phrase = phraseList[Math.floor(Math.random() * phraseList.length)];
            return (
              <motion.div
                key={i}
                className="absolute text-[10px] sm:text-xs font-mono whitespace-nowrap text-primary-300 opacity-20"
                style={{ top: `${yStart}%`, left: `${xStart}%` }}
                animate={{ y: ["0%", "100%"], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 10 + Math.random() * 5, ease: "easeInOut", delay: Math.random() * 2 }}
              >
                {phrase}
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Theme toggle at the top right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-gray-900/90 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 relative z-10 backdrop-blur-md">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            SkillLens
          </h2>
          <p className="text-center text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
            <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold mb-2">Private Beta</span>
            <br />
            <span>
              <span className="font-semibold">SkillLens</span> is an AI-powered platform for analyzing code, visualizing developer skills, and recommending personalized learning paths. <br />
              <span className="text-primary-600 dark:text-primary-400 font-semibold">This site is currently in development.</span>
            </span>
          </p>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            To gain access, please contact the owner through the personal website below.<br />
            <a
              href="https://mutsvedutafara.com/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-semibold shadow transition-colors duration-200"
            >
              Contact for Access
            </a>
          </p>
        </div>
        <form className="mt-4 space-y-6" onSubmit={handleLogin} autoComplete="off">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm pr-12"
                placeholder="Access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginAttempts >= 5}
                aria-label="Access password"
              />
              <button
                type="button"
                tabIndex={0}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none z-10"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.13-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-2.13 2.13A9.956 9.956 0 0112 21c-2.21 0-4.26-.72-5.925-1.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.22.403 4.575 1.125m2.13 2.13A9.956 9.956 0 0121.542 12c-1.274 4.057-5.065 7-9.542 7-1.657 0-3.22-.403-4.575-1.125m-2.13-2.13A9.956 9.956 0 012.458 12z" /></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed shadow"
              disabled={loginAttempts >= 5}
            >
              Access site
            </button>
          </div>
        </form>
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          <span className="font-semibold">Security Notice:</span> Your access is protected. Please do not share your password. All access attempts are monitored for security.
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;

