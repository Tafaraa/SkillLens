import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme.jsx';

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
      description: "Comprehensive documentation for web technologies",
      type: "documentation"
    },
    {
      title: "Frontend Masters",
      url: "https://frontendmasters.com/",
      description: "In-depth courses on frontend development",
      type: "course"
    },
    {
      title: "CSS Tricks",
      url: "https://css-tricks.com/",
      description: "Tips, tricks, and techniques for CSS",
      type: "blog"
    },
    {
      title: "Modern JavaScript Tutorial",
      url: "https://javascript.info/",
      description: "From the basics to advanced topics with simple explanations",
      type: "tutorial"
    },
    {
      title: "HTML & CSS Crash Course",
      url: "https://www.youtube.com/watch?v=hu-q2zYwEYs",
      description: "Complete HTML & CSS tutorial for beginners",
      type: "video"
    }
  ],
  Backend: [
    {
      title: "Node.js Documentation",
      url: "https://nodejs.org/en/docs/",
      description: "Official Node.js documentation",
      type: "documentation"
    },
    {
      title: "Backend Development Roadmap",
      url: "https://roadmap.sh/backend",
      description: "Step by step guide to becoming a backend developer",
      type: "guide"
    },
    {
      title: "Express.js Tutorial",
      url: "https://www.youtube.com/watch?v=L72fhGm1tfE",
      description: "Express.js crash course for beginners",
      type: "video"
    },
    {
      title: "MongoDB University",
      url: "https://university.mongodb.com/",
      description: "Free MongoDB courses and certifications",
      type: "course"
    },
    {
      title: "RESTful API Design Best Practices",
      url: "https://blog.stoplight.io/rest-api-design-best-practices",
      description: "Guide to designing RESTful APIs",
      type: "article"
    }
  ],
  DevOps: [
    {
      title: "DevOps Roadmap",
      url: "https://roadmap.sh/devops",
      description: "Step by step guide to DevOps practices",
      type: "guide"
    },
    {
      title: "Docker Documentation",
      url: "https://docs.docker.com/",
      description: "Official Docker documentation",
      type: "documentation"
    },
    {
      title: "Kubernetes Basics",
      url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
      description: "Interactive tutorials for Kubernetes",
      type: "tutorial"
    },
    {
      title: "CI/CD Pipeline Tutorial",
      url: "https://www.youtube.com/watch?v=R8_veQiYBjI",
      description: "Learn CI/CD pipeline concepts with Jenkins",
      type: "video"
    },
    {
      title: "Infrastructure as Code with Terraform",
      url: "https://learn.hashicorp.com/terraform",
      description: "Learn to provision infrastructure with code",
      type: "course"
    }
  ],
  Mobile: [
    {
      title: "React Native Documentation",
      url: "https://reactnative.dev/docs/getting-started",
      description: "Official React Native documentation",
      type: "documentation"
    },
    {
      title: "Mobile Development Roadmap",
      url: "https://roadmap.sh/android",
      description: "Guide to mobile app development",
      type: "guide"
    },
    {
      title: "Flutter Crash Course",
      url: "https://www.youtube.com/watch?v=1gDhl4leEzA",
      description: "Build a complete app with Flutter",
      type: "video"
    },
    {
      title: "iOS Development with Swift",
      url: "https://developer.apple.com/swift/resources/",
      description: "Resources for iOS development with Swift",
      type: "documentation"
    },
    {
      title: "Mobile UI/UX Design Principles",
      url: "https://www.smashingmagazine.com/2018/08/mobile-design-best-practices/",
      description: "Best practices for mobile UI/UX design",
      type: "article"
    }
  ],
  Database: [
    {
      title: "Database Design Tutorial",
      url: "https://www.tutorialspoint.com/dbms/index.htm",
      description: "Learn database design principles",
      type: "tutorial"
    },
    {
      title: "SQL Tutorial",
      url: "https://www.w3schools.com/sql/",
      description: "Interactive SQL tutorial",
      type: "tutorial"
    },
    {
      title: "PostgreSQL Documentation",
      url: "https://www.postgresql.org/docs/",
      description: "Official PostgreSQL documentation",
      type: "documentation"
    },
    {
      title: "MongoDB Crash Course",
      url: "https://www.youtube.com/watch?v=-56x56UppqQ",
      description: "Learn MongoDB in 30 minutes",
      type: "video"
    },
    {
      title: "Database Normalization Explained",
      url: "https://www.essentialsql.com/get-ready-to-learn-sql-database-normalization-explained-in-simple-english/",
      description: "Database normalization concepts in simple terms",
      type: "article"
    }
  ],
  Development: [
    {
      title: "GitHub Learning Lab",
      url: "https://lab.github.com/",
      description: "Interactive courses on Git and GitHub",
      type: "course"
    },
    {
      title: "The Odin Project",
      url: "https://www.theodinproject.com/",
      description: "Free full stack curriculum",
      type: "course"
    },
    {
      title: "Visual Studio Code Tips and Tricks",
      url: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks",
      description: "Productivity tips for VS Code",
      type: "documentation"
    },
    {
      title: "Clean Code Principles",
      url: "https://www.youtube.com/watch?v=7EmboKQH8lM",
      description: "Writing clean, maintainable code",
      type: "video"
    },
    {
      title: "Design Patterns Explained",
      url: "https://refactoring.guru/design-patterns",
      description: "Learn software design patterns with examples",
      type: "guide"
    }
  ],
  Other: [
    {
      title: "Web Development Roadmap",
      url: "https://roadmap.sh/",
      description: "Step by step guide to becoming a developer",
      type: "guide"
    },
    {
      title: "freeCodeCamp",
      url: "https://www.freecodecamp.org/learn",
      description: "Free coding lessons and certifications",
      type: "course"
    },
    {
      title: "Codecademy",
      url: "https://www.codecademy.com/",
      description: "Interactive coding lessons",
      type: "course"
    },
    {
      title: "Tech Interview Handbook",
      url: "https://techinterviewhandbook.org/",
      description: "Prepare for technical interviews",
      type: "guide"
    },
    {
      title: "Coding Interview University",
      url: "https://github.com/jwasham/coding-interview-university",
      description: "Complete computer science study plan",
      type: "guide"
    }
  ]
};

