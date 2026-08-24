# Plano de Resposta a Incidentes Ciberneticos - Aes Divinus

Versao: 2026-08-24

Este documento organiza medidas para reduzir risco cibernetico, proteger usuarios e orientar a LZASANTOSWORLDSGAMES em caso de incidente. Ele nao substitui advogado, encarregado de dados, perito forense ou autoridade publica. Antes do lancamento comercial, deve ser revisado por profissional juridico e de seguranca da informacao.

## Principio

O jogo deve operar com minimizacao de dados, seguranca por padrao, registro auditavel e transparencia. Nenhuma funcionalidade deve coletar, expor, vender, transferir ou publicar dados pessoais alem do necessario para salvar progresso, lembrar login local, sincronizar saves configurados pelo controlador/usuario e cumprir regras de plataforma.

## Leis, normas e referencias oficiais

- LGPD/ANPD: incidentes de seguranca com dados pessoais que possam causar risco ou dano relevante devem ser comunicados aos titulares e a ANPD.
- Policia Federal: crimes ciberneticos incluem infracoes cometidas pela internet ou por sistemas digitais, como fraudes, crimes de alta tecnologia, odio e abuso sexual infantojuvenil online.
- CERT.br: ponto nacional de referencia para notificacao tecnica de incidentes de seguranca, especialmente quando o contato responsavel pela rede de origem nao for conhecido.
- Plataformas: Steam, GitHub, Google Play e Apple App Store podem exigir comunicacao, remocao de build, correcao emergencial, revisao de privacidade, revogacao de tokens ou notificacao aos usuarios.
- Referencias internacionais: FTC Data Breach Response e boas praticas NIST/CSF devem ser usadas como apoio para contencao, investigacao, comunicacao e recuperacao.

Fontes:

- ANPD - Comunicacao de Incidente de Seguranca: https://www.gov.br/anpd/pt-br/assuntos/comunicacao-de-incidentes-de-seguranca-cis
- Policia Federal - Combate a Crimes Ciberneticos: https://www.gov.br/pf/pt-br/assuntos/combate-a-crimes-ciberneticos
- Comunica PF: https://apps.pf.gov.br/r/comunicapf/comunicapf/pagina-inicial
- CERT.br - Reportar incidentes: https://cert.br/reportar/
- CERT.br - Recomendacoes para notificacoes: https://cert.br/docs/notificacoes/
- FTC - Data Breach Response Guide: https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business

## Dados protegidos no projeto

- nome, email e perfil local do jogador;
- personagem criado;
- progresso de campanha, inventario, economia, configuracoes e eventos;
- identificador de dispositivo;
- token GitHub informado pelo usuario/controlador;
- logs e snapshots de save.

O save remoto nao deve conter token GitHub, email bruto nem identificador do dispositivo. O save local deve manter criptografia quando WebCrypto estiver disponivel.

## Controles preventivos obrigatorios

- manter senha fora do estado do jogo;
- redigir token, segredo, senha, certificado e dados sensiveis em payloads de evento;
- escapar HTML antes de renderizar textos vindos de usuario/save;
- usar escopo minimo em tokens GitHub;
- nao embutir token, certificado, chave privada ou segredo em codigo, build ou release;
- limitar historico de eventos para evitar vazamento e crescimento indefinido;
- manter dependencias revisadas com `npm audit` antes de release publica;
- testar offline, sem token, com save corrompido e com falha de rede;
- publicar politica de privacidade, termos de uso e contato de suporte/privacidade antes do lancamento;
- coletar somente dados necessarios e manter base legal documentada.

## O que conta como incidente

Tratar como incidente quando houver suspeita ou confirmacao de:

- acesso nao autorizado a saves, tokens, builds, contas, repositorio ou dispositivo de desenvolvimento;
- exposicao de email, identificador, progresso, token ou qualquer dado pessoal;
- commit ou release contendo segredo;
- alteracao maliciosa de build, instalador, APK, IPA, assets, audio ou executavel;
- XSS, injecao, execucao de codigo, bypass de pagamento, fraude ou exploracao de vulnerabilidade;
- phishing usando marca Aes Divinus ou LZASANTOSWORLDSGAMES;
- conteudo criminoso, abuso sexual infantojuvenil, ameaca, extorsao, odio ou fraude relacionado ao jogo/comunidade;
- uso indevido de propriedade intelectual, dados de terceiros ou material sem licenca.

## Fluxo de resposta

1. Identificar e registrar

- Criar registro interno com data/hora, quem descobriu, sistema afetado, versao, plataforma, evidencias e impacto inicial.
- Preservar logs, commits, artefatos, releases, hashes, prints e respostas de API.
- Nao apagar evidencias antes de copiar e registrar.

2. Conter

- Revogar tokens, chaves e sessoes suspeitas.
- Remover release comprometida, bloquear download ou substituir build quando necessario.
- Desativar GitHub Sync ou pagamentos se houver risco ativo.
- Corrigir regra de firewall, permissao, branch protection, secret ou dependencia vulneravel.

