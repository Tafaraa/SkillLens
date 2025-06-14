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
from app.routes import analyze, feedback, resources, skills, analysis

# Create FastAPI app
app = FastAPI(
    title="SkillLens API",
    description="API for analyzing code and identifying developer skills",
    version="0.1.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS")
if origins:
    origins = [origin.strip() for origin in origins.split(",") if origin.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5176",
        "https://skill-lens.vercel.app/"
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
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "message": "Server is running"}

# Include routers
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(analyze.api_router, prefix="/api", tags=["api"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(resources.router, prefix="/resources", tags=["resources"])
app.include_router(skills.router, prefix="/skills", tags=["skills"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
