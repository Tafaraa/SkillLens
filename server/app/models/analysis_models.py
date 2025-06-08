from pydantic import BaseModel, Field
from typing import Dict, Optional

class DeveloperRankResponse(BaseModel):
    """Model for developer ranking response"""
    complexity_score: float = Field(..., description="Average cyclomatic complexity score")
    diversity_score: int = Field(..., description="Number of detected languages/frameworks")
    rank: str = Field(..., description="Developer rank based on scores")

class SkillProgressResponse(BaseModel):
    """Model for skill progress chart response"""
    frontend_avg: int = Field(..., description="Average frontend skill score (0-100)")
    backend_avg: int = Field(..., description="Average backend skill score (0-100)")
    level_distribution: Dict[str, int] = Field(
        ..., 
        description="Distribution of skill levels (Beginner, Intermediate, Advanced, Expert)"
    )

class UploadSummaryResponse(BaseModel):
    """Model for upload analysis summary response"""
    total_files: int = Field(..., description="Total number of files analyzed")
    lines_of_code: int = Field(..., description="Total lines of code")
    most_used_languages: Dict[str, int] = Field(
        ..., 
        description="Most used languages with line counts"
    )
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
    error: Optional[str] = None
