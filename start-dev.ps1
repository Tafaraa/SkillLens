# PowerShell script to start both frontend and backend servers

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

Write-Host "Starting SkillLens development servers..." -ForegroundColor Cyan

# Start backend server in a new terminal
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; python -m venv venv; .\venv\Scripts\activate; pip install -r requirements.txt; uvicorn app.main:app --reload"

# Wait a moment to ensure backend starts first
Start-Sleep -Seconds 2

# Start frontend server in a new terminal
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm install; npm run dev"

Write-Host "Development servers started!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
