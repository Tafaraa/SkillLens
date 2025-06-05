"""
Routes for learning resources
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any

from app.core.resources import ResourceManager

# Create router
router = APIRouter(prefix="/resources", tags=["resources"])

# Initialize resource manager
resource_manager = ResourceManager()

@router.get("/{skill_name}")
async def get_resources(skill_name: str) -> Dict[str, Any]:
    """
    Get learning resources for a skill
    
    Args:
        skill_name: Name of the skill
        
    Returns:
        Dict[str, Any]: Skill information with resources
    """
    # Get skill info
    skill_info = resource_manager.get_skill_info(skill_name)
    
    # Return skill info
    return skill_info

@router.get("/")
async def get_all_skills() -> Dict[str, List[Dict[str, str]]]:
    """
    Get all available skills grouped by category
    
    Returns:
        Dict[str, List[Dict[str, str]]]: Skills grouped by category
    """
    # Get all skills from resource manager
    skills_by_category = {}
    
    # Load resources
    resources = resource_manager._load_resources()
    
    # Group skills by category
    for skill_name, skill_info in resources.items():
        category = skill_info.get("category", "Other")
        
        if category not in skills_by_category:
            skills_by_category[category] = []
        
        skills_by_category[category].append({
            "name": skill_info.get("name", skill_name.title()),
            "description": skill_info.get("description", f"{skill_name.title()} programming skill")
        })
    
    # Return skills by category
    return {"categories": skills_by_category}
