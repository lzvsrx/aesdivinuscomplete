# Contribuindo com Aes Divinus

Obrigado por ajudar no projeto. Este repositorio mistura jogo web, desktop, mobile e migracao Godot/C++, entao toda mudanca deve preservar o conteudo ja implementado.

## Antes de alterar

- Leia o [README](README.md) e o indice de [documentacao](docs/README.md).
- Nao remova sistemas existentes sem registrar motivo e impacto.
- Mantenha a versao Godot alinhada com os dados exportados da versao web.
- Nunca commite tokens, senhas, certificados, keystores privados ou dados reais de jogadores.

## Validacao local

```powershell
npm run godot:data
npm test
npm run godot:check
npm run godot:models
```

Se o computador nao tiver Godot instalado, rode pelo menos:

```powershell
npm run godot:data
npm test
```

## Padrao de mudancas

- Conteudo de campanha e sistemas ficam em `src/`.
- Dados usados pelo Godot sao gerados por `scripts/export-godot-data.mjs`.
- Documentos legais e de processo ficam em `docs/` ou na raiz quando forem padrao do GitHub.
- Assets finais devem manter licenca ou fonte registrada.

## Pull requests

Inclua no PR:

- resumo da mudanca;
- testes executados;
- impacto em save, seguranca, builds ou plataformas;
- screenshots ou videos quando a mudanca for visual.
