# Aes Divinus - instaladores e builds

## Windows

Gera instalador NSIS `.exe` em `release/`:

```powershell
npm run build:windows
```

## Linux

No Windows, gera a pasta Linux portatil `release/linux-unpacked`:

```powershell
npm run build:linux
```

Para gerar `AppImage` e `.deb`, rode em Linux ou WSL com toolchain Linux:

```bash
npm run build:linux:installer
```

## Android

O projeto usa Capacitor. Para criar/sincronizar o projeto nativo:

```powershell
npm run android:add
npm run android:apk
```

O APK debug sai em `android/app/build/outputs/apk/debug/app-debug.apk`.
Este projeto usa JDK 21 portatil em `tools/jdk-21` para evitar conflito com JDKs globais.

## iOS

O projeto iOS pode ser criado/sincronizado com Capacitor, mas IPA assinado exige macOS, Xcode, CocoaPods e conta/certificados Apple:

```bash
npm run ios:add
npm run ios:sync
```

Depois abra `ios/App/App.xcworkspace` no Xcode para instalar CocoaPods, assinar, arquivar e exportar o `.ipa`.
