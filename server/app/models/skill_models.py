from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Dict
from datetime import datetime

class SkillScore(BaseModel):
    """Model for individual skill scores"""
    name: str
    score: float = Field(..., ge=0.0, le=1.0)  # Score between 0 and 1
    category: str  # e.g., "Frontend", "Backend", "DevOps"
    description: Optional[str] = None
    learning_resources: Optional[List[Dict[str, str]]] = None  # List of resources with title and url

class AnalysisRequest(BaseModel):
    """Model for GitHub repository analysis request"""
    repository_url: HttpUrl
    branch: Optional[str] = "main"
    depth: Optional[int] = Field(1, ge=1, le=3)  # How deep to analyze (1-3)

class AnalysisResponse(BaseModel):
    """Model for analysis response"""
    filename: str
    language: str
    libraries: List[str]
    skills: List[SkillScore]
    recommendations: List[str]
    error: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
