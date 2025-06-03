import os
import shutil
import tempfile
from pathlib import Path
from fastapi import UploadFile
from typing import List, Optional

# Allowed file extensions
ALLOWED_EXTENSIONS = {'.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.zip'}

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
        with temp_file as f:
            shutil.copyfileobj(file.file, f)
        
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
    import zipfile
    
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
