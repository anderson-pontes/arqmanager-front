# Script para limpar cache do Vite
Write-Host "🧹 Limpando cache do Vite..." -ForegroundColor Yellow

# Limpar cache do Vite
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✅ Cache do Vite limpo!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Cache do Vite não encontrado" -ForegroundColor Cyan
}

# Limpar cache temporário
if (Test-Path "node_modules\.vite-temp") {
    Remove-Item -Recurse -Force "node_modules\.vite-temp"
    Write-Host "✅ Cache temporário limpo!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Agora execute: npm run dev" -ForegroundColor Cyan
