$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$tools = Join-Path $root "tools"
$jdk = Join-Path $tools "jdk-21"
$zip = Join-Path $tools "jdk21.zip"
$java = Join-Path $jdk "bin\java.exe"

if (Test-Path -LiteralPath $java) {
  & $java -version
  Write-Output "JDK 21 portatil ja esta pronto em $jdk"
  exit 0
}

New-Item -ItemType Directory -Force -Path $tools | Out-Null

Write-Output "Baixando JDK 21 Temurin..."
Invoke-WebRequest -Uri "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk" -OutFile $zip

if (Test-Path -LiteralPath $jdk) {
  Move-Item -LiteralPath $jdk -Destination "$jdk-old" -Force
}

New-Item -ItemType Directory -Force -Path $jdk | Out-Null
tar -xf $zip -C $jdk --strip-components 1
& $java -version
Write-Output "JDK 21 portatil instalado em $jdk"

