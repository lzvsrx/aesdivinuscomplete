# Releases Godot

A partir da versao `v0.1.6`, os artefatos publicados no GitHub Releases sao baseados no projeto Godot em `godot/`.

## Artefatos por plataforma

- Windows: `Aes-Divinus-Godot-Windows-x64-0.1.6.zip`
- Linux: `Aes-Divinus-Godot-Linux-x64-0.1.6.zip`
- Android: `Aes-Divinus-Godot-Android-debug.apk`
- iOS/macOS de assinatura: `Aes-Divinus-Godot-Project-0.1.6.zip`
- Executadores: `Aes-Divinus-Executadores-0.1.6.zip`
- Verificacao: `SHA256SUMS-Godot-0.1.6.txt`

## Como gerar localmente

```powershell
npm run godot:export
```

O script exporta Windows e Linux em modo release, Android em APK debug assinado pelo Godot e empacota o projeto Godot para iOS. A geracao de `.ipa` distribuivel exige macOS, Xcode, Apple Team ID, certificado e provisioning profile.

## Observacoes de distribuicao

- O APK Android gerado nesta maquina e debug. Para loja, configure keystore release no Godot e gere um APK/AAB assinado de producao.
- O iOS precisa ser exportado/assinado em ambiente Apple autorizado.
- Windows e Linux usam `.pck` separado dentro dos zips; mantenha o executavel e o `.pck` na mesma pasta.
