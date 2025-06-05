import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Get API URL from environment variables or use default
const isProduction = import.meta.env.MODE === 'production';
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://api.skilllens.com' : 'http://localhost:8000');

// Log the API URL for debugging
console.log('RecommendationCard - API URL:', API_URL);

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
  DevOps: [
    {
      title: "DevOps Roadmap",
      url: "https://roadmap.sh/devops",
      description: "Step by step guide to DevOps practices"
    },
    {
      title: "Docker Documentation",
      url: "https://docs.docker.com/",
      description: "Official Docker documentation"
    }
  ],
  Mobile: [
    {
      title: "React Native Documentation",
      url: "https://reactnative.dev/docs/getting-started",
      description: "Official React Native documentation"
    },
    {
      title: "Mobile Development Roadmap",
      url: "https://roadmap.sh/android",
      description: "Guide to mobile app development"
    }
  ],
  Database: [
    {
      title: "Database Design Tutorial",
      url: "https://www.tutorialspoint.com/dbms/index.htm",
      description: "Learn database design principles"
    },
    {
      title: "SQL Tutorial",
      url: "https://www.w3schools.com/sql/",
      description: "Interactive SQL tutorial"
    }
  ],
  Development: [
    {
      title: "GitHub Learning Lab",
      url: "https://lab.github.com/",
      description: "Interactive courses on Git and GitHub"
    },
    {
      title: "The Odin Project",
      url: "https://www.theodinproject.com/",
      description: "Free full stack curriculum"
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
  // Add console log to debug what's being passed to the component
  console.log("Skill passed to RecommendationCard:", skill);
  
  // Immediately check if skill is valid and has required properties
  if (!skill || (typeof skill !== 'object')) {
    console.error("Invalid skill object passed to RecommendationCard");
    return null;
  }
  
  const [expanded, setExpanded] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Get resources for this skill from API
    if (skill) {
      const fetchResources = async () => {
        try {
          setLoading(true);
          // Use the skill name if available, otherwise use the category, with proper trimming
          const skillName = typeof skill.name === 'string' ? skill.name.trim() : 
                          typeof skill.category === 'string' ? skill.category.trim() : null;
          
          console.log("Attempting to fetch resources for skill:", skillName);
          
          // Check if we have a valid skill name before making the API call
          if (!skillName) {
            console.warn("Missing skill name and category. Cannot fetch resources.");
            useFallbackResources();
            return;
          }
          
          try {
            // Fetch resources for this specific skill from our API
            const response = await resourcesClient.get(`/resources/${encodeURIComponent(skillName)}`);
            
            if (response.data && Array.isArray(response.data.resources)) {
              setResources(response.data.resources);
            } else {
              // If API returns unexpected format, use fallback
              console.warn(`API returned unexpected format for ${skillName} resources`);
              useFallbackResources();
            }
          } catch (error) {
            console.error(`Error fetching resources for ${skillName}:`, error);
            setError(`Failed to load resources for ${skillName}`);
            useFallbackResources();
          }
        } finally {
          setLoading(false);
        }
      };
      
      // Function to use fallback resources if API fails
      const useFallbackResources = () => {
        // Ensure category is a string and properly formatted
        const category = typeof skill.category === 'string' ? skill.category.trim() : 'Other';
        console.log("Using fallback resources for category:", category);
        
        // Check if we have resources for this category, otherwise use Other
        if (FALLBACK_RESOURCES[category]) {
          console.log("Found fallback resources for category:", category);
          setResources(FALLBACK_RESOURCES[category]);
        } else {
          console.log("Using default 'Other' fallback resources");
          setResources(FALLBACK_RESOURCES.Other || []);
        }
      };
      
      // Immediately use fallback resources to avoid loading state
      useFallbackResources();
      // Then try to fetch from API
      fetchResources();
    } else {
      setLoading(false);
      setResources([]);
    }
  }, [skill]);
  
  if (!skill) return null;
  
  // Extract skill properties with validation
  const skillName = skill && typeof skill.name === 'string' ? skill.name.trim() : 'JavaScript';
  const skillCategory = skill && typeof skill.category === 'string' ? skill.category.trim() : 'Development';
  const skillDescription = skill && typeof skill.description === 'string' ? skill.description : 
    `Improve your ${skillName} skills to enhance your ${skillCategory} capabilities.`;
  const skillScore = skill && typeof skill.score === 'number' ? skill.score : 0.5;
  
  // Debug the skill object
  console.log("RecommendationCard received skill:", skill);
  console.log("Extracted properties:", { skillName, skillCategory, skillDescription, skillScore });
  
  // Always ensure we have valid data to display
  if (!skillName || !skillCategory) {
    console.warn("RecommendationCard received invalid skill data, using fallbacks");
  }
  
  // Calculate skill level text based on score (handle NaN cases)
  const score = Math.round(skillScore * 100);
  console.log("Skill score for", skillName, ":", skillScore, "formatted as:", score);
  
  let skillLevel;
  let levelColor;
  
  if (score >= 80) {
    skillLevel = "Expert";
    levelColor = "text-green-600 dark:text-green-400";
  } else if (score >= 60) {
    skillLevel = "Proficient";
    levelColor = "text-blue-600 dark:text-blue-400";
  } else if (score >= 40) {
    skillLevel = "Intermediate";
    levelColor = "text-yellow-600 dark:text-yellow-400";
  } else {
    skillLevel = "Beginner";
    levelColor = "text-red-600 dark:text-red-400";
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
        
        {loading ? (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading learning resources...</p>
          </div>
        ) : resources.length > 0 ? (
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
            <p className="text-sm text-gray-500 dark:text-gray-400">No learning resources available for this skill.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
