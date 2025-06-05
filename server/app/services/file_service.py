import os
import shutil
import tempfile
import zipfile
from pathlib import Path
from fastapi import UploadFile
from typing import List, Optional, Dict, Tuple

# Allowed file extensions
ALLOWED_EXTENSIONS = {'.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.java', '.c', '.cpp', '.go', '.rb', '.php', '.zip'}

def validate_file(file: UploadFile) -> bool:
    """
    Validate if the uploaded file has an allowed extension
    
    Args:
        file: The uploaded file
        
    Returns:
        bool: True if file is valid, False otherwise
    """
    # Extract file extension
    _, ext = os.path.splitext(file.filename)
    
    # Check if extension is allowed
    return ext.lower() in ALLOWED_EXTENSIONS

async def save_upload(file: UploadFile) -> str:
    """
    Save uploaded file to a temporary location
    
    Args:
        file: The uploaded file
        
    Returns:
        str: Path to the saved file
    """
    # Create temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
    
    try:
        # Write file contents
        content = await file.read()
        with temp_file as f:
            f.write(content)
        
        # Return path to saved file
        return temp_file.name
    finally:
        # Reset file pointer
        await file.seek(0)
        
def extract_zip(zip_path: str, extract_dir: Optional[str] = None) -> List[str]:
    """
    Extract zip file and return paths to extracted files
    
    Args:
        zip_path: Path to the zip file
        extract_dir: Directory to extract files to (optional)
        
    Returns:
        List[str]: Paths to extracted files
    """
    # Create temporary directory if not provided
    if extract_dir is None:
        extract_dir = tempfile.mkdtemp()
    
    # Extract zip file
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    
    # Get paths to extracted files
    file_paths = []
    for root, _, files in os.walk(extract_dir):
        for file in files:
            _, ext = os.path.splitext(file)
            if ext.lower() in ALLOWED_EXTENSIONS:
                file_paths.append(os.path.join(root, file))
    
    return file_paths

async def process_file_upload(file: UploadFile) -> Tuple[Dict[str, List[str]], Optional[str]]:
    """
    Process uploaded file and extract code content
    
    Args:
        file: The uploaded file
        
    Returns:
        Tuple[Dict[str, List[str]], Optional[str]]: Dictionary of languages and file contents, and error if any
    """
    try:
        # Get file extension
        _, ext = os.path.splitext(file.filename)
        ext = ext.lower()
        
        if ext == '.zip':
            # Handle ZIP file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.zip')
            content = await file.read()
            
            with temp_file as f:
                f.write(content)
            
            # Extract ZIP file
            extract_dir = tempfile.mkdtemp()
            file_paths = extract_zip(temp_file.name, extract_dir)
            
            # Read file contents
            result = {}
            for file_path in file_paths:
                _, file_ext = os.path.splitext(file_path)
                language = get_language_from_extension(file_ext)
                
                if language not in result:
                    result[language] = []
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        result[language].append(f.read())
                except Exception:
                    # Skip files that can't be read
                    pass
            
            # Clean up
            os.unlink(temp_file.name)
            
            return result, None
        else:
            # Handle single file
            content = await file.read()
            content_str = content.decode('utf-8', errors='ignore')
            
            # Determine language
            language = get_language_from_extension(ext)
            
            return {language: [content_str]}, None
    
    except Exception as e:
        return {}, f"Error processing file: {str(e)}"

def get_language_from_extension(ext: str) -> str:
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
        '.java': 'Java',
        '.c': 'C',
        '.cpp': 'C++',
        '.go': 'Go',
        '.rb': 'Ruby',
        '.php': 'PHP',
    }
    
    return language_map.get(ext.lower(), 'Unknown')
