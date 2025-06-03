import os
import re
from pathlib import Path
from typing import Tuple, List, Dict, Set

def analyze_code(file_path: str) -> Tuple[str, List[str]]:
    """
    Analyze code file to detect language and libraries used
    
    Args:
        file_path: Path to the code file
        
    Returns:
        Tuple[str, List[str]]: Detected language and list of libraries
    """
    # Get file extension
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    
    # Determine language based on extension
    language = determine_language(ext)
    
    # Read file content
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Detect libraries based on language
    libraries = detect_libraries(content, language)
    
    return language, libraries

def determine_language(ext: str) -> str:
    """
    Determine programming language based on file extension
    
    Args:
        ext: File extension
        
    Returns:
        str: Detected language
    """
    language_map = {
        '.py': 'Python',
        '.js': 'JavaScript',
        '.jsx': 'JavaScript/React',
        '.ts': 'TypeScript',
        '.tsx': 'TypeScript/React',
        '.html': 'HTML',
        '.css': 'CSS',
        '.scss': 'SCSS',
        '.sass': 'Sass',
        '.less': 'Less',
        '.php': 'PHP',
        '.java': 'Java',
        '.rb': 'Ruby',
        '.go': 'Go',
        '.rs': 'Rust',
        '.c': 'C',
        '.cpp': 'C++',
        '.cs': 'C#',
        '.swift': 'Swift',
        '.kt': 'Kotlin',
        '.dart': 'Dart',
    }
    
    return language_map.get(ext, 'Unknown')

def detect_libraries(content: str, language: str) -> List[str]:
    """
    Detect libraries used in code based on language
    
    Args:
        content: File content
        language: Programming language
        
    Returns:
        List[str]: Detected libraries
    """
    libraries = set()
    
    if language == 'Python':
        # Match import statements
        import_patterns = [
            r'import\s+(\w+)',
            r'from\s+(\w+)(?:\.\w+)?\s+import',
            r'import\s+(\w+)\s+as\s+\w+',
        ]
        
        for pattern in import_patterns:
            for match in re.finditer(pattern, content):
                lib = match.group(1)
                if lib not in ['os', 'sys', 're', 'json', 'time', 'datetime', 'math', 'random', 'typing']:
                    libraries.add(lib)
    
    elif language in ['JavaScript', 'JavaScript/React', 'TypeScript', 'TypeScript/React']:
        # Match import statements and require calls
        import_patterns = [
            r'import\s+.*\s+from\s+[\'"]([^\.][^\'"/]+)[\'"]',
            r'import\s+[\'"]([^\.][^\'"/]+)[\'"]',
            r'require\([\'"]([^\.][^\'"/]+)[\'"]\)',
        ]
        
        for pattern in import_patterns:
            for match in re.finditer(pattern, content):
                lib = match.group(1)
                libraries.add(lib)
        
        # Check for React
        if 'import React' in content or 'from \'react\'' in content or 'from "react"' in content:
            libraries.add('react')
        
        # Check for JSX
        if '</' in content and '>' in content and (language == 'JavaScript/React' or language == 'TypeScript/React'):
            libraries.add('jsx')
    
    # Convert set to sorted list
    return sorted(list(libraries))
