# SkillLens

SkillLens analyzes code to identify developer skill strengths and suggests learning resources for improvement.

## Key Features

- Code analysis via file upload or GitHub repository
- Skills visualization with interactive charts
- Personalized learning recommendations

## Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion  
**Backend:** Python, FastAPI

## Access Control

This project uses a simple authentication system to restrict access to the live site while in development. The authentication system:

- Shows a login screen in production environments
- Allows free access during local development
- Uses secure token storage with expiration
- Implements rate limiting to prevent brute force attacks

## Development Setup

### Prerequisites
- Node.js 16+
- Python 3.10+

### Environment Setup

To set up the environment for both development and production:

1. Clone the repository
2. Run the setup script to create environment files:
   ```powershell
   # On Windows
   .\setup-env.ps1
   ```
   You'll be prompted to enter an access password for the production site.
3. Follow the quick start instructions below

### Quick Start

```bash
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## License

MIT License - see the LICENSE file for details.
