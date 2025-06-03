from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from pathlib import Path
import json
from typing import List, Optional

# Import local modules
from app.models.skill_models import AnalysisRequest, AnalysisResponse, SkillScore
from app.services.file_service import save_upload, validate_file
from app.core.analyzer import analyze_code
from app.core.skill_classifier import classify_skills

# Create FastAPI app
app = FastAPI(
    title="SkillLens API",
    description="API for analyzing code and identifying developer skills",
    version="0.1.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port
    # Add your production domain here when deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=600,
)

# Add request size limiter middleware
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    # 5MB limit (5 * 1024 * 1024 bytes)
    if request.method == "POST":
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > 5 * 1024 * 1024:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request too large. Maximum size is 5MB."}
            )
    response = await call_next(request)
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# File upload endpoint
@app.post("/analyze/file", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    """
    Upload a code file for analysis
    """
    # Validate file
    if not validate_file(file):
        raise HTTPException(status_code=400, detail="Invalid file type. Supported types: .py, .js, .zip")
    
    # Save file temporarily
    file_path = await save_upload(file)
    
    try:
        # Analyze code
        language, libraries = analyze_code(file_path)
        
        # Classify skills
        skills = classify_skills(language, libraries)
        
        # Create response
        return AnalysisResponse(
            filename=file.filename,
            language=language,
            libraries=libraries,
            skills=skills,
            recommendations=[skill.name for skill in skills[:3]]  # Top 3 skills to improve
        )
    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

# GitHub repository analysis endpoint
@app.post("/analyze/github", response_model=AnalysisResponse)
async def analyze_github(request: AnalysisRequest):
    """
    Analyze a GitHub repository
    """
    # This would be implemented to fetch code from GitHub
    # For now, return a placeholder response
    return AnalysisResponse(
        filename=request.repository_url.split("/")[-1],
        language="Not implemented",
        libraries=[],
        skills=[],
        recommendations=["GitHub analysis not yet implemented"]
    )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
