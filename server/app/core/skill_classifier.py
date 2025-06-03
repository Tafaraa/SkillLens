import json
import os
from typing import List, Dict, Any
from pathlib import Path
from app.models.skill_models import SkillScore

# Path to skill rules file
SKILL_RULES_PATH = Path(__file__).parent.parent.parent.parent / "analysis" / "skill_rules.json"

def load_skill_rules() -> Dict[str, Any]:
    """
    Load skill rules from JSON file
    
    Returns:
        Dict[str, Any]: Skill rules dictionary
    """
    # Check if skill rules file exists
    if not os.path.exists(SKILL_RULES_PATH):
        # Create default rules if file doesn't exist
        default_rules = create_default_skill_rules()
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(SKILL_RULES_PATH), exist_ok=True)
        
        # Write default rules to file
        with open(SKILL_RULES_PATH, 'w') as f:
            json.dump(default_rules, f, indent=2)
        
        return default_rules
    
    # Load rules from file
    with open(SKILL_RULES_PATH, 'r') as f:
        return json.load(f)

def create_default_skill_rules() -> Dict[str, Any]:
    """
    Create default skill rules
    
    Returns:
        Dict[str, Any]: Default skill rules
    """
    return {
        "languages": {
            "Python": {
                "category": "Backend",
                "libraries": {
                    "django": {
                        "name": "Django",
                        "category": "Backend",
                        "description": "Python web framework",
                        "learning_resources": [
                            {"title": "Django for Beginners", "url": "https://www.youtube.com/playlist?list=PL-osiE80TeTtoQCKZ03TU5fNfx2UY6U4p"}
                        ]
                    },
                    "flask": {
                        "name": "Flask",
                        "category": "Backend",
                        "description": "Lightweight Python web framework",
                        "learning_resources": [
                            {"title": "Flask Tutorial", "url": "https://www.youtube.com/playlist?list=PL-osiE80TeTs4UjLw5MM6OjgkjFeUxCYH"}
                        ]
                    },
                    "fastapi": {
                        "name": "FastAPI",
                        "category": "Backend",
                        "description": "Modern, fast web framework for building APIs with Python",
                        "learning_resources": [
                            {"title": "FastAPI Tutorial", "url": "https://www.youtube.com/watch?v=7t2alSnE2-I"}
                        ]
                    },
                    "pandas": {
                        "name": "Pandas",
                        "category": "Data Science",
                        "description": "Data analysis and manipulation library",
                        "learning_resources": [
                            {"title": "Pandas Tutorial", "url": "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS"}
                        ]
                    },
                    "numpy": {
                        "name": "NumPy",
                        "category": "Data Science",
                        "description": "Scientific computing library",
                        "learning_resources": [
                            {"title": "NumPy Tutorial", "url": "https://www.youtube.com/watch?v=QUT1VHiLmmI"}
                        ]
                    },
                    "tensorflow": {
                        "name": "TensorFlow",
                        "category": "Machine Learning",
                        "description": "Machine learning framework",
                        "learning_resources": [
                            {"title": "TensorFlow Tutorial", "url": "https://www.youtube.com/playlist?list=PLhhyoLH6IjfxVOdVC1P1L5z5azs0XjMsb"}
                        ]
                    },
                    "pytorch": {
                        "name": "PyTorch",
                        "category": "Machine Learning",
                        "description": "Machine learning framework",
                        "learning_resources": [
                            {"title": "PyTorch Tutorial", "url": "https://www.youtube.com/playlist?list=PLqnslRFeH2UrcDBWF5mfPGpqQDSta6VK4"}
                        ]
                    }
                }
            },
            "JavaScript": {
                "category": "Frontend",
                "libraries": {
                    "react": {
                        "name": "React",
                        "category": "Frontend",
                        "description": "JavaScript library for building user interfaces",
                        "learning_resources": [
                            {"title": "React Tutorial", "url": "https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3"}
                        ]
                    },
                    "vue": {
                        "name": "Vue.js",
                        "category": "Frontend",
                        "description": "Progressive JavaScript framework",
                        "learning_resources": [
                            {"title": "Vue.js Tutorial", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gQcYgjhBoeQH7wiAyZNrYa"}
                        ]
                    },
                    "angular": {
                        "name": "Angular",
                        "category": "Frontend",
                        "description": "TypeScript-based web application framework",
                        "learning_resources": [
                            {"title": "Angular Tutorial", "url": "https://www.youtube.com/playlist?list=PLC3y8-rFHvwhBRAgFinJR8KHIrCdTkZcZ"}
                        ]
                    },
                    "express": {
                        "name": "Express.js",
                        "category": "Backend",
                        "description": "Node.js web application framework",
                        "learning_resources": [
                            {"title": "Express.js Tutorial", "url": "https://www.youtube.com/playlist?list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp"}
                        ]
                    },
                    "redux": {
                        "name": "Redux",
                        "category": "Frontend",
                        "description": "State management library",
                        "learning_resources": [
                            {"title": "Redux Tutorial", "url": "https://www.youtube.com/playlist?list=PLC3y8-rFHvwheJHvseC3I0HuYI2f46oAK"}
                        ]
                    },
                    "tailwindcss": {
                        "name": "Tailwind CSS",
                        "category": "Frontend",
                        "description": "Utility-first CSS framework",
                        "learning_resources": [
                            {"title": "Tailwind CSS Tutorial", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw"}
                        ]
                    }
                }
            }
        }
    }

def classify_skills(language: str, libraries: List[str]) -> List[SkillScore]:
    """
    Classify skills based on detected language and libraries
    
    Args:
        language: Detected programming language
        libraries: List of detected libraries
        
    Returns:
        List[SkillScore]: List of skill scores
    """
    # Load skill rules
    rules = load_skill_rules()
    
    # Initialize skills list
    skills = []
    
    # Add language skill
    language_info = rules.get("languages", {}).get(language, {})
    if language_info:
        skills.append(
            SkillScore(
                name=language,
                score=0.7,  # Default score for detected language
                category=language_info.get("category", "General"),
                description=f"{language} programming language",
                learning_resources=[
                    {"title": f"{language} Tutorial", "url": f"https://www.youtube.com/results?search_query={language}+tutorial"}
                ]
            )
        )
    
    # Add library skills
    for lib in libraries:
        lib_info = language_info.get("libraries", {}).get(lib, {})
        if lib_info:
            skills.append(
                SkillScore(
                    name=lib_info.get("name", lib),
                    score=0.6,  # Default score for detected library
                    category=lib_info.get("category", "General"),
                    description=lib_info.get("description", f"{lib} library"),
                    learning_resources=lib_info.get("learning_resources", [
                        {"title": f"{lib} Tutorial", "url": f"https://www.youtube.com/results?search_query={lib}+tutorial"}
                    ])
                )
            )
    
    # Sort skills by score (descending)
    skills.sort(key=lambda x: x.score, reverse=True)
    
    return skills
