@echo off
REM Quick Deployment Setup Script for Vercel
REM This script prepares your project for deployment

echo.
echo ================================
echo   Nexora Deployment Setup
echo ================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] Initializing git repository...
if not exist .git (
    git init
    echo [✓] Git initialized
) else (
    echo [✓] Git already initialized
)

echo.
echo [2/5] Configuring git...
git config user.name "Nexora Developer"
git config user.email "dev@nexora.local"
echo [✓] Git configured

echo.
echo [3/5] Adding files to git...
git add .
echo [✓] Files staged

echo.
echo [4/5] Creating initial commit...
git commit -m "Initial commit - Ready for Vercel deployment" 2>nul
if %errorlevel% equ 0 (
    echo [✓] Initial commit created
) else (
    echo [✓] Already committed
)

echo.
echo [5/5] Setup complete!
echo.
echo ================================
echo    Next Steps:
echo ================================
echo.
echo 1. Create GitHub Account: https://github.com/signup
echo.
echo 2. Create GitHub Repository:
echo    - Go to https://github.com/new
echo    - Name it "Social-Media"
echo    - Click "Create Repository"
echo.
echo 3. Push to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/Social-Media.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Deploy on Vercel:
echo    - Visit https://vercel.com
echo    - Sign in with GitHub
echo    - Click "New Project"
echo    - Select "Social-Media" repository
echo    - Deploy!
echo.
echo 5. Connect Domain:
echo    - Add custom domain in Vercel: viteflo.com
echo    - Update nameservers at nepalownregistrar.com
echo    - Wait for DNS propagation (24-48 hours)
echo.
echo For detailed instructions, see: DEPLOYMENT.md
echo.
pause
