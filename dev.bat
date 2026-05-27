@echo off
echo Starting Recall dev environment...

start "Recall API" cmd /k "cd /d %~dp0 && call venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

start "Recall UI" cmd /k "cd /d %~dp0ui && npm run dev"
