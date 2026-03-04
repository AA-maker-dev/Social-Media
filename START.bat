@echo off
REM Viteflow Social Media Platform - Full Auto Start Script
REM This script automatically starts backend and frontend

setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║         Viteflow Social Media Platform - Auto Starting...      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Get the directory where the script is located
set "SCRIPT_DIR=%~dp0"
echo Starting from: %SCRIPT_DIR%
echo.

REM Navigate to backend folder
cd /d "%SCRIPT_DIR%backend"

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo [*] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [✓] Starting Backend Server...
REM Start backend server in a new window with a title
start "Viteflow Backend Server" cmd /k "npm start"

REM Wait for backend to initialize
echo [*] Waiting for backend to start (5 seconds)...
timeout /t 5 /nobreak

REM Open frontend in default browser
echo [✓] Opening Frontend in Browser...
start "" "%SCRIPT_DIR%Social-Media\Login\FrontEnd\login.html"

REM Wait a moment for browser to open
timeout /t 2 /nobreak

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  ✅ Backend Server Started (localhost:5000)                  ║
echo ║  ✅ Frontend Opened in Browser                               ║
echo ║                                                              ║
echo ║  Backend window is running separately.                      ║
echo ║  Keep it open to use the application.                       ║
echo ║                                                              ║
echo ║  To stop: Close the Backend Server window                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
