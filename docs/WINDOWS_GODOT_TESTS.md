# Testes Windows Godot

## Resultado da build v0.1.14

O executavel exportado `Aes-Divinus-Godot-Windows-x64.exe` foi iniciado no Windows por teste de runtime com `--verbose`.

Resultado:

- Godot carregou o motor.
- A GPU foi detectada.
- A cena principal `res://scenes/main.tscn` carregou.
- O logo `res://assets/aes-divinus-logo.png` carregou.
- O audio WASAPI inicializou.
- Nao houve erro de script do jogo durante a abertura.

## Ajuste aplicado

A build passou a usar `gl_compatibility` como renderer padrao para reduzir problemas com Vulkan, overlays externos e drivers antigos em PCs Windows variados.

O pacote Windows inclui:

- `Jogar-Aes-Divinus.bat`: abre o jogo normalmente.
- `Jogar-Aes-Divinus-Compatibilidade.bat`: abre forçando OpenGL/compatibilidade.
- `Testar-Aes-Divinus-Windows.bat`: executa com log em `windows-runtime-test.out.log` e `windows-runtime-test.err.log`.
- `README-WINDOWS.txt`: orientacao para jogador.

## Correcao de jogabilidade de missao

O botao `Jogar cena/missao` agora abre uma arena tatico-jogavel em vez de deixar a missao apenas como texto. A arena aceita:

- movimento por WASD;
- movimento por setas;
- clique do mouse;
- toque em tela;
- interacao por Espaco/Enter;
- troca de rodada por `R`.

Essa correcao fica no script Godot principal e, por isso, acompanha as builds Windows, Linux, Android e o projeto iOS.

## Observacao sobre erro externo encontrado

Durante o teste da build anterior, o log mostrou erro de uma camada Vulkan externa da Epic Games procurando `EOSOverlayVkLayer-Win64.json`. Isso nao era erro do Aes Divinus, mas podia assustar e atrapalhar PCs com overlay quebrado. A troca para renderer de compatibilidade e o executador alternativo reduzem esse risco.
