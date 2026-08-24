# Suporte Linux Godot

Este projeto distribui Aes Divinus para Linux como binario Godot portatil `x86_64`, com pacotes preparados por familia de distro. A abordagem portatil evita depender de um unico gerenciador de pacotes e facilita rodar em distros modernas sem instalacao global.

## Pacotes gerados

- `Aes-Divinus-Godot-Linux-x64-0.1.15.zip`: pacote minimo com executavel e `.pck`.
- `Aes-Divinus-Godot-Linux-Universal-x64-0.1.15.zip` e `.tar.gz`: qualquer distro Linux `x86_64` moderna.
- `Aes-Divinus-Godot-Linux-Debian-Ubuntu-Mint-x64-0.1.15.zip` e `.tar.gz`: Debian, Ubuntu, Linux Mint, Pop!_OS e derivados.
- `Aes-Divinus-Godot-Linux-Fedora-RHEL-openSUSE-x64-0.1.15.zip` e `.tar.gz`: Fedora, RHEL, AlmaLinux, Rocky Linux, openSUSE e derivados.
- `Aes-Divinus-Godot-Linux-Arch-Manjaro-x64-0.1.15.zip` e `.tar.gz`: Arch Linux, Manjaro, EndeavourOS e derivados.
- `Aes-Divinus-Godot-Linux-SteamDeck-x64-0.1.15.zip` e `.tar.gz`: SteamOS / Steam Deck.
- `Aes-Divinus-Godot-Linux-Distros-0.1.15.txt`: resumo de compatibilidade.

## Como rodar

```bash
tar -xzf Aes-Divinus-Godot-Linux-Universal-x64-0.1.15.tar.gz
cd Aes-Divinus-Godot-Linux-Universal-x64-0.1.15
bash run-aes-divinus.sh
```

Tambem funciona extraindo o `.zip` e rodando:

```bash
bash run-aes-divinus.sh
```

## Atalho no menu

Cada pacote de distro inclui:

```bash
bash install-desktop-entry.sh
```

Isso instala o atalho em `~/.local/share/applications/aes-divinus.desktop` e o icone em `~/.local/share/icons/hicolor/512x512/apps/aes-divinus.png`, sem exigir root.

Para remover:

```bash
bash uninstall-desktop-entry.sh
```

## Compatibilidade grafica

Por padrao, o launcher deixa o Godot escolher o melhor renderer. Se a distro tiver problema com Vulkan ou driver antigo:

```bash
AES_DIVINUS_RENDERER=opengl3 bash run-aes-divinus.sh
```

Para tentar Vulkan explicitamente:

```bash
AES_DIVINUS_RENDERER=vulkan bash run-aes-divinus.sh
```

Para hardware fraco, notebooks simples ou Steam Deck em economia de bateria:

```bash
AES_DIVINUS_LOW_POWER=1 bash run-aes-divinus.sh
```

## Dependencias comuns

Debian, Ubuntu, Linux Mint e derivados:

```bash
sudo apt update
sudo apt install libx11-6 libxcursor1 libxinerama1 libxi6 libxrandr2 libgl1 mesa-vulkan-drivers
```

Fedora, RHEL, AlmaLinux, Rocky Linux e derivados:

```bash
sudo dnf install libX11 libXcursor libXinerama libXi libXrandr mesa-vulkan-drivers
```

openSUSE:

```bash
sudo zypper install libX11-6 libXcursor1 libXinerama1 libXi6 libXrandr2 Mesa-vulkan-device-select
```

Arch Linux, Manjaro e derivados:

```bash
sudo pacman -Syu libx11 libxcursor libxinerama libxi libxrandr mesa vulkan-icd-loader
```

Steam Deck:

1. Entre no modo Desktop.
2. Extraia o pacote SteamDeck.
3. Rode `bash run-aes-divinus.sh`.
4. Opcionalmente adicione `run-aes-divinus.sh` como Non-Steam Game.

## Limites

- Esta release Linux e `x86_64`; ARM Linux precisa de export/template proprio.
- `.deb`, `.rpm`, Flatpak e AppImage finais devem ser gerados/testados em Linux ou CI Linux com as ferramentas oficiais de cada formato.
- Para Steam, use o pacote Linux minimo ou Universal como base do depot Linux e teste no Steam Deck.
