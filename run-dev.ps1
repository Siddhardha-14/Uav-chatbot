# Opens two terminals (backend + frontend) and launches the app in your default browser.
# Run from PowerShell:  .\run-dev.ps1
# If execution policy blocks:  powershell -ExecutionPolicy Bypass -File .\run-dev.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

function Test-Cmd($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

if (-not (Test-Cmd "python")) {
    Write-Host "ERROR: python not found. Install Python 3.11+ and try again." -ForegroundColor Red
    exit 1
}
if (-not (Test-Cmd "npm")) {
    Write-Host "ERROR: npm not found. Install Node.js 20+ and try again." -ForegroundColor Red
    exit 1
}

$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

Write-Host "`nUAV Mission Intent Analyzer - starting servers`n" -ForegroundColor Cyan
Write-Host "1) Backend:  http://127.0.0.1:8000  (API + /docs)" -ForegroundColor Gray
Write-Host "2) Frontend: http://localhost:3000   (open this in Chrome or Edge)`n" -ForegroundColor Gray

Write-Host "Launching backend in a new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-NoProfile",
    "-Command",
    "Set-Location -LiteralPath '$backend'; Write-Host 'BACKEND - keep this window open' -ForegroundColor Green; python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
)

Start-Sleep -Seconds 2

Write-Host "Launching frontend in a new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-NoProfile",
    "-Command",
    "Set-Location -LiteralPath '$frontend'; Write-Host 'FRONTEND - keep this window open' -ForegroundColor Green; npm run dev"
)

Write-Host "Waiting for Next.js to bind to port 3000..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`nDone. Do not close the two PowerShell windows while testing.`n" -ForegroundColor Cyan
Write-Host "If the page fails to load: wait a few seconds and refresh, or use Chrome/Edge (not only Cursor preview).`n" -ForegroundColor Yellow