3. Avaliar dados pessoais

- Verificar quais dados foram afetados.
- Verificar se houve dado pessoal, dado sensivel, dado de crianca/adolescente, credencial, token ou dado financeiro.
- Estimar numero de titulares afetados e gravidade.
- Verificar se criptografia local, redacao remota e hash de integridade estavam ativos.

4. Comunicar quando exigido

- Se o incidente com dados pessoais puder causar risco ou dano relevante, preparar Comunicacao de Incidente de Seguranca para a ANPD e comunicacao aos titulares afetados.
- Usar prazo operacional de ate 3 dias uteis a partir da ciencia do incidente, salvo regra aplicavel mais especifica ou orientacao juridica.
- Se houver indicio de crime, registrar ocorrencia/comunicacao junto ao canal competente, como Policia Federal/Comunica PF ou delegacia especializada local.
- Se houver incidente tecnico de rede, ataque, malware, varredura ou origem desconhecida, notificar contatos de rede envolvidos e o CERT.br quando apropriado.
- Se o incidente afetar plataforma, loja, pagamento ou repositorio, seguir tambem o canal oficial de Steam, GitHub, Google Play, Apple ou processador de pagamento.

5. Recuperar

- Aplicar patch, trocar credenciais, reconstruir builds limpas e gerar novos hashes.
- Revalidar testes automatizados, instaladores e saves.
- Publicar hotfix/release corretiva.
- Monitorar logs, issues, suporte e reports apos a correcao.

6. Aprender e documentar

- Registrar causa raiz, impacto, decisao de notificacao, autoridades acionadas, usuarios notificados e medidas preventivas.
- Atualizar este plano, checklist de release, termos, politica de privacidade e testes.
- Guardar registro do incidente pelo prazo recomendado pelo juridico/encarregado.

## Matriz de acionamento de autoridades

| Situacao | Acao minima | Canal sugerido |
| --- | --- | --- |
| Incidente com dados pessoais e risco/dano relevante | Comunicar ANPD e titulares afetados | ANPD CIS |
| Crime cibernetico, fraude, extorsao, invasao ou ameaca | Registrar comunicacao/ocorrencia | Policia Federal, Comunica PF ou delegacia competente |
| Abuso sexual infantojuvenil online | Acionar canal policial/denuncia com urgencia | Comunica PF, Disque 100 ou autoridade local |
| Ataque de rede, malware, phishing ou varredura tecnica | Notificar rede de origem/destino e preservar logs | Contatos da rede e CERT.br |
| Vazamento de token GitHub | Revogar token, auditar commits/releases e notificar afetados se houver dados pessoais | GitHub Security + ANPD se aplicavel |
| Build adulterada ou supply chain | Remover release, publicar aviso, recriar build assinada e comunicar plataformas | GitHub/Steam/Google/Apple e autoridades se houver crime |
| Pagamento indevido, fraude ou compra real irregular | Suspender fluxo, preservar provas e usar sistema oficial da plataforma | Steam/Google/Apple/processador + autoridade se necessario |

## Modelo de registro interno

```text
ID do incidente:
Data/hora de descoberta:
Responsavel interno:
Sistema afetado:
Versao/build/release:
Descricao:
Como foi detectado:
Dados possivelmente afetados:
Quantidade estimada de titulares:
Risco/dano relevante? Sim/Nao/Em avaliacao
Medidas imediatas:
Evidencias preservadas:
Tokens/chaves revogados:
Autoridades/plataformas acionadas:
Usuarios/titulares comunicados:
Correcao aplicada:
Teste de validacao:
Status:
Licoes aprendidas:
```

## Modelo de aviso ao usuario afetado

```text
Assunto: Aviso de seguranca - Aes Divinus

Identificamos um incidente de seguranca em [data] que pode ter afetado [tipo de dado].
O que aconteceu: [resumo claro].
Dados envolvidos: [lista objetiva].
Medidas tomadas: [contencao/correcao].
O que recomendamos: [trocar token/senha, revisar repositorio, atualizar jogo].
Contato: [email oficial].
```

## Regras de automacao

- O jogo pode registrar localmente falhas de save, integridade e sincronizacao.
- O jogo nao deve enviar denuncia automaticamente a orgaos publicos sem avaliacao humana, porque comunicacoes oficiais precisam de contexto, evidencias corretas e responsabilidade legal.
- O projeto deve manter botao/canal de suporte para o usuario reportar abuso, falha de seguranca ou vazamento.
- Em versoes online futuras, reports de seguranca devem gerar um ticket interno e preservar evidencias, mas a decisao de acionar autoridade deve ficar com responsavel legal/seguranca.

## Responsaveis antes do lancamento

Preencher antes de publicar:

- Responsavel legal:
- Encarregado/DPO ou contato de privacidade:
- Responsavel tecnico de seguranca:
- Email de suporte:
- Email de privacidade:
- Canal de denuncia/abuso:
- Politica publica de vulnerabilidades:

