"""
Learning resources mapping for skills
"""
from typing import Dict, List, Any, Optional
import json
import os
from pathlib import Path

# Path to resources file
RESOURCES_PATH = Path(__file__).parent.parent.parent / "resources.json"

class ResourceManager:
    """
    Manages learning resources for skills
    """
    
    def __init__(self):
        # Load resources
        self.resources = self._load_resources()
    
    def get_resources(self, skill_name: str) -> List[Dict[str, str]]:
        """
        Get learning resources for a skill
        
        Args:
            skill_name: Name of the skill
            
        Returns:
            List[Dict[str, str]]: List of learning resources
        """
        # Normalize skill name
        skill_name = skill_name.lower()
        
        # Check if skill exists in resources
        if skill_name in self.resources:
            return self.resources[skill_name].get("resources", [])
        
        # Return default resources if skill not found
        return [
            {
                "title": f"Learn {skill_name.title()}",
                "url": f"https://www.google.com/search?q=learn+{skill_name}+programming",
                "description": f"Search for {skill_name.title()} tutorials and courses"
            }
        ]
    
    def get_skill_info(self, skill_name: str) -> Dict[str, Any]:
        """
        Get information about a skill
        
        Args:
            skill_name: Name of the skill
            
        Returns:
            Dict[str, Any]: Skill information
        """
        # Normalize skill name
        skill_name = skill_name.lower()
        
        # Check if skill exists in resources
        if skill_name in self.resources:
            return self.resources[skill_name]
        
        # Return default info if skill not found
        return {
            "name": skill_name.title(),
            "category": self._guess_category(skill_name),
            "description": f"{skill_name.title()} programming skill",
            "resources": self.get_resources(skill_name)
        }
    
    def _load_resources(self) -> Dict[str, Any]:
        """
        Load resources from file
        
        Returns:
            Dict[str, Any]: Resources dictionary
        """
        # Check if file exists
        if not os.path.exists(RESOURCES_PATH):
            # Create default resources
            self._create_default_resources()
        
        # Load resources
        with open(RESOURCES_PATH, 'r') as f:
            return json.load(f)
    
    def _create_default_resources(self):
        """Create default resources file"""
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(RESOURCES_PATH), exist_ok=True)
        
        # Default resources
        default_resources = {
            "python": {
                "name": "Python",
                "category": "Backend",
                "description": "Python is a high-level, interpreted programming language known for its readability and versatility.",
                "resources": [
                    {
                        "title": "Python Official Documentation",
                        "url": "https://docs.python.org/3/",
                        "description": "The official Python documentation"
                    },
                    {
                        "title": "Python Crash Course",
                        "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                        "description": "Comprehensive Python tutorial for beginners"
                    },
                    {
                        "title": "Python for Everybody",
                        "url": "https://www.py4e.com/",
                        "description": "Free Python course for beginners"
                    }
                ]
            },
            "javascript": {
                "name": "JavaScript",
                "category": "Frontend",
                "description": "JavaScript is a programming language that enables interactive web pages and is an essential part of web applications.",
                "resources": [
                    {
                        "title": "MDN JavaScript Guide",
                        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                        "description": "Comprehensive JavaScript guide by Mozilla"
                    },
                    {
                        "title": "JavaScript Crash Course",
                        "url": "https://www.youtube.com/watch?v=hdI2bqOjy3c",
                        "description": "Quick introduction to JavaScript fundamentals"
                    },
                    {
                        "title": "JavaScript.info",
                        "url": "https://javascript.info/",
                        "description": "Modern JavaScript tutorial"
                    }
                ]
            },
            "react": {
                "name": "React",
                "category": "Frontend",
                "description": "React is a JavaScript library for building user interfaces, particularly single-page applications.",
                "resources": [
                    {
                        "title": "React Documentation",
                        "url": "https://reactjs.org/docs/getting-started.html",
                        "description": "Official React documentation"
                    },
                    {
                        "title": "React Crash Course",
                        "url": "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
                        "description": "Quick introduction to React"
                    },
                    {
                        "title": "React Tutorial",
                        "url": "https://react-tutorial.app/",
                        "description": "Interactive React tutorial"
                    }
                ]
            },
            "flask": {
                "name": "Flask",
                "category": "Backend",
                "description": "Flask is a micro web framework for Python, known for its simplicity and flexibility.",
                "resources": [
                    {
                        "title": "Flask Documentation",
                        "url": "https://flask.palletsprojects.com/",
                        "description": "Official Flask documentation"
                    },
                    {
                        "title": "Flask Mega-Tutorial",
                        "url": "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world",
                        "description": "Comprehensive Flask tutorial"
                    },
                    {
                        "title": "Flask Crash Course",
                        "url": "https://www.youtube.com/watch?v=Z1RJmh_OqeA",
                        "description": "Quick introduction to Flask"
                    }
                ]
            },
            "django": {
                "name": "Django",
                "category": "Backend",
                "description": "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.",
                "resources": [
                    {
                        "title": "Django Documentation",
                        "url": "https://docs.djangoproject.com/",
                        "description": "Official Django documentation"
                    },
                    {
                        "title": "Django for Beginners",
                        "url": "https://djangoforbeginners.com/",
                        "description": "Django tutorial for beginners"
                    },
                    {
                        "title": "Django Crash Course",
                        "url": "https://www.youtube.com/watch?v=e1IyzVyrLSU",
                        "description": "Quick introduction to Django"
                    }
                ]
            },
            "fastapi": {
                "name": "FastAPI",
                "category": "Backend",
                "description": "FastAPI is a modern, fast web framework for building APIs with Python based on standard Python type hints.",
                "resources": [
                    {
                        "title": "FastAPI Documentation",
                        "url": "https://fastapi.tiangolo.com/",
                        "description": "Official FastAPI documentation"
                    },
                    {
                        "title": "FastAPI Tutorial",
                        "url": "https://fastapi.tiangolo.com/tutorial/",
                        "description": "Official FastAPI tutorial"
                    },
                    {
                        "title": "FastAPI Crash Course",
                        "url": "https://www.youtube.com/watch?v=7t2alSnE2-I",
                        "description": "Quick introduction to FastAPI"
                    }
                ]
            },
            "pandas": {
                "name": "Pandas",
                "category": "Data Science",
                "description": "Pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool, built on top of Python.",
                "resources": [
                    {
                        "title": "Pandas Documentation",
                        "url": "https://pandas.pydata.org/docs/",
                        "description": "Official Pandas documentation"
                    },
                    {
                        "title": "Pandas Tutorial",
                        "url": "https://www.youtube.com/watch?v=vmEHCJofslg",
                        "description": "Pandas tutorial for beginners"
                    },
                    {
                        "title": "10 Minutes to Pandas",
                        "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
                        "description": "Quick introduction to Pandas"
                    }
                ]
            },
            "express": {
                "name": "Express",
                "category": "Backend",
                "description": "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
                "resources": [
                    {
                        "title": "Express Documentation",
                        "url": "https://expressjs.com/",
                        "description": "Official Express documentation"
                    },
                    {
                        "title": "Express Crash Course",
                        "url": "https://www.youtube.com/watch?v=L72fhGm1tfE",
                        "description": "Quick introduction to Express"
                    },
                    {
                        "title": "Express Tutorial",
                        "url": "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs",
                        "description": "Express tutorial by MDN"
                    }
                ]
            }
        }
        
        # Write to file
        with open(RESOURCES_PATH, 'w') as f:
            json.dump(default_resources, f, indent=2)
    
    def _guess_category(self, skill_name: str) -> str:
        """
        Guess category for a skill
        
        Args:
            skill_name: Name of the skill
            
        Returns:
            str: Category name
        """
        # Define category mappings
        frontend_skills = {'javascript', 'typescript', 'react', 'vue', 'angular', 'svelte', 'html', 'css', 'bootstrap', 'tailwind'}
        backend_skills = {'python', 'java', 'node', 'express', 'django', 'flask', 'fastapi', 'spring'}
        data_skills = {'pandas', 'numpy', 'matplotlib', 'seaborn', 'plotly', 'scikit-learn', 'tensorflow', 'pytorch'}
        database_skills = {'mongodb', 'mongoose', 'postgresql', 'mysql', 'sqlite', 'prisma', 'sequelize'}
        
        # Normalize skill name
        skill_name = skill_name.lower()
        
        # Check categories
        if skill_name in frontend_skills:
            return "Frontend"
        elif skill_name in backend_skills:
            return "Backend"
        elif skill_name in data_skills:
            return "Data Science"
        elif skill_name in database_skills:
            return "Database"
        
        # Default category
        return "Other"
