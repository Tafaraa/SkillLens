import React from 'react'

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
      
      <div className="prose prose-blue max-w-none dark:prose-invert">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Welcome to SkillLens (the "Service"), a code analysis tool. 
          By accessing or using SkillLens, users agree to be bound by these Terms of Service ("Terms"). 
          If these Terms are not agreed to, the Service should not be used.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Description of Service</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          SkillLens is a tool designed to analyze code, identify programming skills, and provide personalized learning recommendations. 
          The Service allows users to upload code files or link GitHub repositories for analysis.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. User Responsibilities</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When using SkillLens, you agree to:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Only upload code that you have the legal right to share</li>
          <li className="mb-2">Not use the Service for any illegal or unauthorized purpose</li>
          <li className="mb-2">Not attempt to probe, scan, or test the vulnerability of the Service</li>
          <li className="mb-2">Not interfere with or disrupt the integrity or performance of the Service</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Intellectual Property</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Service, including its original content, features, and functionality, is the property of SkillLens and is protected by 
          international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Users retain all rights to their code. By uploading code to SkillLens, a temporary license is granted to SkillLens to analyze the code 
          for the purpose of providing the Service. SkillLens does not claim ownership of user code and it will not be stored after analysis is complete.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Limitation of Liability</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          In no event shall SkillLens, nor any of its affiliates, be liable for any indirect, consequential, incidental, 
          special, punitive or exemplary damages, or for any loss of profits or revenue, whether incurred directly or indirectly, 
          or any loss of data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Your use or inability to use the Service</li>
          <li className="mb-2">Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
          <li className="mb-2">Any errors or inaccuracies in the analysis results</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Disclaimer of Warranties</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. All warranties of any kind are expressly disclaimed, 
          whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a 
          particular purpose, and non-infringement.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          No warranty is made that the Service will meet user requirements, be available on an uninterrupted, secure, or error-free basis, 
          or that the results obtained from using the Service will be accurate or reliable.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Changes to Terms</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The right is reserved to modify or replace these Terms at any time. If a revision is material, at least 
          30 days' notice will be provided prior to any new terms taking effect. What constitutes a material change will be determined at the sole discretion of SkillLens.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Contact Information</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For any questions about these Terms, please use the following contact details:
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Email: contact@mutsvedutafara.com<br />
          Website: <a href="https://mutsvedutafara.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">https://mutsvedutafara.com</a>
        </p>
      </div>
    </div>
  )
}

export default TermsPage
