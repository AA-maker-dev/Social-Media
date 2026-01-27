@echo off
REM =============================================
REM  NEXORA - Git Push & Merge Fix Script
REM =============================================

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo  NEXORA - GIT FIX & PUSH SCRIPT
echo ========================================
echo.
echo This script will help you push changes
echo to GitHub after merge fixes.
echo.

:check_status
cls
echo Checking current git status...
cd /d "d:\GithubProjects\EPP-project\Social-Media"

echo.
echo ========== CURRENT STATUS ==========
git status
echo.

:confirm
set /p proceed="Do you want to proceed with pushing? (y/n): "
if /i "%proceed%"=="y" goto do_push
if /i "%proceed%"=="n" goto menu
echo Invalid choice. Please enter y or n.
goto confirm

:do_push
cls
echo.
echo Attempting to push to GitHub...
echo.

REM Step 1: Fetch latest
echo [1/4] Fetching latest changes from remote...
git fetch origin
if %errorlevel% neq 0 (
    echo ERROR: Could not fetch from remote
    echo Try checking your internet connection and GitHub credentials
    pause
    goto menu
)

REM Step 2: Check for conflicts
echo.
echo [2/4] Checking for conflicts...
git diff origin/main --name-only > nul
if %errorlevel% neq 0 (
    echo.
    echo WARNING: There might be conflicts
    echo You may need to:
    echo   1. git pull origin main
    echo   2. Resolve conflicts manually
    echo   3. git commit -m "Merge conflicts resolved"
    echo   4. git push origin main
)

REM Step 3: Add all changes
echo.
echo [3/4] Staging all changes...
git add .
echo Changes staged.

REM Step 4: Create commit
echo.
echo [4/4] Creating commit...
echo Commit message: "Post-merge fixes: route optimization, CORS config, CSS linking"
git commit -m "Post-merge fixes: route optimization, CORS config, CSS linking"

REM Step 5: Push
echo.
echo ========================================
echo Pushing to GitHub...
echo ========================================
git push -u origin main

if %errorlevel% equ 0 (
    cls
    echo.
    echo ========================================
    echo ✅ PUSH SUCCESSFUL!
    echo ========================================
    echo.
    echo Your changes have been pushed to GitHub.
    echo.
    echo View your repository at:
    echo https://github.com/YourUsername/EPP-project
    echo.
) else (
    cls
    echo.
    echo ========================================
    echo ❌ PUSH FAILED
    echo ========================================
    echo.
    echo If push failed, try these steps:
    echo.
    echo 1. git pull origin main
    echo    (This pulls any remote changes)
    echo.
    echo 2. Resolve any conflicts if they appear
    echo.
    echo 3. git commit -m "Merge conflicts resolved"
    echo    (If you had to resolve conflicts)
    echo.
    echo 4. git push origin main
    echo    (Try pushing again)
    echo.
)

:menu
echo.
set /p again="Do you want to try again or exit? (again/exit): "
if /i "%again%"=="again" goto check_status
if /i "%again%"=="exit" goto end

echo Invalid choice.
goto menu

:end
echo.
echo Thank you for using Nexora Git Fix Script!
echo.
pause
