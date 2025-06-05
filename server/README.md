# SkillLens Backend API

This is the backend API for SkillLens, a tool that analyzes code files and GitHub repositories to identify developer skills and provide learning resources.

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the server:

```bash
cd server
python -m app.main
```

The server will start on `http://localhost:8000`.

## API Endpoints

### Analyze Code File

```
POST /analyze/file
```

Upload a code file for analysis. Supported file types include:
- Python (.py)
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- HTML (.html)
- CSS (.css)
- Java (.java)
- C (.c)
- C++ (.cpp)
- Go (.go)
- Ruby (.rb)
- PHP (.php)
- ZIP archives containing code files

#### Request

- Content-Type: multipart/form-data
- Body: file (file upload)

#### Response

```json
{
  "filename": "example.py",
  "language": "Python",
  "libraries": ["pandas", "numpy", "tensorflow"],
  "skills": [
    {
      "name": "Python",
      "score": 0.95,
      "category": "Backend",
      "description": "Python is a high-level, interpreted programming language...",
      "learning_resources": [
        {
          "title": "Python Documentation",
          "url": "https://docs.python.org/3/",
          "description": "Official Python documentation"
        }
      ]
    }
  ],
  "recommendations": ["Python", "Pandas", "NumPy"],
  "timestamp": "2025-06-05T08:45:57+02:00"
}
```

### Analyze GitHub Repository

```
POST /analyze/github
```

Analyze a public GitHub repository.

#### Request

- Content-Type: application/json
- Body:

```json
{
  "repository_url": "https://github.com/username/repo",
  "branch": "main"
}
```

#### Response

Same as the file analysis response.

### Get Learning Resources

```
GET /resources/{skill_name}
```

Get learning resources for a specific skill.

#### Response

```json
{
  "name": "Python",
  "category": "Backend",
  "description": "Python is a high-level, interpreted programming language...",
  "resources": [
    {
      "title": "Python Documentation",
      "url": "https://docs.python.org/3/",
      "description": "Official Python documentation"
    }
  ]
}
```

### Get All Skills

```
GET /skills
```

Get a list of all supported skills.

#### Response

```json
{
  "skills": [
    {
      "name": "Python",
      "category": "Backend",
      "description": "Python is a high-level, interpreted programming language..."
    },
    {
      "name": "JavaScript",
      "category": "Frontend",
      "description": "JavaScript is a programming language..."
    }
  ]
}
```

### Get Skills by Category

```
GET /skills/categories
```

Get skills grouped by category.

#### Response

```json
{
  "categories": {
    "Frontend": [
      {
        "name": "JavaScript",
        "description": "JavaScript is a programming language..."
      }
    ],
    "Backend": [
      {
        "name": "Python",
        "description": "Python is a high-level, interpreted programming language..."
      }
    ]
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- 200: Success
- 400: Bad request (invalid input)
- 404: Resource not found
- 500: Server error

Error responses include a detail message explaining the error.

## Caching

GitHub repository analysis results are cached for 1 hour to improve performance. The cache is based on the repository URL and branch.
