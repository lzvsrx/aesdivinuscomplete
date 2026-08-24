param(
  [Parameter(Mandatory = $true)]
  [string] $Version,
  [Parameter(Mandatory = $true)]
  [string] $OutDir,
  [Parameter(Mandatory = $true)]
  [string] $Root
)

$ErrorActionPreference = "Stop"

$windowsBinary = Join-Path $OutDir "Aes-Divinus-Godot-Windows-x64.exe"
$windowsPack = Join-Path $OutDir "Aes-Divinus-Godot-Windows-x64.pck"
$icon = Join-Path $Root "assets\aes-divinus-icon-512.png"
$stage = Join-Path $OutDir "Aes-Divinus-Godot-Windows-x64-$Version"

if (-not (Test-Path $windowsBinary)) {
  throw "Executavel Windows nao encontrado: $windowsBinary"
}
if (-not (Test-Path $windowsPack)) {
  throw "Pacote .pck Windows nao encontrado: $windowsPack"
}

Remove-Item -Recurse -Force $stage -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $stage | Out-Null

Copy-Item $windowsBinary (Join-Path $stage "Aes-Divinus-Godot-Windows-x64.exe") -Force
Copy-Item $windowsPack (Join-Path $stage "Aes-Divinus-Godot-Windows-x64.pck") -Force
Copy-Item $icon (Join-Path $stage "aes-divinus-icon-512.png") -Force

Set-Content -Path (Join-Path $stage "Jogar-Aes-Divinus.bat") -Encoding ascii -Value @'
@echo off
cd /d "%~dp0"
start "" "Aes-Divinus-Godot-Windows-x64.exe"
'@

Set-Content -Path (Join-Path $stage "Jogar-Aes-Divinus-Compatibilidade.bat") -Encoding ascii -Value @'
@echo off
cd /d "%~dp0"
start "" "Aes-Divinus-Godot-Windows-x64.exe" --rendering-driver opengl3
'@

Set-Content -Path (Join-Path $stage "Testar-Aes-Divinus-Windows.bat") -Encoding ascii -Value @'
@echo off
cd /d "%~dp0"
"Aes-Divinus-Godot-Windows-x64.exe" --verbose > windows-runtime-test.out.log 2> windows-runtime-test.err.log
echo Logs gravados em:
echo %CD%\windows-runtime-test.out.log
echo %CD%\windows-runtime-test.err.log
pause
'@

Set-Content -Path (Join-Path $stage "README-WINDOWS.txt") -Encoding ascii -Value @"
Aes Divinus Godot Windows x64 - $Version

Como jogar:
1. Extraia todo este pacote.
2. Abra Jogar-Aes-Divinus.bat.

Modo compatibilidade:
- Se o jogo nao abrir, mostrar tela preta ou houver problema com overlay/driver grafico, abra:
  Jogar-Aes-Divinus-Compatibilidade.bat

Teste com log:
- Abra Testar-Aes-Divinus-Windows.bat para gerar:
  windows-runtime-test.out.log
  windows-runtime-test.err.log

Importante:
- Mantenha Aes-Divinus-Godot-Windows-x64.exe e Aes-Divinus-Godot-Windows-x64.pck na mesma pasta.
- A build usa renderer de compatibilidade por padrao para rodar melhor em mais PCs Windows.
- Drivers de video atualizados continuam recomendados.
"@

Compress-Archive -Path (Join-Path $stage "*") -DestinationPath (Join-Path $OutDir "Aes-Divinus-Godot-Windows-x64-$Version.zip") -Force

Write-Host "Pacote Windows jogavel gerado em $OutDir" -ForegroundColor Green
