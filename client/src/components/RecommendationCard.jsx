import { useState } from 'react'

const RecommendationCard = ({ skill }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-secondary-600">
        <h3 className="text-lg leading-6 font-medium text-white">
          {skill.name}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-white opacity-90">
          {skill.category}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Proficiency</span>
            <span className="text-sm font-medium text-primary-600">{Math.round(skill.score * 100)}%</span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${Math.round(skill.score * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          {skill.description || `Improve your ${skill.name} skills with these resources.`}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-900">Learning Resources:</h4>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs text-primary-600 hover:text-primary-800"
          >
            {expanded ? 'Show Less' : 'Show All'}
          </button>
        </div>
        
        {skill.learning_resources && skill.learning_resources.length > 0 ? (
          <ul className="space-y-2">
            {skill.learning_resources
              .slice(0, expanded ? skill.learning_resources.length : 2)
              .map((resource, index) => (
                <li key={index} className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    <span className="line-clamp-1">{resource.title}</span>
                  </a>
                  {resource.description && (
                    <p className="text-xs text-gray-500 mt-1 ml-5">{resource.description}</p>
                  )}
                </li>
              ))}
            
            {!expanded && skill.learning_resources.length > 2 && (
              <li className="text-xs text-gray-500 italic text-center">
                {skill.learning_resources.length - 2} more resources available
              </li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No resources available.</p>
        )}
      </div>
    </div>
  )
}

export default RecommendationCard
