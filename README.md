# SkillLens

SkillLens is a tool that analyzes code files or GitHub repositories to identify developer skill strengths and weaknesses based on the libraries and tools used, then suggests relevant learning materials.

## Features

- Upload code files or link GitHub repositories
- Analyze code to detect programming languages and libraries
- Identify skill strengths and weaknesses
- Visualize skills using radar charts
- Suggest learning materials (YouTube playlists, etc.) for improvement

## Tech Stack

### Frontend
- React 18.x
- Tailwind CSS 3.x
- React Router 6.x
- Axios 1.x
- Recharts 2.5.x

### Backend
- Python 3.10/3.11
- FastAPI 0.109+
- Uvicorn 0.22+
- python-multipart
- pylint / flake8

## Project Structure

```
SkillLens/
│
├── client/                      # React frontend
│   ├── public/                  # Static files
│   └── src/                     # React source code
│       ├── assets/              # Images, icons
│       ├── components/          # Reusable components
│       ├── pages/               # Page components
│       ├── services/            # API services
│       └── utils/               # Helper functions
│
├── server/                      # Python backend
│   ├── app/                     # FastAPI application
│   │   ├── routes/              # API endpoints
│   │   ├── core/                # Business logic
│   │   ├── models/              # Data models
│   │   ├── services/            # Services
│   │   └── utils/               # Utilities
│   └── requirements.txt         # Python dependencies
│
├── analysis/                    # Code analysis tools
│   ├── static_tools/            # Static analysis
│   ├── classifier/              # Skill classification
│   └── skill_rules.json         # Skill detection rules
│
└── docs/                        # Documentation
```

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.10+
- npm or yarn

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload
```

## Security

This project follows strict security guidelines. Please read our [Security Policy](SECURITY.md) before contributing.

Key security considerations:
- Never execute uploaded code
- Sanitize all inputs
- Limit file sizes to 5MB
- Use proper authentication

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
