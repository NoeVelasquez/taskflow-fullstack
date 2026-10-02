$RepoDir = "f:\DIPLOMADOS\USIP\taskflow-repo"
$BackDir = "f:\DIPLOMADOS\USIP\MODULO 4\proyecto"
$FrontDir = "f:\DIPLOMADOS\USIP\MODULO7"

Write-Host "---------------------------------------------------------"
Write-Host "Sincronizando TaskFlow Fullstack (Backend + Frontend)..."
Write-Host "---------------------------------------------------------"

Write-Host "[1/3] Sincronizando Backend..."
robocopy $BackDir "$RepoDir\backend" /E /XD node_modules .git dist /XF .env .env.local | Out-Null

Write-Host "[2/3] Sincronizando Frontend..."
robocopy $FrontDir "$RepoDir\frontend" /E /XD node_modules .git dist /XF .env .env.local | Out-Null

Set-Location $RepoDir
Write-Host "[3/3] Registrando cambios en Git..."
git add .

$status = git status --porcelain
if (-not $status) {
    Write-Host "El repositorio ya esta actualizado. No hay cambios pendientes."
} else {
    $mensaje = Read-Host "Mensaje del commit (Enter para por defecto)"
    if (-not $mensaje) {
        $mensaje = "feat: actualizacion taskflow fullstack"
    }
    git commit -m "$mensaje"
    Write-Host "Subiendo a GitHub..."
    git push origin main
    Write-Host "Completado exitosamente."
}
