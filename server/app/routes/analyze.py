from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional
from datetime import datetime

from app.models.skill_models import AnalysisRequest, AnalysisResponse, SkillScore
from app.services.file_service import validate_file, save_upload
from app.services.parser import CodeParser
from app.core.score import SkillScorer
from app.utils.helpers import get_timestamp

# Create router
router = APIRouter(prefix="/analyze", tags=["analyze"])

# Initialize parser and scorer
parser = CodeParser()
scorer = SkillScorer()

@router.post("/file", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    """
    Analyze uploaded code file
    
    Args:
        file: Uploaded file (.py, .js, .zip)
        
    Returns:
        AnalysisResponse: Analysis results
    """
    # Validate file
    if not validate_file(file):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Supported types: .py, .js, .jsx, .ts, .tsx, .html, .css, .zip"
        )
    
    # Parse file
    language_libraries, error = await parser.parse_upload(file)
    
    # Check for errors
    if error:
        return AnalysisResponse(
            filename=file.filename,
            language="Unknown",
            libraries=[],
            skills=[],
            recommendations=[],
            error=error,
            timestamp=get_timestamp()
        )
    
    # Score skills
    skills = scorer.score_skills(language_libraries)
    
    # Get primary language
    primary_language = next(iter(language_libraries.keys())) if language_libraries else "Unknown"
    
    # Get all libraries
    all_libraries = []
    for libs in language_libraries.values():
        all_libraries.extend(libs)
    
    # Get recommendations (top 3 skills)
    recommendations = [skill.name for skill in skills[:3]] if skills else []
    
    # Create response
    return AnalysisResponse(
        filename=file.filename,
        language=primary_language,
        libraries=sorted(all_libraries),
        skills=skills,
        recommendations=recommendations,
        timestamp=get_timestamp()
    )

@router.post("/github", response_model=AnalysisResponse)
async def analyze_github(request: AnalysisRequest):
    """
    Analyze GitHub repository
    
    Args:
        request: Analysis request with repository URL
        
    Returns:
        AnalysisResponse: Analysis results
    """
    # Parse GitHub repository
    language_libraries, error = parser.parse_github_repo(
        repo_url=str(request.repository_url),
        branch=request.branch
    )
    
    # Extract repository name from URL
    repo_name = str(request.repository_url).split("/")[-1]
    if repo_name.endswith(".git"):
        repo_name = repo_name[:-4]
    
    # Check for errors
    if error:
        return AnalysisResponse(
            filename=repo_name,
            language="Unknown",
            libraries=[],
            skills=[],
            recommendations=[],
            error=error,
            timestamp=get_timestamp()
        )
    
    # Score skills
    skills = scorer.score_skills(language_libraries)
    
    # Get primary language
    primary_language = next(iter(language_libraries.keys())) if language_libraries else "Unknown"
    
    # Get all libraries
    all_libraries = []
    for libs in language_libraries.values():
        all_libraries.extend(libs)
    
    # Get recommendations (top 3 skills)
    recommendations = [skill.name for skill in skills[:3]] if skills else []
    
    # Create response
    return AnalysisResponse(
        filename=repo_name,
        language=primary_language,
        libraries=sorted(all_libraries),
        skills=skills,
        recommendations=recommendations,
        timestamp=get_timestamp()
    )
