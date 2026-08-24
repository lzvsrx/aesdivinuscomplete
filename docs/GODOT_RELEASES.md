# Releases Godot

A partir da versao `v0.1.14`, os artefatos publicados no GitHub Releases sao baseados no projeto Godot em `godot/`. O GDD mestre V2 define a direcao oficial como RPG tatico 3D single-player por turnos, com exploracao em terceira pessoa e combate em arenas taticas 3D.

## Artefatos por plataforma

- Windows: `Aes-Divinus-Godot-Windows-x64-0.1.14.zip`
- Linux minimo: `Aes-Divinus-Godot-Linux-x64-0.1.14.zip`
- Linux Universal: `Aes-Divinus-Godot-Linux-Universal-x64-0.1.14.zip` / `.tar.gz`
- Linux Debian/Ubuntu/Mint: `Aes-Divinus-Godot-Linux-Debian-Ubuntu-Mint-x64-0.1.14.zip` / `.tar.gz`
- Linux Fedora/RHEL/openSUSE: `Aes-Divinus-Godot-Linux-Fedora-RHEL-openSUSE-x64-0.1.14.zip` / `.tar.gz`
- Linux Arch/Manjaro: `Aes-Divinus-Godot-Linux-Arch-Manjaro-x64-0.1.14.zip` / `.tar.gz`
- Linux Steam Deck: `Aes-Divinus-Godot-Linux-SteamDeck-x64-0.1.14.zip` / `.tar.gz`
- Android: `Aes-Divinus-Godot-Android-debug.apk`
- iOS/macOS de assinatura: `Aes-Divinus-Godot-Project-0.1.14.zip`
- Executadores: `Aes-Divinus-Executadores-0.1.14.zip`
- Verificacao: `SHA256SUMS-Godot-0.1.14.txt`

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

## Jogabilidade Godot v0.1.14

- `Jogar cena/missao` abre uma tela jogavel em overlay responsivo, usando quase todo o viewport.
- A arena tática tem grid, William, inimigos, objetivo, cobertura, PA, rodada e mensagens de acao.
- Controles suportados: WASD, setas, clique, toque, Espaco/Enter, Q para ataque, E para defesa, F para interacao e botoes grandes na tela.
- Acoes animadas: movimento interpolado, ataque com golpe visual, defesa com brilho, objetivo pulsante, aviso de fora de alcance e feedback de nova rodada.
- O visual da arena foi suavizado para reduzir aspecto quadriculado: rota organica, pontos discretos de setor, cobertura arredondada e fundos procedurais por tipo de missao.
- O mesmo fluxo esta no projeto Godot e acompanha Windows, Linux, Android e iOS assinavel.
- A identidade indie foi adicionada ao JSON do jogo, com tags de loja, pilares de escopo, acessibilidade e publicacao.
