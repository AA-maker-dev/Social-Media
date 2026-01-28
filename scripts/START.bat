@echo off
REM Nexora Social Media - Quick Start & Deploy Script
REM This script helps with common development tasks

:menu
cls
echo.
echo ========================================
echo  NEXORA SOCIAL MEDIA - QUICK COMMANDS
echo ========================================
echo.
echo 1. Start Backend Server
echo 2. Install Backend Dependencies
echo 3. Run Frontend (Open in Browser)
echo 4. Check Git Status
echo 5. Commit Changes
echo 6. Push to GitHub
echo 7. View Status Reports
echo 8. Exit
echo.
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto install_deps
if "%choice%"=="3" goto open_frontend
if "%choice%"=="4" goto git_status
if "%choice%"=="5" goto git_commit
if "%choice%"=="6" goto git_push
if "%choice%"=="7" goto view_reports
if "%choice%"=="8" goto exit

echo Invalid choice. Press any key to try again.
pause
goto menu

:start_backend
cls
echo.
echo Starting Backend Server...
cd /d "d:\GithubProjects\EPP-project\Social-Media\backend"
npm start
goto menu

:install_deps
cls
echo.
echo Installing Backend Dependencies...
cd /d "d:\GithubProjects\EPP-project\Social-Media\backend"
npm install
echo.
echo Dependencies installed successfully!
pause
goto menu

:open_frontend
cls
echo.
echo Opening Frontend in Default Browser...
start "" "d:\GithubProjects\EPP-project\Social-Media\Social-Media\Website_Inside\HTML\index.html"
echo.
echo Frontend opened in your default browser!
echo.
echo To use the app, you need to:
echo 1. Start the backend server first (choose option 1)
echo 2. Login with admin@nexora.com / Admin@123
echo 3. Or create a new account
echo.
pause
goto menu

:git_status
cls
echo.
echo Current Git Status:
cd /d "d:\GithubProjects\EPP-project\Social-Media"
git status
echo.
pause
goto menu

:git_commit
cls
echo.
echo Current changes to commit:
cd /d "d:\GithubProjects\EPP-project\Social-Media"
git status
echo.
set /p msg="Enter commit message: "
git add .
git commit -m "%msg%"
echo.
echo Commit successful!
pause
goto menu

:git_push
cls
echo.
echo Pushing to GitHub...
cd /d "d:\GithubProjects\EPP-project\Social-Media"
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Push failed! Try these steps:
    echo 1. git fetch origin
    echo 2. git pull origin main
    echo 3. git push origin main
    echo.
) else (
    echo.
    echo Push successful!
)
pause
goto menu

:view_reports
cls
echo.
echo Available Reports:
echo.
echo 1. Merge Status Report
echo 2. Merge Fixes Applied
echo.
set /p report="Enter your choice (1-2) or any other key to go back: "

if "%report%"=="1" (
    type "d:\GithubProjects\EPP-project\Social-Media\MERGE_STATUS_REPORT.md" | more
    goto menu
)
if "%report%"=="2" (
    type "d:\GithubProjects\EPP-project\Social-Media\MERGE_FIXES_APPLIED.md" | more
    goto menu
)
goto menu

:exit
echo.
echo Thank you for using Nexora Social Media!
echo.
pause
