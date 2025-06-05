import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Get API URL from environment variables or use default
const isProduction = import.meta.env.MODE === 'production';
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://api.skilllens.com' : 'http://localhost:8000');

// Create axios instance with default config for resources
const resourcesClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Fallback resources in case API fails
const FALLBACK_RESOURCES = {
  Frontend: [
    {
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web",
      description: "Comprehensive documentation for web technologies"
    },
    {
      title: "Frontend Masters",
      url: "https://frontendmasters.com/",
      description: "In-depth courses on frontend development"
    }
  ],
  Backend: [
    {
      title: "Node.js Documentation",
      url: "https://nodejs.org/en/docs/",
      description: "Official Node.js documentation"
    },
    {
      title: "Backend Development Roadmap",
      url: "https://roadmap.sh/backend",
      description: "Step by step guide to becoming a backend developer"
    }
  ],
  Other: [
    {
      title: "Web Development Roadmap",
      url: "https://roadmap.sh/",
      description: "Step by step guide to becoming a developer"
    },
    {
      title: "freeCodeCamp",
      url: "https://www.freecodecamp.org/learn",
      description: "Free coding lessons and certifications"
    }
  ]
};

const RecommendationCard = ({ skill }) => {
  const [expanded, setExpanded] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Get resources for this skill from API
    if (skill && skill.name) {
      const fetchResources = async () => {
        try {
          setLoading(true);
          // Fetch resources for this specific skill from our API
          const response = await resourcesClient.get(`/resources/${encodeURIComponent(skill.name)}`);
          
          if (response.data && Array.isArray(response.data.resources)) {
            setResources(response.data.resources);
          } else {
            // If API returns unexpected format, use fallback
            console.warn(`API returned unexpected format for ${skill.name} resources`);
            useFallbackResources();
          }
        } catch (error) {
          console.error(`Error fetching resources for ${skill.name}:`, error);
          setError(`Failed to load resources for ${skill.name}`);
          useFallbackResources();
        } finally {
          setLoading(false);
        }
      };
      
      // Function to use fallback resources if API fails
      const useFallbackResources = () => {
        const category = skill.category || 'Other';
        if (FALLBACK_RESOURCES[category]) {
          setResources(FALLBACK_RESOURCES[category]);
        } else if (FALLBACK_RESOURCES.Other) {
          // Default to Other resources if no match
          setResources(FALLBACK_RESOURCES.Other);
        } else {
          // Empty array if no fallbacks available
          setResources([]);
        }
      };
      
      fetchResources();
    } else {
      setLoading(false);
      setResources([]);
    }
  }, [skill]);
  
  if (!skill) return null;
  
  // Ensure skill has valid properties
  const skillName = skill.name || 'Unknown Skill';
  const skillCategory = skill.category || 'Development';
  const skillDescription = skill.description || `Improve your ${skillName} skills to enhance your ${skillCategory} capabilities.`;
  
  // Calculate skill level text based on score (handle NaN cases)
  const scoreValue = typeof skill.score === 'number' && !isNaN(skill.score) ? skill.score : 0;
  const score = Math.round(scoreValue * 100);
  let skillLevel = "Beginner";
  let levelColor = "text-red-600 dark:text-red-400";
  
  if (score >= 80) {
    skillLevel = "Expert";
    levelColor = "text-green-600 dark:text-green-400";
  } else if (score >= 60) {
    skillLevel = "Advanced";
    levelColor = "text-blue-600 dark:text-blue-400";
  } else if (score >= 40) {
    skillLevel = "Intermediate";
    levelColor = "text-yellow-600 dark:text-yellow-400";
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-all duration-200 hover:shadow-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-secondary-600">
        <h3 className="text-lg leading-6 font-medium text-white">
          {skillName}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-white opacity-90">
          {skillCategory}
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-300">Proficiency</span>
            <span className={`text-sm font-medium ${levelColor}`}>{score}% - {skillLevel}</span>
          </div>
          <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                score >= 80 ? 'bg-green-500' :
                score >= 60 ? 'bg-blue-500' :
                score >= 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-100 mb-4">
          {skillDescription}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Learning Resources:</h4>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs font-button text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-expanded={expanded}
            aria-controls="resource-list"
          >
            {expanded ? 'Show Less' : 'Show All'}
          </button>
        </div>
        
        {resources.length > 0 ? (
          <ul id="resource-list" className="space-y-2 transition-all duration-200">
            {resources
              .slice(0, expanded ? resources.length : 2)
              .map((resource, index) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:translate-x-1">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-1 transition-all duration-200 hover:scale-105"
                    aria-label={`${resource.title} - external link`}
                  >
                    <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    <span className="line-clamp-1">{resource.title}</span>
                  </a>
                  {resource.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-5">{resource.description}</p>
                  )}
                </li>
              ))}
            
            {!expanded && resources.length > 2 && (
              <li className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
                {resources.length - 2} more resources available
              </li>
            )}
          </ul>
        ) : (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading learning resources...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
