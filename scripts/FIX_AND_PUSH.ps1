# Fix merge issues and push to GitHub

Write-Host "=== Nexora Social Media - Git Fix Script ===" -ForegroundColor Cyan

# Navigate to root
cd "d:\GithubProjects\EPP-project\Social-Media"

Write-Host "`n1. Checking git status..." -ForegroundColor Yellow
git status

Write-Host "`n2. Fetching latest changes..." -ForegroundColor Yellow
git fetch origin

Write-Host "`n3. Checking for conflicts..." -ForegroundColor Yellow
$conflicts = git diff --name-only --diff-filter=U
if ($conflicts) {
    Write-Host "Found conflicts in: $conflicts" -ForegroundColor Red
} else {
    Write-Host "No conflicts found!" -ForegroundColor Green
}

Write-Host "`n4. Checking branches..." -ForegroundColor Yellow
git branch -a

Write-Host "`n5. Attempting to push..." -ForegroundColor Yellow
git push -u origin main

Write-Host "`n=== Done ===" -ForegroundColor Cyan
