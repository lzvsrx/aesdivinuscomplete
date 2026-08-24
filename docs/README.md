# Documentacao do Aes Divinus

Este diretorio concentra os documentos de producao, seguranca, direitos e publicacao do jogo.

## Indice

- [Direitos, publicacao na Steam e regras](DIREITOS_PUBLICACAO_STEAM_REGRAS.md)
- [PDF dos direitos, Steam e regras](DIREITOS_PUBLICACAO_STEAM_REGRAS.pdf)
- [Plano de resposta a incidentes ciberneticos](PLANO_RESPOSTA_INCIDENTES_CIBERNETICOS.md)
- [Contatos globais de autoridades ciberneticas](CONTATOS_AUTORIDADES_CIBERNETICAS_GLOBAIS.md)
- [Pipeline de modelagem Godot/Blender](MODELAGEM_GODOT_BLENDER_PIPELINE.md)
- [Releases Godot](GODOT_RELEASES.md)

## Documentos na raiz

- [README principal](../README.md)
- [Politica de Privacidade](../PRIVACY_POLICY.md)
- [Termos de Uso](../TERMS_OF_USE.md)
- [Checklist legal e de release](../COMPLIANCE_RELEASE_CHECKLIST.md)
- [Instaladores e builds](../BUILD_INSTALLERS.md)
- [Politica de seguranca do repositorio](../SECURITY.md)
- [Executadores por plataforma](../launchers/README.md)

## Estrutura principal

- `src/`: versao web jogavel, dados, sistemas e regras.
- `tests/`: testes automatizados do jogo.
- `assets/`: logos, imagens e audio usados pela versao web.
- `godot/`: migracao Godot 4.7 com dados exportados, cenas, scripts e base C++.
- `electron/`: wrapper desktop.
- `android/` e `ios/`: projetos mobile.
- `.github/`: workflows e templates do GitHub.

## Rotina recomendada antes de release

```powershell
npm run godot:data
npm test
npm run godot:check
npm run godot:models
```

As checagens Godot exigem Godot instalado no computador ou no runner.
