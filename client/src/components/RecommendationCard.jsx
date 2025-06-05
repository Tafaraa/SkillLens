import React, { useState, useEffect } from 'react'

// Default learning resources by skill category
const DEFAULT_RESOURCES = {
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
    },
    {
      title: "CSS-Tricks",
      url: "https://css-tricks.com/",
      description: "Tips, tricks, and techniques for frontend developers"
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
    },
    {
      title: "MongoDB University",
      url: "https://university.mongodb.com/",
      description: "Free courses on MongoDB and database concepts"
    }
  ],
  DevOps: [
    {
      title: "Docker Documentation",
      url: "https://docs.docker.com/",
      description: "Official Docker documentation"
    },
    {
      title: "Kubernetes Learning Path",
      url: "https://azure.microsoft.com/en-us/resources/kubernetes-learning-path/",
      description: "Microsoft's Kubernetes learning resources"
    },
    {
      title: "DevOps Roadmap",
      url: "https://roadmap.sh/devops",
      description: "Step by step guide to DevOps practices"
    }
  ],
  "Data Science": [
    {
      title: "Kaggle",
      url: "https://www.kaggle.com/learn",
      description: "Free courses on data science and machine learning"
    },
    {
      title: "Python Data Science Handbook",
      url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
      description: "Comprehensive guide to data analysis in Python"
    },
    {
      title: "Fast.ai",
      url: "https://www.fast.ai/",
      description: "Practical deep learning for coders"
    }
  ],
  Mobile: [
    {
      title: "React Native Documentation",
      url: "https://reactnative.dev/docs/getting-started",
      description: "Official React Native documentation"
    },
    {
      title: "Flutter Documentation",
      url: "https://flutter.dev/docs",
      description: "Official Flutter documentation"
    },
    {
      title: "Mobile Dev Roadmap",
      url: "https://roadmap.sh/android",
      description: "Step by step guide to mobile development"
    }
  ]
};

// Default resources for specific skills
const SKILL_SPECIFIC_RESOURCES = {
  JavaScript: [
    {
      title: "JavaScript.info",
      url: "https://javascript.info/",
      description: "Modern JavaScript tutorial from basics to advanced"
    },
    {
      title: "Eloquent JavaScript",
      url: "https://eloquentjavascript.net/",
      description: "Free book about JavaScript programming"
    }
  ],
  React: [
    {
      title: "React Documentation",
      url: "https://reactjs.org/docs/getting-started.html",
      description: "Official React documentation"
    },
    {
      title: "React Patterns",
      url: "https://reactpatterns.com/",
      description: "Common design patterns in React"
    }
  ],
  Python: [
    {
      title: "Python Documentation",
      url: "https://docs.python.org/3/",
      description: "Official Python documentation"
    },
    {
      title: "Real Python",
      url: "https://realpython.com/",
      description: "Python tutorials for all skill levels"
    }
  ],
  CSS: [
    {
      title: "CSS Reference",
      url: "https://cssreference.io/",
      description: "Visual guide to CSS properties"
    },
    {
      title: "Learn CSS",
      url: "https://web.dev/learn/css/",
      description: "Google's comprehensive CSS course"
    }
  ],
  HTML: [
    {
      title: "HTML Reference",
      url: "https://htmlreference.io/",
      description: "Visual guide to HTML elements"
    },
    {
      title: "HTML Best Practices",
      url: "https://github.com/hail2u/html-best-practices",
      description: "Collection of HTML best practices"
    }
  ]
};

const RecommendationCard = ({ skill }) => {
  const [expanded, setExpanded] = useState(false);
  const [resources, setResources] = useState([]);
  
  useEffect(() => {
    if (!skill) return;
    
    // Ensure skill has valid name and category
    const skillName = skill.name || 'Unknown';
    const skillCategory = skill.category || 'Development';
    
    // Start with any existing resources from the skill data
    let combinedResources = Array.isArray(skill.learning_resources) ? skill.learning_resources : [];
    
    // If we have less than 3 resources, add skill-specific resources
    if (combinedResources.length < 3 && SKILL_SPECIFIC_RESOURCES[skillName]) {
      const skillSpecificResources = SKILL_SPECIFIC_RESOURCES[skillName]
        .filter(resource => !combinedResources.some(r => r.url === resource.url));
      combinedResources = [...combinedResources, ...skillSpecificResources];
    }
    
    // If we still have less than 3 resources, add category resources
    if (combinedResources.length < 3 && DEFAULT_RESOURCES[skillCategory]) {
      const categoryResources = DEFAULT_RESOURCES[skillCategory]
        .filter(resource => !combinedResources.some(r => r.url === resource.url));
      combinedResources = [...combinedResources, ...categoryResources];
    }
    
    // If we still have no resources, add general resources
    if (combinedResources.length === 0) {
      combinedResources = [
        {
          title: "Web Development Roadmap",
          url: "https://roadmap.sh/",
          description: "Step by step guide to becoming a developer"
        },
        {
          title: "freeCodeCamp",
          url: "https://www.freecodecamp.org/learn",
          description: "Free coding lessons and certifications"
        },
        {
          title: "The Odin Project",
          url: "https://www.theodinproject.com/",
          description: "Free full-stack curriculum with projects"
        }
      ];
    }
    
    setResources(combinedResources);
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
  )
}

export default RecommendationCard
