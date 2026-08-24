param(
  [Parameter(Mandatory = $true)]
  [string] $Version,
  [Parameter(Mandatory = $true)]
  [string] $OutDir,
  [Parameter(Mandatory = $true)]
  [string] $Root
)

$ErrorActionPreference = "Stop"

$linuxBinary = Join-Path $OutDir "Aes-Divinus-Godot-Linux-x64.x86_64"
$linuxPack = Join-Path $OutDir "Aes-Divinus-Godot-Linux-x64.pck"
$icon = Join-Path $Root "assets\aes-divinus-icon-512.png"
$packagesDir = Join-Path $OutDir "linux-distros"

if (-not (Test-Path $linuxBinary)) {
  throw "Binario Linux nao encontrado: $linuxBinary"
}
if (-not (Test-Path $linuxPack)) {
  throw "Pacote .pck Linux nao encontrado: $linuxPack"
}

Remove-Item -Recurse -Force $packagesDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $packagesDir | Out-Null

function Write-AsciiFile {
  param(
    [string] $Path,
    [string] $Content
  )
  $parent = Split-Path $Path -Parent
  New-Item -ItemType Directory -Force $parent | Out-Null
  Set-Content -Path $Path -Value $Content -Encoding ascii
}

function Compress-TarGz {
  param(
    [string] $SourceDir,
    [string] $TargetFile
  )
  $parent = Split-Path $SourceDir -Parent
  $leaf = Split-Path $SourceDir -Leaf
  Push-Location $parent
  try {
    tar -czf $TargetFile $leaf
  } finally {
    Pop-Location
  }
}

function New-LinuxDistroPackage {
  param(
    [string] $Slug,
    [string] $Title,
    [string] $Family,
    [string] $InstallCommand,
    [string] $Notes
  )

  $packageName = "Aes-Divinus-Godot-Linux-$Slug-x64-$Version"
  $stage = Join-Path $packagesDir $packageName
  New-Item -ItemType Directory -Force $stage | Out-Null

  Copy-Item $linuxBinary (Join-Path $stage "Aes-Divinus-Godot-Linux-x64.x86_64") -Force
  Copy-Item $linuxPack (Join-Path $stage "Aes-Divinus-Godot-Linux-x64.pck") -Force
  Copy-Item $icon (Join-Path $stage "aes-divinus-icon-512.png") -Force

  Write-AsciiFile -Path (Join-Path $stage "run-aes-divinus.sh") -Content @'
#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN="$DIR/Aes-Divinus-Godot-Linux-x64.x86_64"

chmod +x "$BIN" 2>/dev/null || true

args=()
case "${AES_DIVINUS_RENDERER:-auto}" in
  opengl3|compatibility)
    args+=(--rendering-driver opengl3)
    ;;
  vulkan)
    args+=(--rendering-driver vulkan)
    ;;
esac

if [ "${AES_DIVINUS_LOW_POWER:-0}" = "1" ]; then
  args+=(--resolution 1280x720)
fi

export SDL_VIDEO_X11_NET_WM_BYPASS_COMPOSITOR=0
exec "$BIN" "${args[@]}" "$@"
'@

  Write-AsciiFile -Path (Join-Path $stage "install-desktop-entry.sh") -Content @'
#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/512x512/apps"
DESKTOP_FILE="$APP_DIR/aes-divinus.desktop"

mkdir -p "$APP_DIR" "$ICON_DIR"
cp "$DIR/aes-divinus-icon-512.png" "$ICON_DIR/aes-divinus.png"
cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Type=Application
Name=Aes Divinus
Comment=RPG tatico 3D single-player feito no Godot
Exec=bash "$DIR/run-aes-divinus.sh"
Icon=aes-divinus
Terminal=false
Categories=Game;RolePlaying;
StartupNotify=true
EOF

chmod +x "$DIR/run-aes-divinus.sh" "$DESKTOP_FILE" 2>/dev/null || true
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$APP_DIR" >/dev/null 2>&1 || true
fi
echo "Atalho instalado: $DESKTOP_FILE"
'@

  Write-AsciiFile -Path (Join-Path $stage "uninstall-desktop-entry.sh") -Content @'
#!/usr/bin/env bash
set -euo pipefail
rm -f "$HOME/.local/share/applications/aes-divinus.desktop"
rm -f "$HOME/.local/share/icons/hicolor/512x512/apps/aes-divinus.png"
echo "Atalho local removido."
'@

  Write-AsciiFile -Path (Join-Path $stage "aes-divinus.desktop") -Content @'
[Desktop Entry]
Type=Application
Name=Aes Divinus
Comment=RPG tatico 3D single-player feito no Godot
Exec=run-aes-divinus.sh
Icon=aes-divinus
Terminal=false
Categories=Game;RolePlaying;
StartupNotify=true
'@

  Write-AsciiFile -Path (Join-Path $stage "README-LINUX.txt") -Content @"
Aes Divinus Godot Linux x64 - $Version

Pacote: $Title
Familia: $Family

