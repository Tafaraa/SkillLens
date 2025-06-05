"""
Routes for skills
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any

from app.core.resources import ResourceManager

# Create router
router = APIRouter(prefix="/skills", tags=["skills"])

# Initialize resource manager
resource_manager = ResourceManager()

@router.get("/")
async def get_all_skills() -> Dict[str, List[Dict[str, Any]]]:
    """
    Get all available skills
    
    Returns:
        Dict[str, List[Dict[str, Any]]]: List of skills with details
    """
    # Load resources
    resources = resource_manager._load_resources()
    
    # Create skills list
    skills = []
    for skill_name, skill_info in resources.items():
        skills.append({
            "name": skill_info.get("name", skill_name.title()),
            "category": skill_info.get("category", "Other"),
            "description": skill_info.get("description", f"{skill_name.title()} programming skill")
        })
    
    # Sort skills by name
    skills.sort(key=lambda x: x["name"])
    
    return {"skills": skills}

@router.get("/categories")
async def get_skill_categories() -> Dict[str, List[Dict[str, Any]]]:
    """
    Get skills grouped by category
    
    Returns:
        Dict[str, List[Dict[str, Any]]]: Skills grouped by category
    """
    # Load resources
    resources = resource_manager._load_resources()
    
    # Group skills by category
    skills_by_category = {}
    for skill_name, skill_info in resources.items():
        category = skill_info.get("category", "Other")
        
        if category not in skills_by_category:
            skills_by_category[category] = []
        
        skills_by_category[category].append({
            "name": skill_info.get("name", skill_name.title()),
            "description": skill_info.get("description", f"{skill_name.title()} programming skill")
        })
    
    # Sort skills in each category by name
    for category in skills_by_category:
        skills_by_category[category].sort(key=lambda x: x["name"])
    
    return {"categories": skills_by_category}
