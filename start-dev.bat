@echo off
cd /d "%~dp0"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo npm install failed.
        pause
        exit /b 1
    )
)

echo Starting dev server...
call npm run dev -- --open

pause
