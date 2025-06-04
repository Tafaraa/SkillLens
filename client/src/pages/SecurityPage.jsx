import React from 'react'

const SecurityPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Security Policy</h1>
      
      <div className="prose prose-blue max-w-none dark:prose-invert">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Commitment to Security</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          SkillLens is committed to the security of user data. This security policy outlines the measures 
          taken to protect user information and ensure a secure experience when using the SkillLens service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Data Protection</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When you upload code to SkillLens for analysis:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Your code is processed in a secure environment</li>
          <li className="mb-2">Code is analyzed and then promptly deleted after analysis is complete</li>
          <li className="mb-2">Only analysis results and skill assessments are stored, not your actual code</li>
          <li className="mb-2">All data is encrypted during transmission using industry-standard TLS/SSL protocols</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Infrastructure Security</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          SkillLens employs the following security measures:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Regular security updates and patches to all systems</li>
          <li className="mb-2">Firewall protection and intrusion detection systems</li>
          <li className="mb-2">Secure development practices following OWASP guidelines</li>
          <li className="mb-2">Regular security audits and vulnerability assessments</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">GitHub Integration Security</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When you connect SkillLens to your GitHub repository:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Only read-only access to public repositories is requested</li>
          <li className="mb-2">GitHub OAuth tokens are encrypted and stored securely</li>
          <li className="mb-2">You can revoke access to SkillLens from your GitHub settings at any time</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Incident Response</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          In the event of a security breach:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">The incident will be promptly investigated</li>
          <li className="mb-2">Affected users will be notified as soon as possible</li>
          <li className="mb-2">All necessary steps will be taken to mitigate the impact and prevent future occurrences</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Security Recommendations for Users</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enhance your security when using SkillLens:
        </p>
        <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li className="mb-2">Do not upload code containing sensitive information such as API keys, passwords, or personal data</li>
          <li className="mb-2">Regularly review your connected applications in GitHub</li>
          <li className="mb-2">Report any suspicious activity or potential security issues immediately</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Reporting Security Issues</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          If a security vulnerability is discovered or if there are concerns about the security of SkillLens, please make contact immediately using the details below:
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Email: security@mutsvedutafara.com<br />
          Website: <a href="https://mutsvedutafara.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">https://mutsvedutafara.com</a>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Cooperation in keeping SkillLens secure for everyone is appreciated.
        </p>
      </div>
    </div>
  )
}

export default SecurityPage
