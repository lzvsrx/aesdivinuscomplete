$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$jdk = Join-Path $root "tools\jdk-21"
$java = Join-Path $jdk "bin\java.exe"

if (!(Test-Path -LiteralPath $java)) {
  throw "JDK 21 portatil nao encontrado em $jdk. Baixe/extraia antes de compilar Android."
}

$env:JAVA_HOME = $jdk
$env:ANDROID_HOME = "C:\android"
$env:ANDROID_SDK_ROOT = "C:\android"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"

Push-Location (Join-Path $root "android")
try {
  .\gradlew.bat assembleDebug
}
finally {
  Pop-Location
}
