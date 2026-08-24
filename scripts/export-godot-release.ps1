param(
  [string] $Version = "0.1.16"
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$OutDir = Join-Path $Root "release\godot\v$Version"
Set-Location $Root

New-Item -ItemType Directory -Force $OutDir | Out-Null
npm run godot:data

function Export-Godot {
  param(
    [string] $Preset,
    [string] $Output,
    [switch] $Debug,
    [switch] $Required
  )

  $mode = if ($Debug) { "--export-debug" } else { "--export-release" }
  $fullOutput = Join-Path $OutDir $Output
  $targetDir = Split-Path $fullOutput -Parent
  New-Item -ItemType Directory -Force $targetDir | Out-Null

  Write-Host "Exportando Godot $Preset -> $fullOutput" -ForegroundColor Cyan
  & godot --headless --path godot $mode $Preset $fullOutput
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao exportar $Preset"
  }
  for ($i = 0; $i -lt 120 -and -not (Test-Path $fullOutput); $i++) {
    Start-Sleep -Milliseconds 500
  }
  if (-not (Test-Path $fullOutput)) {
    if ($Required) {
      throw "Godot terminou sem gerar o arquivo esperado: $fullOutput"
    }
    Write-Warning "Godot nao gerou $fullOutput. Este alvo sera coberto pelo pacote de projeto Godot."
    return $false
  }
  return $true
}

$windowsExported = Export-Godot -Preset "Windows Desktop" -Output "Aes-Divinus-Godot-Windows-x64.exe" -Required
$linuxExported = Export-Godot -Preset "Linux" -Output "Aes-Divinus-Godot-Linux-x64.x86_64" -Required
$androidExported = Export-Godot -Preset "Android" -Output "Aes-Divinus-Godot-Android-debug.apk" -Debug
$iosExported = Export-Godot -Preset "iOS" -Output "Aes-Divinus-Godot-iOS-project.zip"

powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root "scripts\package-godot-windows.ps1") -Version $Version -OutDir $OutDir -Root $Root

Compress-Archive -Path @(
  (Join-Path $OutDir "Aes-Divinus-Godot-Linux-x64.x86_64"),
  (Join-Path $OutDir "Aes-Divinus-Godot-Linux-x64.pck")
) -DestinationPath (Join-Path $OutDir "Aes-Divinus-Godot-Linux-x64-$Version.zip") -Force

powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root "scripts\package-godot-linux.ps1") -Version $Version -OutDir $OutDir -Root $Root

$godotProjectFiles = Get-ChildItem (Join-Path $Root "godot") -Recurse -File |
  Where-Object { $_.FullName -notmatch "\\godot\\.godot\\" }
Compress-Archive -Path $godotProjectFiles.FullName -DestinationPath (Join-Path $OutDir "Aes-Divinus-Godot-Project-$Version.zip") -Force

Compress-Archive -Path "$Root\launchers\*", "$Root\scripts\launcher.ps1", "$Root\scripts\launcher.sh" -DestinationPath (Join-Path $OutDir "Aes-Divinus-Executadores-$Version.zip") -Force

Get-ChildItem $OutDir -File |
  Where-Object {
    $_.Name -notlike "SHA256SUMS*" -and
    $_.Name -notlike "RELEASE_NOTES*" -and
    $_.Name -notlike "*.pck" -and
    $_.Name -notlike "*.exe" -and
    $_.Name -notlike "*.x86_64" -and
    $_.Name -notlike "*.idsig"
  } |
  ForEach-Object {
    $hash = Get-FileHash $_.FullName -Algorithm SHA256
    "$($hash.Hash.ToLower())  $($_.Name)"
  } | Set-Content -Path (Join-Path $OutDir "SHA256SUMS-Godot-$Version.txt") -Encoding ascii

Write-Host "Artefatos Godot gerados em $OutDir" -ForegroundColor Green
