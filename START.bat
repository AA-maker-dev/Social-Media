@echo off
REM Nexora Social Media Platform - Auto Start Script
REM This script starts the backend server and opens the frontend automatically

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║         Nexora Social Media Platform - Starting...           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Navigate to backend folder
cd /d "%~dp0backend"

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start backend server in a new window
echo Starting Backend Server...
start cmd /k npm start

REM Wait a few seconds for backend to start
timeout /t 3 /nobreak

REM Open frontend in default browser
echo Opening Frontend in Browser...
start "" "%~dp0Social-Media\Login\FrontEnd\login.html"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  ✅ Backend Server Started (localhost:5000)                  ║
echo ║  ✅ Frontend Opened in Browser                               ║
echo ║                                                              ║
echo ║  Backend window will stay open. Close it to stop the server.║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

pause
