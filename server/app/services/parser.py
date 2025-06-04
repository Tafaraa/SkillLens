import os
import re
import zipfile
import tempfile
from typing import Dict, List, Set, Tuple, Optional
from pathlib import Path
from fastapi import UploadFile

from app.services.file_service import extract_zip, ALLOWED_EXTENSIONS
from app.utils.helpers import get_file_paths, clone_github_repo

class CodeParser:
    """Parser for code files and repositories"""
    
    def __init__(self):
        # Patterns for detecting libraries
        self.patterns = {
            "Python": [
                r'import\s+(\w+)',
                r'from\s+(\w+)(?:\.\w+)?\s+import',
                r'import\s+(\w+)\s+as\s+\w+',
            ],
            "JavaScript": [
                r'import\s+.*\s+from\s+[\'"]([^\.][^\'"/]+)[\'"]',
                r'import\s+[\'"]([^\.][^\'"/]+)[\'"]',
                r'require\([\'"]([^\.][^\'"/]+)[\'"]\)',
            ],
            "TypeScript": [
                r'import\s+.*\s+from\s+[\'"]([^\.][^\'"/]+)[\'"]',
                r'import\s+[\'"]([^\.][^\'"/]+)[\'"]',
            ]
        }
        
        # Standard libraries to exclude
        self.standard_libs = {
            "Python": {'os', 'sys', 're', 'json', 'time', 'datetime', 'math', 'random', 'typing', 'pathlib', 'collections'},
            "JavaScript": {'path', 'fs', 'util', 'http', 'https', 'url', 'querystring', 'crypto'},
            "TypeScript": {'path', 'fs', 'util', 'http', 'https', 'url', 'querystring', 'crypto'},
        }
    
    async def parse_upload(self, file: UploadFile) -> Tuple[Dict[str, List[str]], Optional[str]]:
        """
        Parse uploaded file
        
        Args:
            file: Uploaded file
            
        Returns:
            Tuple[Dict[str, List[str]], Optional[str]]: Dictionary of languages and libraries, and error if any
        """
        # Get file extension
        _, ext = os.path.splitext(file.filename)
        ext = ext.lower()
        
        try:
            if ext == '.zip':
                # Handle ZIP file
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.zip')
                with temp_file as f:
                    content = await file.read()
                    f.write(content)
                
                # Extract ZIP file
                extract_dir = tempfile.mkdtemp()
                file_paths = extract_zip(temp_file.name, extract_dir)
                
                # Parse extracted files
                results = self._parse_files(file_paths)
                
                # Clean up
                os.unlink(temp_file.name)
                
                return results, None
            else:
                # Handle single file
                content = await file.read()
                content_str = content.decode('utf-8', errors='ignore')
                
                # Determine language
                language = self._get_language_from_ext(ext)
                
                # Parse libraries
                libraries = self._parse_content(content_str, language)
                
                return {language: libraries}, None
        
        except Exception as e:
            return {}, f"Error parsing file: {str(e)}"
    
    def parse_github_repo(self, repo_url: str, branch: str = "main") -> Tuple[Dict[str, List[str]], Optional[str]]:
        """
        Parse GitHub repository
        
        Args:
            repo_url: GitHub repository URL
            branch: Branch to parse
            
        Returns:
            Tuple[Dict[str, List[str]], Optional[str]]: Dictionary of languages and libraries, and error if any
        """
        # Clone repository
        repo_dir, error = clone_github_repo(repo_url, branch)
        if error:
            return {}, error
        
        # Get file paths
        file_paths = get_file_paths(repo_dir, ALLOWED_EXTENSIONS)
        
        # Parse files
        results = self._parse_files(file_paths)
        
        return results, None
    
    def _parse_files(self, file_paths: List[str]) -> Dict[str, List[str]]:
        """
        Parse multiple files
        
        Args:
            file_paths: List of file paths
            
        Returns:
            Dict[str, List[str]]: Dictionary of languages and libraries
        """
        results = {}
        
        for file_path in file_paths:
            # Get file extension
            _, ext = os.path.splitext(file_path)
            ext = ext.lower()
            
            # Determine language
            language = self._get_language_from_ext(ext)
            
            # Read file content
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Parse libraries
                libraries = self._parse_content(content, language)
                
                # Add to results
                if language in results:
                    results[language].extend(libraries)
                else:
                    results[language] = libraries
            except:
                # Skip files that can't be read
                continue
        
        # Remove duplicates
        for language in results:
            results[language] = list(set(results[language]))
        
        return results
    
    def _get_language_from_ext(self, ext: str) -> str:
        """
        Get language from file extension
        
        Args:
            ext: File extension
            
        Returns:
            str: Language name
        """
        language_map = {
            '.py': 'Python',
            '.js': 'JavaScript',
            '.jsx': 'JavaScript',
            '.ts': 'TypeScript',
            '.tsx': 'TypeScript',
            '.html': 'HTML',
            '.css': 'CSS',
        }
        
        return language_map.get(ext, 'Unknown')
    
    def _parse_content(self, content: str, language: str) -> List[str]:
        """
        Parse content for libraries
        
        Args:
            content: File content
            language: Programming language
            
        Returns:
            List[str]: List of libraries
        """
        libraries = set()
        
        # Get patterns for language
        patterns = self.patterns.get(language, [])
        
        # Find libraries
        for pattern in patterns:
            for match in re.finditer(pattern, content):
                lib = match.group(1)
                if lib not in self.standard_libs.get(language, set()):
                    libraries.add(lib)
        
        # Special case for React
        if language in ['JavaScript', 'TypeScript']:
            if 'import React' in content or 'from \'react\'' in content or 'from "react"' in content:
                libraries.add('react')
        
        return list(libraries)
