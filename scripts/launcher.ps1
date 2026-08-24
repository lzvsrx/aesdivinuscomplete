param(
  [Parameter(Position = 0)]
  [ValidateSet(
    "web",
    "desktop",
    "godot",
    "godot-models",
    "godot-export",
    "android-sync",
    "android-apk",
    "ios-sync",
    "build-windows",
    "build-linux",
    "build-linux-installer",
    "test",
    "all-checks"
  )]
  [string] $Target = "web"
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

function Invoke-Npm {
  param([string[]] $NpmArgs)
  Write-Host "npm $($NpmArgs -join ' ')" -ForegroundColor Cyan
  & npm @NpmArgs
}

function Ensure-NodeModules {
  if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias com npm ci..." -ForegroundColor Yellow
    Invoke-Npm -NpmArgs @("ci")
  }
}

Ensure-NodeModules

switch ($Target) {
  "web" {
    Write-Host "Abrindo Aes Divinus no navegador em http://localhost:5173" -ForegroundColor Green
    Start-Process "http://localhost:5173"
    Invoke-Npm -NpmArgs @("run", "start")
  }
  "desktop" {
    Invoke-Npm -NpmArgs @("run", "desktop")
  }
  "godot" {
    Invoke-Npm -NpmArgs @("run", "godot:run")
  }
  "godot-models" {
    Invoke-Npm -NpmArgs @("run", "godot:models")
  }
  "godot-export" {
    Invoke-Npm -NpmArgs @("run", "godot:export")
  }
  "android-sync" {
    Invoke-Npm -NpmArgs @("run", "android:sync")
  }
  "android-apk" {
    Invoke-Npm -NpmArgs @("run", "android:apk")
  }
  "ios-sync" {
    Invoke-Npm -NpmArgs @("run", "ios:sync")
  }
  "build-windows" {
    Invoke-Npm -NpmArgs @("run", "build:windows")
  }
  "build-linux" {
    Invoke-Npm -NpmArgs @("run", "build:linux")
  }
  "build-linux-installer" {
    Invoke-Npm -NpmArgs @("run", "build:linux:installer")
  }
  "test" {
    Invoke-Npm -NpmArgs @("test")
  }
  "all-checks" {
    Invoke-Npm -NpmArgs @("run", "godot:data")
    Invoke-Npm -NpmArgs @("test")
    Invoke-Npm -NpmArgs @("run", "godot:check")
    Invoke-Npm -NpmArgs @("run", "godot:models")
  }
}