const RecommendationCard = ({ skill }) => {
  // Add console log to debug what's being passed to the component
  console.log("Skill passed to RecommendationCard:", skill);
  
  // Get theme information
  const { isDarkMode } = useTheme();
  
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
    <div className={`rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
      <div className={`p-3 ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mr-2">
            {skillName}
          </h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${levelColor}`}>
            {skillLevel}
          </span>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Proficiency</span>
            <span className={`text-xs font-medium ${levelColor}`}>{score}%</span>
          </div>
          <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                score >= 80 ? 'bg-green-500' :
                score >= 60 ? 'bg-blue-500' :
                score >= 40 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-2 line-clamp-2">
          {skillDescription}
        </p>
        
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-xs font-medium text-gray-900 dark:text-white">Learning Resources:</h4>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs font-button text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1.5 py-0.5 transition-all duration-200"
            aria-expanded={expanded}
            aria-controls="resource-list"
          >
            {expanded ? 'Show Less' : 'Show All'}
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">Loading resources...</p>
          </div>
        ) : resources.length > 0 ? (
          <ul id="resource-list" className="space-y-1 transition-all duration-200">
            {resources
              .slice(0, expanded ? resources.length : 2)
              .map((resource, index) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200">
                  <div className="flex items-start">
                    {/* Resource type badge */}
                    <div className="flex-shrink-0 mt-0.5">
                      {resource.type === 'video' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Video
                        </span>
                      )}
                      {resource.type === 'documentation' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Docs
                        </span>
                      )}
                      {resource.type === 'course' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                          Course
                        </span>
                      )}
                      {resource.type === 'tutorial' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Tutorial
                        </span>
                      )}
                      {(!resource.type || (resource.type !== 'video' && resource.type !== 'documentation' && resource.type !== 'course' && resource.type !== 'tutorial')) && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {resource.type || 'Resource'}
                        </span>
                      )}
                    </div>
                    
                    <div className="ml-2 flex-1">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center focus:outline-none focus:ring-1 focus:ring-blue-400 rounded p-0.5"
                        aria-label={`${resource.title} - external link`}
                      >
                        <svg className="h-3 w-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        <span className="line-clamp-1 font-medium">{resource.title}</span>
                      </a>
                      {resource.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{resource.description}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            
            {!expanded && resources.length > 2 && (
              <li className="text-gray-500 dark:text-gray-400 italic text-center text-xs">
                {resources.length - 2} more resources available
              </li>
            )}
          </ul>
        ) : (
          <div className="text-center py-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">No resources available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
