from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from typing import Dict, List, Any, Optional
import os
import tempfile
import shutil
import json
import time
from pathlib import Path

from app.models.analysis_models import DeveloperRankResponse, SkillProgressResponse, UploadSummaryResponse
from app.utils.code_analysis import (
    calculate_cyclomatic_complexity, 
    calculate_tech_diversity, 
    determine_developer_rank,
    calculate_skill_level_distribution,
    calculate_category_average,
    analyze_upload_content,
    analyze_directory_content
)
from app.services.file_service import validate_file, process_file_upload
from app.utils.helpers import get_timestamp, clone_github_repo

# Create router
router = APIRouter(prefix="/api", tags=["analysis"])

@router.post("/developer_rank", response_model=DeveloperRankResponse)
async def developer_rank(file: UploadFile = File(...)):
    """
    Analyze a user's uploaded repo and return a developer_rank based on:
    - Cyclomatic complexity (using radon)
    - Tech stack diversity (number of detected languages/frameworks)
    
    Args:
        file: Uploaded file (.py, .js, .zip)
        
    Returns:
        DeveloperRankResponse: Developer ranking results
    """
    # Validate file
    if not validate_file(file):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Supported types: .py, .js, .jsx, .ts, .tsx, .html, .css, .java, .c, .cpp, .go, .rb, .php, .zip"
        )
    
    # Process file upload
    language_contents, error = await process_file_upload(file)
    
    # Check for errors
    if error:
        raise HTTPException(status_code=422, detail=error)
    
    # Extract libraries from language contents
    all_libraries = set()
    for language, contents in language_contents.items():
        for content in contents:
            # Simple library detection (this is a basic implementation)
            if language.lower() == "python":
                # Detect Python imports
                import_lines = [line for line in content.split('\n') if line.strip().startswith(('import ', 'from '))]
                for line in import_lines:
                    parts = line.split()
                    if len(parts) > 1:
                        lib = parts[1].split('.')[0]
                        if lib not in ['os', 'sys', 'time', 'datetime', 'math', 'random']:
                            all_libraries.add(lib)
            
            elif language.lower() in ["javascript", "typescript"]:
                # Detect JS/TS imports
                import_lines = [line for line in content.split('\n') if 'import ' in line or 'require(' in line]
                for line in import_lines:
                    if "from '" in line or 'from "' in line:
                        parts = line.split('from ')
                        if len(parts) > 1:
                            lib = parts[1].strip("'\" ;")
                            if not lib.startswith('.'):
                                all_libraries.add(lib)
                    elif 'require(' in line:
                        parts = line.split('require(')
                        if len(parts) > 1:
                            lib = parts[1].split(')')[0].strip("'\" ")
                            if not lib.startswith('.'):
                                all_libraries.add(lib)
    
    # Calculate complexity score
    complexity_score = calculate_cyclomatic_complexity(language_contents)
    
    # Calculate diversity score
    diversity_score = calculate_tech_diversity(language_contents, list(all_libraries))
    
    # Determine developer rank
    rank = determine_developer_rank(complexity_score, diversity_score)
    
    # Return response
    return DeveloperRankResponse(
        complexity_score=complexity_score,
        diversity_score=diversity_score,
        rank=rank
    )

@router.post("/skill_progress_chart", response_model=SkillProgressResponse)
async def skill_progress_chart(request: Request):
    """
    Create a skill progress chart based on the current user's analyzed skills
    
    Args:
        request: The request object containing session data
        
    Returns:
        SkillProgressResponse: Skill progress chart data
    """
    # Get session data from request state if available
    session_data = getattr(request.state, "session_data", None)
    
    # If no session data, create mock data for demonstration
    if not session_data or not session_data.get("skills"):
        # Return mock data if no skills have been analyzed yet
        return SkillProgressResponse(
            frontend_avg=65,
            backend_avg=73,
            level_distribution={
                "Beginner": 3,
                "Intermediate": 5,
                "Advanced": 1,
                "Expert": 0
            }
        )
    
    # Extract skills from session data
    skills = session_data.get("skills", [])
    
    # Calculate frontend and backend averages
    frontend_avg = calculate_category_average(skills, "Frontend")
    backend_avg = calculate_category_average(skills, "Backend")
    
    # Calculate level distribution
    level_distribution = calculate_skill_level_distribution(skills)
    
    # Return response
    return SkillProgressResponse(
        frontend_avg=frontend_avg,
        backend_avg=backend_avg,
        level_distribution=level_distribution
    )

@router.post("/upload_summary", response_model=UploadSummaryResponse)
async def upload_summary(file: UploadFile = File(...)):
    """
    Analyze uploaded file and return metadata summary
    
    Args:
        file: Uploaded file (.py, .js, .zip)
        
    Returns:
        UploadSummaryResponse: Upload analysis summary
    """
    # Start timing
    start_time = time.time()
    
    # Validate file
    if not validate_file(file):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Supported types: .py, .js, .jsx, .ts, .tsx, .html, .css, .java, .c, .cpp, .go, .rb, .php, .zip"
        )
    
    try:
        # Read file content
        content = await file.read()
        
        # Check if it's a zip file
        _, ext = os.path.splitext(file.filename)
        if ext.lower() == '.zip':
            # Create temporary directory
            temp_dir = tempfile.mkdtemp()
            
            try:
                # Create temporary file for the zip
                temp_zip = tempfile.NamedTemporaryFile(delete=False, suffix='.zip')
                temp_zip.write(content)
                temp_zip.close()
                
                # Extract zip file
                import zipfile
                with zipfile.ZipFile(temp_zip.name, 'r') as zip_ref:
                    zip_ref.extractall(temp_dir)
                
                # Analyze directory content
                total_lines, language_counts, processing_time, file_count = analyze_directory_content(temp_dir)
                
                # Clean up
                os.unlink(temp_zip.name)
                
            finally:
                # Clean up temporary directory
                shutil.rmtree(temp_dir, ignore_errors=True)
                
        else:
            # Analyze single file
            total_lines, language_counts, processing_time = analyze_upload_content(content, file.filename)
            file_count = 1
        
        # Sort languages by line count (descending)
        most_used_languages = dict(sorted(
            language_counts.items(), 
            key=lambda item: item[1], 
            reverse=True
        )[:5])  # Limit to top 5 languages
        
        # Return response
        return UploadSummaryResponse(
            total_files=file_count,
            lines_of_code=total_lines,
            most_used_languages=most_used_languages,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        # Return error response
        return UploadSummaryResponse(
            total_files=0,
            lines_of_code=0,
            most_used_languages={},
            processing_time_ms=(time.time() - start_time) * 1000,
            error=str(e)
        )
    finally:
        # Reset file pointer
        await file.seek(0)
