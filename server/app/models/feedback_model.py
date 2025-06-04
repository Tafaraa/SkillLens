from pydantic import BaseModel, Field
from typing import Optional

class FeedbackModel(BaseModel):
    """Model for user feedback"""
    analysis_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)  # Rating from 1 to 5
    comment: Optional[str] = None
