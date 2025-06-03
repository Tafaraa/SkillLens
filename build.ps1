# PowerShell script to build the SkillLens application for production

Write-Host "Building SkillLens for production..." -ForegroundColor Cyan

# Create dist directory if it doesn't exist
if (-not (Test-Path -Path "$PSScriptRoot\dist")) {
    New-Item -ItemType Directory -Path "$PSScriptRoot\dist" | Out-Null
}

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\client"
npm install
npm run build

# Copy frontend build to dist
Write-Host "Copying frontend build to dist..." -ForegroundColor Green
Copy-Item -Path "$PSScriptRoot\client\dist\*" -Destination "$PSScriptRoot\dist\client" -Recurse -Force

# Prepare backend
Write-Host "Preparing backend..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\server"
Copy-Item -Path "$PSScriptRoot\server\*" -Destination "$PSScriptRoot\dist\server" -Recurse -Force -Exclude "venv", "__pycache__", "*.pyc"

# Copy analysis folder
Write-Host "Copying analysis folder..." -ForegroundColor Green
Copy-Item -Path "$PSScriptRoot\analysis" -Destination "$PSScriptRoot\dist\analysis" -Recurse -Force

# Copy README and other important files
Write-Host "Copying documentation..." -ForegroundColor Green
Copy-Item -Path "$PSScriptRoot\README.md" -Destination "$PSScriptRoot\dist\" -Force
Copy-Item -Path "$PSScriptRoot\SECURITY.md" -Destination "$PSScriptRoot\dist\" -Force

Write-Host "Build completed successfully!" -ForegroundColor Cyan
Write-Host "Production files are available in the 'dist' directory." -ForegroundColor Yellow
