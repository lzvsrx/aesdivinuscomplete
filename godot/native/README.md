# Aes Divinus Native C++ Core

Esta pasta prepara a migracao do nucleo do jogo para C++ no Godot.

O projeto Godot em `godot/` ja roda e usa `godot/data/aes_divinus_data.json`. Como o computador atual nao tem compilador C++, SCons ou CMake no PATH, a biblioteca GDExtension nao foi compilada nesta etapa. O codigo C++ abaixo centraliza as regras de combate/saves para ser ligado ao Godot assim que o toolchain estiver instalado.

## Instalar toolchain no Windows

- Visual Studio Build Tools com workload C++ ou MinGW/LLVM.
- Python.
- SCons.
- `godot-cpp` compativel com a versao instalada do Godot.

## Proxima etapa C++

1. Clonar `godot-cpp` dentro de `godot/native/godot-cpp`.
2. Compilar bindings com SCons.
3. Criar wrapper GDExtension exportando `AesDivinusCore` para Godot.
4. Trocar gradualmente as chamadas de `scripts/main.gd` para a classe C++.

## Conteudo portado

- estruturas de armas, armaduras, unidades, principado e campanha;
- acerto/dano separados;
- coragem/medo;
- compra/venda/equipamento;
- save serializavel;
- dados vindos do GDD exportados para JSON.

