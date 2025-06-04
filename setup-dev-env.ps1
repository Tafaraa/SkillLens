param(
    [Parameter(Mandatory=$true)]
    [SecureString]$AccessPassword,
    
    [Parameter(Mandatory=$false)]
    [string]$AccessToken = [System.Guid]::NewGuid().ToString()
)

# Create environment files in client directory
$clientDevEnvPath = ".\client\.env.development"
$clientProdEnvPath = ".\client\.env.production"

# Check if development file exists
if (Test-Path $clientDevEnvPath) {
    Write-Host "Warning: $clientDevEnvPath already exists. Backing up to $clientDevEnvPath.bak"
    Copy-Item -Path $clientDevEnvPath -Destination "$clientDevEnvPath.bak" -Force
}

# Check if production file exists
if (Test-Path $clientProdEnvPath) {
    Write-Host "Warning: $clientProdEnvPath already exists. Backing up to $clientProdEnvPath.bak"
    Copy-Item -Path $clientProdEnvPath -Destination "$clientProdEnvPath.bak" -Force
}

# Create the .env.development file (no authentication in development)
@"
# Development environment variables
# No authentication required in development mode
"@ | Out-File -FilePath $clientDevEnvPath -Encoding utf8

# Create the .env.production file with access control
@"
# Production environment variables
# Authentication settings for production access control
VITE_ACCESS_PASSWORD=$AccessPassword
VITE_ACCESS_TOKEN=$AccessToken
"@ | Out-File -FilePath $clientProdEnvPath -Encoding utf8

Write-Host "Environment setup complete!"
Write-Host "Created development and production environment files."
Write-Host ""
Write-Host "Development mode: No authentication required"
Write-Host "Production mode: Protected with password authentication"
Write-Host ""
Write-Host "To start the development servers:"
Write-Host "1. Run 'npm run dev' in the client directory"
Write-Host "2. Run 'uvicorn app.main:app --reload' in the server directory"
Write-Host ""
Write-Host "To build for production:"
Write-Host "1. Run 'npm run build' in the client directory"
Write-Host "2. Deploy the built files to your hosting provider"
Write-Host ""
Write-Host "Your production site will be protected with password authentication."
