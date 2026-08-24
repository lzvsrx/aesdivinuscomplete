#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-web}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ensure_node_modules() {
  if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias com npm ci..."
    npm ci
  fi
}

open_url() {
  local url="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
  fi
}

ensure_node_modules

case "$TARGET" in
  web)
    echo "Abrindo Aes Divinus no navegador em http://localhost:5173"
    open_url "http://localhost:5173"
    npm run start
    ;;
  desktop)
    npm run desktop
    ;;
  godot)
    npm run godot:run
    ;;
  godot-models)
    npm run godot:models
    ;;
  godot-export)
    npm run godot:export
    ;;
  android-sync)
    npm run android:sync
    ;;
  android-apk)
    npm run android:apk
    ;;
  ios-sync)
    npm run ios:sync
    ;;
  build-windows)
    npm run build:windows
    ;;
  build-linux)
    npm run build:linux
    ;;
  build-linux-installer)
    npm run build:linux:installer
    ;;
  test)
    npm test
    ;;
  all-checks)
    npm run godot:data
    npm test
    npm run godot:check
    npm run godot:models
    ;;
  *)
    echo "Uso: ./scripts/launcher.sh [web|desktop|godot|godot-models|godot-export|android-sync|android-apk|ios-sync|build-windows|build-linux|build-linux-installer|test|all-checks]"
    exit 2
    ;;
esac
