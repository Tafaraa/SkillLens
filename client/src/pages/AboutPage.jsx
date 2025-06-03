import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          About SkillLens
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
          Discover your coding strengths and areas for improvement with our intelligent code analysis tool.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-12">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-gray-700 mb-4">
            SkillLens was created to help developers understand their skill profile based on the code they write.
            By analyzing the libraries, frameworks, and patterns in your code, we can identify your strengths
            and suggest areas where you might want to expand your knowledge.
          </p>
          <p className="text-gray-700">
            Our goal is to provide personalized learning recommendations that help you grow as a developer,
            focusing on the skills that are most relevant to your current projects and interests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <ol className="list-decimal pl-5 space-y-4 text-gray-700">
              <li>
                <strong>Upload Your Code:</strong> Submit a file or link to your GitHub repository.
              </li>
              <li>
                <strong>Static Analysis:</strong> We analyze your code without executing it, identifying languages, libraries, and frameworks.
              </li>
              <li>
                <strong>Skill Mapping:</strong> We map detected technologies to skills and proficiency levels.
              </li>
              <li>
                <strong>Visualization:</strong> View your skills as an interactive radar chart and bar graphs.
              </li>
              <li>
                <strong>Recommendations:</strong> Get personalized learning resources based on your skill profile.
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-4 text-gray-700">
              <li>
                <strong>No Code Execution:</strong> We never execute your code, ensuring complete safety.
              </li>
              <li>
                <strong>Temporary Storage:</strong> Uploaded files are analyzed and then immediately deleted.
              </li>
              <li>
                <strong>No Personal Data:</strong> We don't collect or store any personal information.
              </li>
              <li>
                <strong>Secure Analysis:</strong> All analysis is performed using static code analysis techniques.
              </li>
              <li>
                <strong>Open Source:</strong> Our codebase is open for review to ensure transparency.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-primary-700 rounded-lg shadow-lg">
        <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to analyze your code?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-100">
            Get started now and discover your coding strengths and areas for improvement.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/analyze"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Start Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
