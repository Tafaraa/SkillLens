# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within SkillLens, please send an email to [INSERT YOUR EMAIL]. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:
- Type of vulnerability
- Steps to reproduce the issue
- Affected component(s)
- Potential impact

## Security Best Practices for Contributors

### General Guidelines

1. **Never Execute Uploaded Code**
   - All code analysis must be static
   - Do not use `eval()`, `exec()`, or similar functions

2. **Input Validation**
   - Sanitize all user inputs
   - Validate file types (only accept .py, .js, .zip)
   - Use proper validation libraries/techniques

3. **File Upload Security**
   - Limit file sizes to 5MB maximum
   - Scan files for malicious content
   - Store uploads in a secure, isolated location

4. **Authentication & Authorization**
   - Use secure authentication methods (JWT or session-based)
   - Implement proper access controls
   - Never hardcode credentials

### Frontend Security

1. **XSS Prevention**
   - Sanitize data before rendering
   - Use React's built-in XSS protection
   - Avoid using `dangerouslySetInnerHTML`

2. **CSRF Protection**
   - Implement CSRF tokens for sensitive operations
   - Use proper headers for API requests

3. **Secure Communication**
   - Always use HTTPS
   - Implement proper CORS policies

### Backend Security

1. **API Security**
   - Implement rate limiting
   - Use proper authentication for endpoints
   - Validate all request parameters

2. **Dependency Management**
   - Keep dependencies updated
   - Regularly audit packages for vulnerabilities
   - Use `npm audit` and `pip-audit`

3. **Error Handling**
   - Do not expose stack traces in production
   - Implement proper error logging
   - Return generic error messages to users

4. **Environment Variables**
   - Store sensitive information in .env files
   - Never commit .env files to the repository
   - Use environment-specific configurations

### GitHub Security

1. **Repository Protection**
   - Enable branch protection rules
   - Require pull request reviews
   - Enable vulnerability alerts

2. **Secret Management**
   - Never commit API keys, tokens, or credentials
   - Use GitHub Secrets for CI/CD workflows
   - Rotate secrets regularly

3. **Code Scanning**
   - Enable GitHub code scanning
   - Address security alerts promptly

## Compliance

This project aims to follow security best practices and guidelines. Contributors should be aware of and comply with:

- OWASP Top 10 Web Application Security Risks
- General Data Protection Regulation (GDPR) principles
- Secure coding standards

## Security Updates

Security updates will be released as soon as possible after vulnerabilities are discovered and fixed. Contributors should keep their local repositories updated.

---

By contributing to this project, you agree to adhere to these security guidelines. Failure to do so may result in the rejection of contributions.
