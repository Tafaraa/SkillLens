import os
import json
from typing import Dict, List, Tuple, Any
from pathlib import Path
from app.models.skill_models import SkillScore
from app.utils.helpers import calculate_skill_scores

# Path to skill rules file
SKILL_RULES_PATH = Path(__file__).parent.parent.parent / "skill_rules.json"

class SkillScorer:
    """Scorer for programming skills"""
    
    def __init__(self):
        # Load skill rules
        self.rules = self._load_rules()
        
        # Initialize skill categories
        self.categories = {
            "Frontend": ["HTML", "CSS", "JavaScript", "TypeScript", "react", "vue", "angular", "svelte"],
            "Backend": ["Python", "Node.js", "express", "django", "flask", "fastapi"],
            "Data Science": ["pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly"],
            "Machine Learning": ["tensorflow", "pytorch", "scikit-learn", "keras"],
            "DevOps": ["docker", "kubernetes", "jenkins", "terraform", "ansible"],
            "Mobile": ["react-native", "flutter", "ionic", "swift", "kotlin"],
            "Database": ["mongodb", "mongoose", "postgresql", "mysql", "sqlite", "prisma", "sequelize"]
        }
    
    def score_skills(self, language_libraries: Dict[str, List[str]]) -> List[SkillScore]:
        """
        Score skills based on detected languages and libraries
        
        Args:
            language_libraries: Dictionary of languages and libraries
            
        Returns:
            List[SkillScore]: List of skill scores
        """
        # Initialize skill counts
        skill_counts = {}
        total_matches = 0
        
        # Process languages
        for language, libraries in language_libraries.items():
            # Add language to skill counts
            language_category = self._get_language_category(language)
            if language_category:
                skill_counts[language_category] = skill_counts.get(language_category, 0) + 3
                total_matches += 3
            
            # Process libraries
            for library in libraries:
                # Get library category
                library_category = self._get_library_category(language, library)
                if library_category:
                    skill_counts[library_category] = skill_counts.get(library_category, 0) + 1
                    total_matches += 1
        
        # Calculate scores
        skill_scores = calculate_skill_scores(skill_counts, total_matches)
        
        # Create SkillScore objects
        result = []
        for category, score in skill_scores.items():
            result.append(
                SkillScore(
                    name=category,
                    score=score / 100,  # Convert to 0-1 range
                    category=category,
                    description=f"{category} skills",
                    learning_resources=self._get_learning_resources(category)
                )
            )
        
        # Sort by score (descending)
        result.sort(key=lambda x: x.score, reverse=True)
        
        return result
    
    def _load_rules(self) -> Dict[str, Any]:
        """
        Load skill rules from JSON file
        
        Returns:
            Dict[str, Any]: Skill rules
        """
        # Check if file exists
        if not os.path.exists(SKILL_RULES_PATH):
            # Create default rules
            self._create_default_rules()
        
        # Load rules
        with open(SKILL_RULES_PATH, 'r') as f:
            return json.load(f)
    
    def _create_default_rules(self):
        """Create default skill rules file"""
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(SKILL_RULES_PATH), exist_ok=True)
        
        # Default rules
        default_rules = {
            "categories": {
                "Frontend": {
                    "description": "Frontend development skills",
                    "libraries": ["react", "vue", "angular", "svelte", "jquery"],
                    "learning_resources": [
                        {"title": "Modern JavaScript", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9haFPT7J25Q9GRB_ZkFrQAc"},
                        {"title": "React Tutorial", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d"},
                        {"title": "CSS Crash Course", "url": "https://www.youtube.com/watch?v=yfoY53QXEnI"}
                    ]
                },
                "Backend": {
                    "description": "Backend development skills",
                    "libraries": ["express", "django", "flask", "fastapi", "spring"],
                    "learning_resources": [
                        {"title": "Node.js Crash Course", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU"},
                        {"title": "Python Backend Development", "url": "https://www.youtube.com/playlist?list=PLillGF-RfqbYhQsN5WMXy6VsDMKGadrJ-"},
                        {"title": "FastAPI Tutorial", "url": "https://www.youtube.com/watch?v=7t2alSnE2-I"}
                    ]
                },
                "Data Science": {
                    "description": "Data science and analysis skills",
                    "libraries": ["pandas", "numpy", "matplotlib", "seaborn", "plotly"],
                    "learning_resources": [
                        {"title": "Data Science Full Course", "url": "https://www.youtube.com/watch?v=ua-CiDNNj30"},
                        {"title": "Pandas Tutorial", "url": "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS"},
                        {"title": "Data Visualization with Python", "url": "https://www.youtube.com/watch?v=a9UrKTVEeZA"}
                    ]
                },
                "Machine Learning": {
                    "description": "Machine learning and AI skills",
                    "libraries": ["tensorflow", "pytorch", "scikit-learn", "keras"],
                    "learning_resources": [
                        {"title": "Machine Learning Course", "url": "https://www.youtube.com/playlist?list=PLeo1K3hjS3uvCeTYTeyfe0-rN5r8zn9rw"},
                        {"title": "TensorFlow Tutorial", "url": "https://www.youtube.com/playlist?list=PLhhyoLH6IjfxVOdVC1P1L5z5azs0XjMsb"},
                        {"title": "PyTorch for Deep Learning", "url": "https://www.youtube.com/watch?v=GIsg-ZUy0MY"}
                    ]
                },
                "DevOps": {
                    "description": "DevOps and deployment skills",
                    "libraries": ["docker", "kubernetes", "jenkins", "terraform", "ansible"],
                    "learning_resources": [
                        {"title": "Docker Tutorial", "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo"},
                        {"title": "Kubernetes Tutorial", "url": "https://www.youtube.com/watch?v=X48VuDVv0do"},
                        {"title": "CI/CD Pipeline Tutorial", "url": "https://www.youtube.com/watch?v=R8_veQiYBjI"}
                    ]
                },
                "Mobile": {
                    "description": "Mobile app development skills",
                    "libraries": ["react-native", "flutter", "ionic", "swift", "kotlin"],
                    "learning_resources": [
                        {"title": "React Native Tutorial", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ"},
                        {"title": "Flutter Tutorial", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ"},
                        {"title": "iOS Development Course", "url": "https://www.youtube.com/watch?v=comQ1-x2a1Q"}
                    ]
                },
                "Database": {
                    "description": "Database and data storage skills",
                    "libraries": ["mongodb", "mongoose", "postgresql", "mysql", "sqlite", "prisma", "sequelize"],
                    "learning_resources": [
                        {"title": "SQL Tutorial", "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY"},
                        {"title": "MongoDB Tutorial", "url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA"},
                        {"title": "Database Design Course", "url": "https://www.youtube.com/watch?v=ztHopE5Wnpc"}
                    ]
                }
            },
            "languages": {
                "Python": "Backend",
                "JavaScript": "Frontend",
                "TypeScript": "Frontend",
                "HTML": "Frontend",
                "CSS": "Frontend",
                "Java": "Backend",
                "C#": "Backend",
                "PHP": "Backend",
                "Ruby": "Backend",
                "Go": "Backend",
                "Rust": "Backend",
                "Swift": "Mobile",
                "Kotlin": "Mobile"
            },
            "libraries": {
                "react": "Frontend",
                "vue": "Frontend",
                "angular": "Frontend",
                "svelte": "Frontend",
                "jquery": "Frontend",
                "express": "Backend",
                "django": "Backend",
                "flask": "Backend",
                "fastapi": "Backend",
                "spring": "Backend",
                "pandas": "Data Science",
                "numpy": "Data Science",
                "matplotlib": "Data Science",
                "seaborn": "Data Science",
                "plotly": "Data Science",
                "tensorflow": "Machine Learning",
                "pytorch": "Machine Learning",
                "scikit-learn": "Machine Learning",
                "keras": "Machine Learning",
                "docker": "DevOps",
                "kubernetes": "DevOps",
                "jenkins": "DevOps",
                "terraform": "DevOps",
                "ansible": "DevOps",
                "react-native": "Mobile",
                "flutter": "Mobile",
                "ionic": "Mobile",
                "mongodb": "Database",
                "mongoose": "Database",
                "postgresql": "Database",
                "mysql": "Database",
                "sqlite": "Database",
                "prisma": "Database",
                "sequelize": "Database"
            }
        }
        
        # Write to file
        with open(SKILL_RULES_PATH, 'w') as f:
            json.dump(default_rules, f, indent=2)
    
    def _get_language_category(self, language: str) -> str:
        """
        Get category for a language
        
        Args:
            language: Programming language
            
        Returns:
            str: Category name or None
        """
        return self.rules.get("languages", {}).get(language)
    
    def _get_library_category(self, language: str, library: str) -> str:
        """
        Get category for a library
        
        Args:
            language: Programming language
            library: Library name
            
        Returns:
            str: Category name or None
        """
        return self.rules.get("libraries", {}).get(library)
    
    def _get_learning_resources(self, category: str) -> List[Dict[str, str]]:
        """
        Get learning resources for a category
        
        Args:
            category: Skill category
            
        Returns:
            List[Dict[str, str]]: List of learning resources
        """
        return self.rules.get("categories", {}).get(category, {}).get("learning_resources", [
            {"title": f"{category} Tutorial", "url": f"https://www.youtube.com/results?search_query={category}+programming+tutorial"}
        ])
