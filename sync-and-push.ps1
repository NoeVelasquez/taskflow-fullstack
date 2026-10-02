# ==============================================================================
# Script de Sincronización Automática: Local -> Repositorio Unificado de GitHub
# ==============================================================================
$ErrorActionPreference = "Stop"

$RepoDir = "f:\DIPLOMADOS\USIP\taskflow-repo"
$BackDir = "f:\DIPLOMADOS\USIP\MODULO 4\proyecto"
$FrontDir = "f:\DIPLOMADOS\USIP\MODULO7"

Write-Host "---------------------------------------------------------" -ForegroundColor Cyan
Write-Host " 🚀 Sincronizando TaskFlow Fullstack (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "---------------------------------------------------------" -ForegroundColor Cyan

# 1. Sincronizar Backend
Write-Host "🔄 [1/3] Sincronizando Backend desde '$BackDir'..." -ForegroundColor Yellow
robocopy $BackDir "$RepoDir\backend" /E /XD node_modules .git dist /XF .env .env.local
if ($LASTEXITCODE -ge 8) {
    Write-Error "Error al copiar archivos del Backend (código de salida: $LASTEXITCODE)"
}

# 2. Sincronizar Frontend
Write-Host "🔄 [2/3] Sincronizando Frontend desde '$FrontDir'..." -ForegroundColor Yellow
robocopy $FrontDir "$RepoDir\frontend" /E /XD node_modules .git dist /XF .env .env.local
if ($LASTEXITCODE -ge 8) {
    Write-Error "Error al copiar archivos del Frontend (código de salida: $LASTEXITCODE)"
}

# 3. Control Git
Set-Location $RepoDir
Write-Host "📦 [3/3] Registrando cambios en Git..." -ForegroundColor Yellow
git add .

$status = git status --porcelain
if (-not $status) {
    Write-Host "ℹ️ No hay cambios pendientes para subir. El repositorio ya está al día." -ForegroundColor Green
    Exit 0
}

$mensaje = Read-Host "Mensaje del commit (presiona ENTER para 'feat: actualizacion y entrega final taskflow')"
if (-not $mensaje) {
    $mensaje = "feat: actualizacion y entrega final taskflow fullstack"
}

git commit -m "$mensaje"

# Intentar push si existe remote
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "🚀 Subiendo cambios a GitHub (origin main)..." -ForegroundColor Cyan
    git push origin main
    Write-Host "✅ ¡Subida a GitHub completada exitosamente!" -ForegroundColor Green
} else {
    Write-Host "⚠️ No hay un repositorio remoto 'origin' configurado aún." -ForegroundColor Yellow
    Write-Host "👉 Conecta tu repo ejecutando: git remote add origin <URL_DE_TU_REPO_GITHUB>" -ForegroundColor Cyan
    Write-Host "👉 Y luego sube con: git push -u origin main" -ForegroundColor Cyan
}

Write-Host "---------------------------------------------------------" -ForegroundColor Cyan
