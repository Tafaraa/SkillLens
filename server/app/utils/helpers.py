import os
import re
import requests
import tempfile
import zipfile
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from pathlib import Path

def get_timestamp() -> str:
    """
    Get current timestamp in ISO format
    
    Returns:
        str: Current timestamp
    """
    return datetime.now().isoformat()

def clone_github_repo(repo_url: str, branch: str = "main") -> Tuple[str, Optional[str]]:
    """
    Clone a GitHub repository using HTTP requests (no git required)
    
    Args:
        repo_url: GitHub repository URL
        branch: Branch to clone
        
    Returns:
        Tuple[str, Optional[str]]: Path to cloned repo and error message if any
    """
    # Extract owner and repo name from URL
    # Example: https://github.com/owner/repo
    match = re.match(r'https://github.com/([^/]+)/([^/]+)', repo_url)
    if not match:
        return None, "Invalid GitHub repository URL"
    
    owner, repo = match.groups()
    repo = repo.rstrip('.git')
    
    # Create archive URL
    archive_url = f"https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip"
    
    try:
        # Download repository as ZIP
        response = requests.get(archive_url, stream=True)
        if response.status_code != 200:
            return None, f"Failed to download repository: HTTP {response.status_code}"
        
        # Save ZIP file
        temp_zip = tempfile.NamedTemporaryFile(delete=False, suffix='.zip')
        with temp_zip as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Extract ZIP file
        extract_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(temp_zip.name, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        
        # Clean up ZIP file
        os.unlink(temp_zip.name)
        
        # Return path to extracted repo
        repo_dir = os.path.join(extract_dir, f"{repo}-{branch}")
        return repo_dir, None
    
    except Exception as e:
        return None, f"Error cloning repository: {str(e)}"

def get_file_paths(directory: str, allowed_extensions: set) -> List[str]:
    """
    Get paths to all files with allowed extensions in a directory
    
    Args:
        directory: Directory to search in
        allowed_extensions: Set of allowed file extensions
        
    Returns:
        List[str]: Paths to files
    """
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            _, ext = os.path.splitext(file)
            if ext.lower() in allowed_extensions:
                file_paths.append(os.path.join(root, file))
    
    return file_paths

def calculate_skill_scores(skills_count: Dict[str, int], total_matches: int) -> Dict[str, int]:
    """
    Calculate skill scores based on matches
    
    Args:
        skills_count: Dictionary of skill counts
        total_matches: Total number of matches
        
    Returns:
        Dict[str, int]: Dictionary of skill scores (0-100)
    """
    if total_matches == 0:
        return {skill: 0 for skill in skills_count}
    
    # Calculate scores as percentages (0-100)
    return {
        skill: min(100, int((count / total_matches) * 100))
        for skill, count in skills_count.items()
    }