Como executar:
1. Extraia este pacote.
2. Abra um terminal nesta pasta.
3. Rode: bash run-aes-divinus.sh

Instalar atalho no menu do usuario:
bash install-desktop-entry.sh

Remover atalho:
bash uninstall-desktop-entry.sh

Dependencias comuns:
$InstallCommand

Opcoes de compatibilidade:
- Forcar OpenGL/compatibilidade: AES_DIVINUS_RENDERER=opengl3 bash run-aes-divinus.sh
- Forcar Vulkan: AES_DIVINUS_RENDERER=vulkan bash run-aes-divinus.sh
- Modo hardware fraco: AES_DIVINUS_LOW_POWER=1 bash run-aes-divinus.sh

Notas:
$Notes

Este pacote e portatil, nao precisa de root e deve manter o executavel e o arquivo .pck na mesma pasta.
"@

  Compress-Archive -Path (Join-Path $stage "*") -DestinationPath (Join-Path $OutDir "$packageName.zip") -Force
  Compress-TarGz -SourceDir $stage -TargetFile (Join-Path $OutDir "$packageName.tar.gz")
}

New-LinuxDistroPackage `
  -Slug "Universal" `
  -Title "Universal portatil" `
  -Family "Qualquer distro Linux x86_64 com drivers graficos atualizados" `
  -InstallCommand "Instale/atualize drivers Mesa/Vulkan ou driver proprietario da GPU quando necessario." `
  -Notes "Use este pacote quando a distro nao estiver listada abaixo ou quando quiser rodar sem instalador."

New-LinuxDistroPackage `
  -Slug "Debian-Ubuntu-Mint" `
  -Title "Debian, Ubuntu, Linux Mint, Pop!_OS e derivados" `
  -Family "Distros baseadas em Debian/Ubuntu" `
  -InstallCommand "sudo apt update && sudo apt install libx11-6 libxcursor1 libxinerama1 libxi6 libxrandr2 libgl1 mesa-vulkan-drivers" `
  -Notes "Em notebooks hibridos, teste tambem pelo modo desempenho da GPU do sistema."

New-LinuxDistroPackage `
  -Slug "Fedora-RHEL-openSUSE" `
  -Title "Fedora, RHEL, Alma/Rocky e openSUSE" `
  -Family "Distros RPM" `
  -InstallCommand "Fedora/RHEL: sudo dnf install libX11 libXcursor libXinerama libXi libXrandr mesa-vulkan-drivers | openSUSE: sudo zypper install libX11-6 libXcursor1 libXinerama1 libXi6 libXrandr2 Mesa-vulkan-device-select" `
  -Notes "Em distros corporativas antigas, prefira ambiente grafico e driver Mesa mais recentes."

New-LinuxDistroPackage `
  -Slug "Arch-Manjaro" `
  -Title "Arch Linux, Manjaro e EndeavourOS" `
  -Family "Distros rolling release baseadas em Arch" `
  -InstallCommand "sudo pacman -Syu libx11 libxcursor libxinerama libxi libxrandr mesa vulkan-icd-loader" `
  -Notes "Mantenha o sistema atualizado para evitar incompatibilidade de driver grafico."

New-LinuxDistroPackage `
  -Slug "SteamDeck" `
  -Title "SteamOS / Steam Deck" `
  -Family "SteamOS baseado em Arch" `
  -InstallCommand "No modo Desktop, extraia o pacote, rode bash run-aes-divinus.sh e adicione como Non-Steam Game se quiser abrir pelo Gaming Mode." `
  -Notes "Use AES_DIVINUS_LOW_POWER=1 para economizar bateria ou reduzir carga grafica."

Write-AsciiFile -Path (Join-Path $OutDir "Aes-Divinus-Godot-Linux-Distros-$Version.txt") -Content @"
Aes Divinus Godot Linux - pacotes por distro

Arquitetura suportada nesta release: x86_64.
Pacotes gerados:
- Universal: qualquer distro Linux x86_64 moderna.
- Debian-Ubuntu-Mint: Debian, Ubuntu, Linux Mint, Pop!_OS e derivados.
- Fedora-RHEL-openSUSE: Fedora, RHEL, AlmaLinux, Rocky Linux, openSUSE e derivados.
- Arch-Manjaro: Arch Linux, Manjaro, EndeavourOS e derivados.
- SteamDeck: SteamOS / Steam Deck.

Todos os pacotes incluem:
- executavel Godot Linux;
- arquivo .pck do jogo;
- launcher Bash com opcoes de renderer;
- instalador local de atalho .desktop;
- icone do jogo;
- README-LINUX.txt com comandos especificos.

Se a distro nao abrir com Vulkan, rode:
AES_DIVINUS_RENDERER=opengl3 bash run-aes-divinus.sh

Se o hardware for fraco:
AES_DIVINUS_LOW_POWER=1 bash run-aes-divinus.sh
"@

Write-Host "Pacotes Linux por distro gerados em $OutDir" -ForegroundColor Green
