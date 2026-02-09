# WorkSphere Pro - Quick Start Script
# Run this script to start the application

Write-Host "🚀 WorkSphere Pro - Starting Application..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "📊 Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoStatus = Get-Process mongod -ErrorAction Stop
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB is not running. Please start MongoDB first:" -ForegroundColor Red
    Write-Host "   Run: mongod" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

Write-Host ""
Write-Host "✅ Application is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "   API Docs:  http://localhost:5000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Login Credentials:" -ForegroundColor Cyan
Write-Host "   Email:    admin@swastikindustries.com" -ForegroundColor White
Write-Host "   Password: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait 10-15 seconds for servers to start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to open the application in your browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "🎉 Enjoy WorkSphere Pro!" -ForegroundColor Green
Write-Host ""
