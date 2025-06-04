from fastapi import APIRouter, HTTPException
from typing import Dict

from app.models.feedback_model import FeedbackModel
from app.services.email_service import EmailService

# Create router
router = APIRouter(prefix="/feedback", tags=["feedback"])

# Initialize email service
email_service = EmailService()

@router.post("")
async def submit_feedback(feedback: FeedbackModel) -> Dict[str, str]:
    """
    Submit user feedback
    
    Args:
        feedback: Feedback data
        
    Returns:
        Dict[str, str]: Response message
    """
    # Convert model to dict
    feedback_data = feedback.model_dump()
    
    # Send email
    error = email_service.send_feedback_email(feedback_data)
    
    # Check for errors
    if error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send feedback: {error}"
        )
    
    # Return success response
    return {"message": "Feedback received. Thank you for your input!"}
