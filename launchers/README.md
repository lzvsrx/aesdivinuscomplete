# Executadores do Aes Divinus

Esta pasta tem atalhos para rodar ou preparar o jogo nas plataformas que ja existem no projeto.

## Windows

Clique duas vezes em:

- `windows-web.bat`: abre o jogo no navegador.
- `windows-desktop.bat`: abre a versao desktop Electron.
- `windows-godot.bat`: abre a versao Godot.
- `windows-godot-export.bat`: exporta os pacotes Godot para Windows, Linux, Android e iOS.
- `windows-build-installer.bat`: gera o instalador Windows em `release/`.
- `windows-android-apk.bat`: gera o APK debug Android.

## Linux/macOS

Use o terminal:

```bash
chmod +x launchers/*.sh scripts/launcher.sh
./launchers/linux-web.sh
./launchers/linux-desktop.sh
./launchers/linux-godot.sh
./launchers/godot-export.sh
./launchers/linux-build-installer.sh
./launchers/ios-sync.sh
```

## Observacoes

- Android exige JDK/SDK Android configurados.
- iOS exige macOS, Xcode, CocoaPods e certificados Apple.
- Godot exige o comando `godot` disponivel no PATH.
- Builds finais ficam em `release/` ou nas pastas nativas de cada plataforma.
