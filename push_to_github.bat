@echo off
echo ========================================
echo   School.MS - GitHub Push Utility
echo ========================================
echo.
echo Preparing to push main branch to:
echo https://github.com/Divss72/School.MS
echo.
echo NOTE: If prompted, please enter your GitHub Personal Access Token or login.
echo.
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Push failed. 
    echo Please ensure you have permission to write to this repository.
    echo If you haven't logged in, try: git remote set-url origin https://[YOUR_PAT]@github.com/Divss72/School.MS.git
) else (
    echo.
    echo [SUCCESS] Code pushed successfully!
)
pause
