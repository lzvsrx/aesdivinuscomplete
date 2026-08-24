# Releases Godot

A partir da versao `v0.1.13`, os artefatos publicados no GitHub Releases sao baseados no projeto Godot em `godot/`. O GDD mestre V2 define a direcao oficial como RPG tatico 3D single-player por turnos, com exploracao em terceira pessoa e combate em arenas taticas 3D.

## Artefatos por plataforma

- Windows: `Aes-Divinus-Godot-Windows-x64-0.1.13.zip`
- Linux minimo: `Aes-Divinus-Godot-Linux-x64-0.1.13.zip`
- Linux Universal: `Aes-Divinus-Godot-Linux-Universal-x64-0.1.13.zip` / `.tar.gz`
- Linux Debian/Ubuntu/Mint: `Aes-Divinus-Godot-Linux-Debian-Ubuntu-Mint-x64-0.1.13.zip` / `.tar.gz`
- Linux Fedora/RHEL/openSUSE: `Aes-Divinus-Godot-Linux-Fedora-RHEL-openSUSE-x64-0.1.13.zip` / `.tar.gz`
- Linux Arch/Manjaro: `Aes-Divinus-Godot-Linux-Arch-Manjaro-x64-0.1.13.zip` / `.tar.gz`
- Linux Steam Deck: `Aes-Divinus-Godot-Linux-SteamDeck-x64-0.1.13.zip` / `.tar.gz`
- Android: `Aes-Divinus-Godot-Android-debug.apk`
- iOS/macOS de assinatura: `Aes-Divinus-Godot-Project-0.1.13.zip`
- Executadores: `Aes-Divinus-Executadores-0.1.13.zip`
- Verificacao: `SHA256SUMS-Godot-0.1.13.txt`

## Como gerar localmente

```powershell
npm run godot:export
```

O script exporta Windows e Linux em modo release, cria pacotes Linux por familia de distro, gera Android em APK debug assinado pelo Godot e empacota o projeto Godot para iOS. A geracao de `.ipa` distribuivel exige macOS, Xcode, Apple Team ID, certificado e provisioning profile.

## Observacoes de distribuicao

- O APK Android gerado nesta maquina e debug. Para loja, configure keystore release no Godot e gere um APK/AAB assinado de producao.
- O iOS precisa ser exportado/assinado em ambiente Apple autorizado.
- Windows e Linux usam `.pck` separado dentro dos zips; mantenha o executavel e o `.pck` na mesma pasta.
- Os pacotes Linux por distro incluem `run-aes-divinus.sh`, instalador local de atalho `.desktop`, icone e README com comandos de dependencias.
- Consulte `docs/LINUX_DISTROS_GODOT.md` para matriz de compatibilidade Linux.
