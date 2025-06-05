from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from typing import Dict, List, Any, Optional
import os
import tempfile
import shutil
import json
from pathlib import Path

from app.models.skill_models import AnalysisRequest, AnalysisResponse, SkillScore
from app.services.file_service import validate_file, save_upload, process_file_upload
from app.services.parser import parse_github_repo
from app.services.cache_service import CacheService
from app.core.skills import SkillExtractor
from app.core.resources import ResourceManager
from app.utils.helpers import clone_github_repo, get_file_paths, get_timestamp

# Create router
router = APIRouter(prefix="/analyze", tags=["analyze"])

# Initialize skill extractor, resource manager, and cache service
skill_extractor = SkillExtractor()
resource_manager = ResourceManager()
cache_service = CacheService(cache_expiry=3600)  # 1 hour cache expiry

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
            detail="Invalid file type. Supported types: .py, .js, .jsx, .ts, .tsx, .html, .css, .java, .c, .cpp, .go, .rb, .php, .zip"
        )
    
    # Process file upload
    language_contents, error = await process_file_upload(file)
    
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
    
    # Extract skills from each file content
    all_skills = {}
    primary_language = "Unknown"
    all_libraries = set()
    
    # Process each language and its file contents
    for language, contents in language_contents.items():
        # Set primary language to the first one found
        if primary_language == "Unknown":
            primary_language = language
        
        # Process each file content
        for content in contents:
            # Extract skills from content
            file_skills = skill_extractor.extract_skills(content, f".{language.lower()}")
            
            # Merge skills
            for skill, score in file_skills.items():
                if skill in all_skills:
                    all_skills[skill] = max(all_skills[skill], score)
                else:
                    all_skills[skill] = score
                
                # Add to libraries if not a language itself
                if skill.lower() != language.lower():
                    all_libraries.add(skill)
    
    # Create skill score objects
    skill_scores = []
    for skill_name, score in all_skills.items():
        # Get skill info
        skill_info = resource_manager.get_skill_info(skill_name)
        
        skill_scores.append(
            SkillScore(
                name=skill_name.title(),
                score=score,
                category=skill_info.get("category", "Other"),
                description=skill_info.get("description", f"{skill_name.title()} programming skill"),
                learning_resources=skill_info.get("resources", [])
            )
        )
    
    # Sort skills by score (descending)
    skill_scores.sort(key=lambda x: x.score, reverse=True)
    
    # Get recommendations (top 3 skills)
    recommendations = [skill.name for skill in skill_scores[:3]] if skill_scores else []
    
    # Create response
    return AnalysisResponse(
        filename=file.filename,
        language=primary_language,
        libraries=sorted(list(all_libraries)),
        skills=skill_scores,
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
    # Extract repository name from URL
    repo_name = str(request.repository_url).split("/")[-1]
    if repo_name.endswith(".git"):
        repo_name = repo_name[:-4]
        
    # Generate cache key from repository URL and branch
    cache_key = cache_service.get_cache_key(f"{request.repository_url}:{request.branch}")
    
    # Check if result is cached
    cached_result = cache_service.get_cached_result(cache_key)
    if cached_result:
        # Return cached result
        return AnalysisResponse(**cached_result)
    
    # Clone GitHub repository
    repo_dir, error = clone_github_repo(
        repo_url=str(request.repository_url),
        branch=request.branch
    )
    
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
    
    # Get file paths from repository
    from app.services.file_service import ALLOWED_EXTENSIONS
    file_paths = get_file_paths(repo_dir, ALLOWED_EXTENSIONS)
    
    # Process files
    language_contents = {}
    for file_path in file_paths:
        # Get file extension
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        
        # Skip zip files
        if ext == '.zip':
            continue
        
        # Get language
        from app.services.file_service import get_language_from_extension
        language = get_language_from_extension(ext)
        
        # Initialize language entry
        if language not in language_contents:
            language_contents[language] = []
        
        # Read file content
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                language_contents[language].append(f.read())
        except Exception:
            # Skip files that can't be read
            continue
    
    # Extract skills from each file content
    all_skills = {}
    primary_language = "Unknown"
    all_libraries = set()
    
    # Process each language and its file contents
    for language, contents in language_contents.items():
        # Set primary language to the first one found
        if primary_language == "Unknown":
            primary_language = language
        
        # Process each file content
        for content in contents:
            # Extract skills from content
            file_skills = skill_extractor.extract_skills(content, f".{language.lower()}")
            
            # Merge skills
            for skill, score in file_skills.items():
                if skill in all_skills:
                    all_skills[skill] = max(all_skills[skill], score)
                else:
                    all_skills[skill] = score
                
                # Add to libraries if not a language itself
                if skill.lower() != language.lower():
                    all_libraries.add(skill)
    
    # Create skill score objects
    skill_scores = []
    for skill_name, score in all_skills.items():
        # Get skill info
        skill_info = resource_manager.get_skill_info(skill_name)
        
        skill_scores.append(
            SkillScore(
                name=skill_name.title(),
                score=score,
                category=skill_info.get("category", "Other"),
                description=skill_info.get("description", f"{skill_name.title()} programming skill"),
                learning_resources=skill_info.get("resources", [])
            )
        )
    
    # Sort skills by score (descending)
    skill_scores.sort(key=lambda x: x.score, reverse=True)
    
    # Get recommendations (top 3 skills)
    recommendations = [skill.name for skill in skill_scores[:3]] if skill_scores else []
    
    # Create response
    response = AnalysisResponse(
        filename=repo_name,
        language=primary_language,
        libraries=sorted(list(all_libraries)),
        skills=skill_scores,
        recommendations=recommendations,
        timestamp=get_timestamp()
    )
    
    # Cache the result
    cache_service.cache_result(cache_key, response.dict())
    
    return response
