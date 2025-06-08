# PowerShell script to start both frontend and backend servers for SkillLens development

# Function to check if a command exists
function Test-Command {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    } catch {
        return $false
    }
    finally {
        $ErrorActionPreference = $oldPreference
    }
}

# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    
    $connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | 
                   Where-Object { $_.LocalPort -eq $port }
    
    return ($null -ne $connections)
}

Write-Host "Starting SkillLens development servers..." -ForegroundColor Cyan

# Check if ports are already in use
$frontendPort = 5173 # Vite default port
$backendPort = 8000  # FastAPI default port

if (Test-PortInUse -port $frontendPort) {
    Write-Host "Warning: Port $frontendPort is already in use. The frontend server may fail to start." -ForegroundColor Yellow
}

if (Test-PortInUse -port $backendPort) {
    Write-Host "Warning: Port $backendPort is already in use. The backend server may fail to start." -ForegroundColor Yellow
}

# Start backend server in a new terminal
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; if (-not (Test-Path venv)) { python -m venv venv }; .\venv\Scripts\activate; pip install -r requirements.txt; Write-Host 'Starting FastAPI server on http://localhost:8000' -ForegroundColor Cyan; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment to ensure backend starts first
Start-Sleep -Seconds 2

# Start frontend server in a new terminal
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm install; Write-Host 'Starting Vite dev server' -ForegroundColor Cyan; npm run dev"

Write-Host "Development servers started in separate windows!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers when done." -ForegroundColor Yellow
