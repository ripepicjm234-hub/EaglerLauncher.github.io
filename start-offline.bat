@echo off
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (
    python start-offline.py
) else (
    py -3 start-offline.py
)
if errorlevel 1 (
    echo Could not start the offline site. Install Python 3 and try again.
    pause
)
