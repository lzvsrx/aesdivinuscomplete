# Politica de Privacidade - Aes Divinus

Versao: 2026-08-24

Esta politica descreve como Aes Divinus trata dados no jogo. Este documento deve ser revisado por advogado antes de lancamento comercial.

## Controladora

LZASANTOSWORLDSGAMES.

## Dados Tratados

- nome informado no cadastro local;
- email informado no cadastro local;
- personagem criado;
- progresso de campanha;
- inventario, economia, configuracoes, hardware aproximado e eventos de jogo;
- token GitHub informado pelo usuario para autosave remoto.

## Finalidades

- salvar e carregar progresso;
- lembrar login no dispositivo;
- sincronizar saves no repositorio GitHub configurado;
- adaptar graficos e interface ao dispositivo;
- diagnosticar integridade do save.

## Minimização

O save local guarda dados completos no dispositivo. O save remoto no GitHub remove token, identificadores de dispositivo e email bruto, mantendo apenas email mascarado quando necessario para exibicao e auditoria do jogador.

## Criancas e Adolescentes

O jogo solicita confirmacao de idade permitida no pais do jogador ou autorizacao de responsavel quando exigida. Se o produto for direcionado a menores ou coletar dados de menores, sera necessario processo especifico de consentimento parental, conforme leis aplicaveis.

## Segurança

- senha digitada nao e salva no estado do jogo;
- IndexedDB local usa envelope AES-GCM quando WebCrypto esta disponivel;
- saves e eventos recebem hash de integridade;
- token GitHub nao e enviado dentro do arquivo remoto;
- textos exibidos passam por escape HTML.

## Direitos do Titular

O jogador pode reiniciar o banco local pelo jogo. Antes do lancamento online, a empresa deve disponibilizar canal de contato para acesso, correcao, exclusao e demais direitos previstos em leis aplicaveis.

## Terceiros

Quando o GitHub Sync esta configurado, o jogo usa a API do GitHub para gravar arquivos JSON no repositorio indicado pelo jogador. Plataformas como Steam, Google Play, Apple App Store e GitHub podem ter politicas proprias.

## Retencao

Saves locais permanecem no dispositivo ate exclusao/reset. Saves remotos permanecem no repositorio ate exclusao pelo titular/controlador.

## Contato

Definir email oficial de privacidade da LZASANTOSWORLDSGAMES antes do lancamento.
