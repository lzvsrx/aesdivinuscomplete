# Checklist Legal e de Plataforma - Aes Divinus

Este checklist nao substitui advogado. Ele organiza itens para reduzir riscos antes de publicar em Steam, lojas mobile e outros mercados.

## Empresa

- Confirmar nome legal da LZASANTOSWORLDSGAMES.
- Confirmar CNPJ ou registro empresarial aplicavel.
- Confirmar conta bancaria no mesmo nome legal.
- Definir responsavel legal que assina contratos de loja.
- Definir email de suporte.
- Definir email de privacidade/DPO/encarregado quando aplicavel.

## Propriedade Intelectual

- Registrar quem criou cada arquivo de arte, audio, texto, codigo e modelo.
- Guardar licencas de todos os assets externos.
- Evitar imagens de terceiros sem licenca clara.
- Confirmar permissao de uso dos sons/efeitos.
- Verificar marca Aes Divinus e LZASANTOSWORLDSGAMES antes de publicar globalmente.

## Privacidade e Dados

- Manter politica de privacidade publicada.
- Coletar apenas dados necessarios.
- Redigir dados sensiveis no save remoto.
- Nao enviar token GitHub dentro dos saves.
- Ter canal para exclusao/correcao de dados.
- Confirmar base legal para cada tratamento.
- Evitar coleta de dados de menores sem autorizacao apropriada.

## Criancas e Idade

- Definir publico-alvo.
- Incluir age gate/confirmacao de idade.
- Obter classificacao indicativa por plataforma/pais.
- Se direcionado a menores, implementar consentimento parental verificavel quando exigido.

## Monetizacao

- Se houver compra com dinheiro real, usar pagamento oficial da plataforma.
- Steam: usar Steam Wallet/Microtransaction API.
- Mobile: usar In-App Purchase da Apple/Google quando exigido.
- Separar moeda interna ganha no jogo de moeda vendida por dinheiro real.
- Mostrar preco, conteudo e politicas de reembolso conforme plataforma.

## Conteudo e Classificacao

- Declarar violencia, horror, medo, linguagem, sangue, compras, dados e interacoes online.
- Preencher questionarios de classificacao com fidelidade.
- Preparar screenshots/trailers representativos do gameplay real.

## Seguranca

- Testar XSS/sanitizacao de textos de usuario.
- Manter dependencias sem vulnerabilidades conhecidas.
- Remover segredos do codigo.
- Usar escopos minimos para tokens.
- Validar builds assinadas quando necessario.

## Steam

- Preparar Steamworks/Steam Direct.
- Pagar taxa por app.
- Criar pagina da loja.
- Enviar build para revisao.
- Implementar Steam Cloud para build Steam, substituindo GitHub Sync quando apropriado.
- Usar Steam Wallet para compras reais.

## Android e iOS

- Rever politicas Google Play e Apple App Store.
- Usar IAP oficial para compras reais.
- Preparar privacy nutrition labels/data safety.
- Assinar APK/AAB/IPA com certificados oficiais.

## Lancamento

- Rodar testes automatizados.
- Testar instaladores.
- Testar save/reset/import/export.
- Testar offline e sem token.
- Revisar documentos legais.
- Arquivar evidencias de licencas e aprovacoes.
