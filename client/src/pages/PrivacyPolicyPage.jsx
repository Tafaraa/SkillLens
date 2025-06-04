import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none dark:prose-invert">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Introduction</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          SkillLens (the "website") is committed to protecting user privacy and personal data. 
          This privacy policy provides information on how personal data is handled when users visit SkillLens, 
          and outlines user privacy rights and legal protections.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Data Collected</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When SkillLens is used to analyze code, the following data is collected:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Code snippets and repositories you choose to upload or link for analysis</li>
          <li className="mb-2">Analysis results and skill assessments</li>
          <li className="mb-2">User preferences (such as theme settings)</li>
          <li className="mb-2">Basic usage data to improve the service</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          User code is not stored permanently after analysis is complete. The code is processed, analyzed, and then deleted from the servers.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">How Data Is Used</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The data collected is used to:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Provide the code analysis service</li>
          <li className="mb-2">Generate skill assessments and learning recommendations</li>
          <li className="mb-2">Improve the accuracy and functionality of SkillLens</li>
          <li className="mb-2">Remember your preferences</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Data Security</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Appropriate security measures have been implemented to prevent personal data from being accidentally lost, 
          used, or accessed in an unauthorized way. Access to personal data is limited to those who have a genuine 
          business need to know it.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Your Rights</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Under data protection law, you have rights including:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Right of Access - Users have the right to request copies of their personal information.</li>
          <li className="mb-2">Right to Rectification - Users have the right to request rectification of information they believe is inaccurate. Users also have the right to request completion of information they believe is incomplete.</li>
          <li className="mb-2">Right to Erasure - Users have the right to request the erasure of their personal information in certain circumstances.</li>
          <li className="mb-2">Right to Restriction of Processing - Users have the right to request the restriction of processing of their information in certain circumstances.</li>
          <li className="mb-2">Right to Object to Processing - Users have the right to object to the processing of their personal data in certain circumstances.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Changes to This Privacy Policy</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This privacy policy may be updated from time to time. Notification of any changes will be made by posting the new privacy policy on this page.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Contact Information</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For any questions about this privacy policy or data practices, please use the following contact details:
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Email: contact@mutsvedutafara.com<br />
          Website: <a href="https://mutsvedutafara.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">https://mutsvedutafara.com</a>
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
