"""
Skill extraction logic for code analysis
"""
import re
from typing import Dict, List, Set, Optional

class SkillExtractor:
    """
    Extracts skills from code files based on patterns and signatures
    """
    
    def __init__(self):
        # Define patterns for different languages and frameworks
        self.patterns = {
            # Python patterns
            "python": {
                "pandas": [r'import\s+pandas', r'from\s+pandas', r'DataFrame'],
                "numpy": [r'import\s+numpy', r'from\s+numpy', r'np\.'],
                "flask": [r'from\s+flask', r'Flask\(', r'app\.route'],
                "django": [r'from\s+django', r'urls\.py', r'models\.Model'],
                "fastapi": [r'from\s+fastapi', r'FastAPI\(', r'@app\.'],
                "tensorflow": [r'import\s+tensorflow', r'from\s+tensorflow', r'tf\.'],
                "pytorch": [r'import\s+torch', r'from\s+torch', r'nn\.Module'],
                "scikit-learn": [r'from\s+sklearn', r'import\s+sklearn'],
                "matplotlib": [r'import\s+matplotlib', r'from\s+matplotlib', r'plt\.'],
                "seaborn": [r'import\s+seaborn', r'from\s+seaborn', r'sns\.'],
            },
            
            # JavaScript/TypeScript patterns
            "javascript": {
                "react": [r'import\s+.*\s+from\s+[\'"]react[\'"]', r'React\.', r'useState', r'useEffect', r'<\w+\s+', r'<\/\w+>'],
                "vue": [r'import\s+.*\s+from\s+[\'"]vue[\'"]', r'createApp', r'Vue\.'],
                "angular": [r'import\s+.*\s+from\s+[\'"]@angular', r'NgModule', r'Component'],
                "express": [r'import\s+.*\s+from\s+[\'"]express[\'"]', r'require\([\'"]express[\'"]\)', r'app\.get', r'app\.post'],
                "node": [r'import\s+.*\s+from\s+[\'"]node:', r'require\([\'"]node:', r'process\.env'],
                "next": [r'import\s+.*\s+from\s+[\'"]next', r'NextPage', r'getServerSideProps'],
                "mongodb": [r'import\s+.*\s+from\s+[\'"]mongodb[\'"]', r'MongoClient', r'ObjectId'],
                "mongoose": [r'import\s+.*\s+from\s+[\'"]mongoose[\'"]', r'Schema', r'model\('],
                "redux": [r'import\s+.*\s+from\s+[\'"]redux[\'"]', r'createStore', r'useSelector'],
                "axios": [r'import\s+.*\s+from\s+[\'"]axios[\'"]', r'axios\.'],
            },
            
            # Java patterns
            "java": {
                "spring": [r'import\s+org\.springframework', r'@Controller', r'@RestController', r'@Service'],
                "hibernate": [r'import\s+org\.hibernate', r'@Entity', r'SessionFactory'],
                "junit": [r'import\s+org\.junit', r'@Test', r'Assert\.'],
            },
            
            # HTML/CSS patterns
            "html": {
                "bootstrap": [r'class="[^"]*btn[^"]*"', r'class="[^"]*container[^"]*"', r'bootstrap\.'],
                "tailwind": [r'class="[^"]*text-\w+[^"]*"', r'class="[^"]*bg-\w+[^"]*"', r'tailwind'],
            }
        }
        
        # Define language detection patterns
        self.language_patterns = {
            "python": [r'import\s+\w+', r'from\s+\w+\s+import', r'def\s+\w+\(', r'class\s+\w+:'],
            "javascript": [r'const\s+\w+\s*=', r'let\s+\w+\s*=', r'function\s+\w+\(', r'import\s+.*\s+from'],
            "typescript": [r'interface\s+\w+', r'type\s+\w+\s*=', r'const\s+\w+:\s*\w+'],
            "java": [r'public\s+class', r'private\s+\w+\s+\w+;', r'package\s+\w+'],
            "html": [r'<!DOCTYPE\s+html>', r'<html', r'<head', r'<body'],
            "css": [r'\.\w+\s*{', r'#\w+\s*{', r'@media']
        }
        
    def detect_language(self, code: str) -> str:
        """
        Detect the programming language of the code
        
        Args:
            code: The code content
            
        Returns:
            str: Detected language
        """
        matches = {}
        
        # Count matches for each language
        for language, patterns in self.language_patterns.items():
            count = 0
            for pattern in patterns:
                count += len(re.findall(pattern, code))
            matches[language] = count
        
        # Return language with most matches
        if not matches:
            return "unknown"
        
        return max(matches.items(), key=lambda x: x[1])[0]
    
    def extract_skills(self, code: str, file_extension: Optional[str] = None) -> Dict[str, float]:
        """
        Extract skills from code
        
        Args:
            code: The code content
            file_extension: Optional file extension to help with language detection
            
        Returns:
            Dict[str, float]: Dictionary of skills and their confidence scores
        """
        # Detect language if not provided
        language = self._map_extension_to_language(file_extension) if file_extension else None
        if not language:
            language = self.detect_language(code)
        
        # Initialize skills dictionary
        skills = {}
        
        # Check for language-specific patterns
        if language in self.patterns:
            for skill, patterns in self.patterns[language].items():
                confidence = 0
                for pattern in patterns:
                    matches = re.findall(pattern, code)
                    if matches:
                        # Increase confidence based on number of matches
                        confidence += min(0.3, len(matches) * 0.05)
                
                if confidence > 0:
                    skills[skill] = min(1.0, confidence)
        
        # Add language itself as a skill
        if language != "unknown":
            skills[language] = 0.8
        
        return skills
    
    def _map_extension_to_language(self, extension: str) -> Optional[str]:
        """
        Map file extension to language
        
        Args:
            extension: File extension
            
        Returns:
            Optional[str]: Language name or None
        """
        extension = extension.lower()
        
        extension_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.java': 'java',
            '.html': 'html',
            '.css': 'css',
        }
        
        return extension_map.get(extension)
