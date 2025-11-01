# Script para limpar cache do Vite

Write-Host "Limpando cache do Vite..." -ForegroundColor Yellow

# Limpar cache do Vite
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "Cache do Vite limpo!" -ForegroundColor Green
} else {
    Write-Host "Cache do Vite ja estava limpo" -ForegroundColor Cyan
}

# Limpar dist se existir
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "Pasta dist limpa!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Agora execute: npm run dev" -ForegroundColor Green
Write-Host "No navegador, pressione Ctrl+Shift+R" -ForegroundColor Cyan
