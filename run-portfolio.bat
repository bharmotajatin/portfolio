@echo off
cd /d "%~dp0"
echo Starting portfolio at http://localhost:8080
echo Open that URL in your browser, then press Ctrl+C here to stop.
start http://localhost:8080
python -m http.server 8080
pause
