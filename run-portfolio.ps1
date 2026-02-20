# Start portfolio and open in browser
$port = 8080
$dir = $PSScriptRoot
Write-Host "Starting server at http://localhost:$port"
Write-Host "Serving from: $dir"
Write-Host "Press Ctrl+C to stop"
Start-Process "http://localhost:$port"
Set-Location $dir
python -m http.server $port
