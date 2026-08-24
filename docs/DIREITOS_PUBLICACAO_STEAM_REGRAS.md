# Direitos do Jogo, Publicacao na Steam e Regras a Seguir

Documento para orientar a LZASANTOSWORLDSGAMES na organizacao dos direitos de Aes Divinus e no preparo para publicacao na Steam.

> Aviso: este documento e um guia operacional e nao substitui advogado, contador, especialista tributario ou consultoria oficial da Steamworks. Antes de lancar comercialmente, revisar todos os contratos, licencas, dados fiscais, classificacao indicativa e regras da plataforma.

## 1. O Que Significa Ter os Direitos de um Jogo

Ter os direitos de um jogo significa que a empresa ou pessoa publicadora consegue provar que pode usar, vender, distribuir, modificar e divulgar todos os elementos que formam o jogo.

Isso inclui:

- codigo-fonte;
- nome do jogo;
- logo do jogo;
- marca da desenvolvedora;
- personagens;
- historia, missoes, dialogos e lore;
- artes 2D;
- modelos 3D;
- animacoes;
- interface;
- musicas;
- efeitos sonoros;
- fontes tipograficas;
- bibliotecas, frameworks e engines;
- plugins, SDKs e APIs;
- imagens promocionais;
- trailers;
- documentos de design;
- banco de dados, saves e sistemas online.

Se qualquer parte foi feita por outra pessoa, IA, freelancer, colaborador, site de assets ou biblioteca externa, precisa existir permissao clara de uso comercial.

## 2. Documentos Para Provar os Direitos

Guardar uma pasta juridica/administrativa do projeto com:

- contrato social, CNPJ ou documento legal da empresa;
- documento dizendo que a empresa e dona do jogo;
- contratos de cessao de direitos dos criadores;
- contratos de freelancers;
- comprovantes de pagamento de artistas, compositores, programadores e designers;
- licencas de assets comprados ou baixados;
- licencas de musicas e efeitos sonoros;
- licencas de fontes;
- licencas de bibliotecas open source usadas;
- comprovantes de autoria de logos e marcas;
- registros de versoes do projeto;
- prints/exports de permissao de sites de asset;
- documentacao das ferramentas de IA usadas, quando aplicavel;
- autorizacao de uso de qualquer conteudo de terceiros.

Regra pratica: se nao da para provar que pode usar comercialmente, nao usar no build final.

## 3. Nome, Marca e Logo

Antes de publicar:

- verificar se `Aes Divinus` nao entra em conflito com marca ja registrada;
- verificar se `LZASANTOSWORLDSGAMES` pode ser usada comercialmente;
- manter arquivos originais da logo;
- guardar comprovante de autoria/cessao da logo;
- evitar usar marcas de terceiros nas imagens, trailer, screenshots ou interface.

Recomendado: consultar busca de marcas no INPI no Brasil e bases internacionais quando houver lancamento mundial.

## 4. Conteudo Que Nao Deve Ser Publicado na Steam

Pelas diretrizes do Steam Direct, nao publicar conteudo que:

- promova odio, violencia ou discriminacao contra grupos;
- tenha imagens nuas ou sexualmente explicitas de pessoas reais;
- tenha conteudo adulto sem rotulagem e age gate adequados;
- seja difamatorio;
- use conteudo sem direitos suficientes;
- viole leis de qualquer jurisdicao onde sera distribuido;
- seja ofensivo apenas para chocar ou causar repulsa;
- explore criancas de qualquer forma.

Para Aes Divinus, isso significa revisar cenas de violencia, horror, medo, sangue, texto politico e qualquer imagem/audio externo.

## 5. Cadastro da Empresa na Steamworks

Para publicar pela empresa desenvolvedora, a Steam exige que a entidade legal cadastrada seja a mesma que tem direito de publicar o produto e assinar o contrato de distribuicao.

Preparar:

- nome legal exato da empresa;
- tipo juridico da empresa;
- endereco legal;
- dados do responsavel autorizado a assinar;
- documentos da empresa;
- conta bancaria no mesmo nome legal;
- dados fiscais consistentes.

Importante: a Steam orienta que o nome legal deve bater com documentos oficiais, banco e documentos fiscais. Nao usar apenas nome fantasia quando o campo pede nome legal.

## 6. Banco e Impostos

Antes de concluir onboarding:

- abrir ou confirmar conta bancaria no nome legal correto;
- conferir titularidade da conta;
- preparar dados bancarios internacionais se aplicavel;
- preencher entrevista fiscal da Steam;
- informar numero fiscal adequado, como CNPJ no Brasil;
- guardar comprovantes fiscais.

Segundo a documentacao da Steamworks, a verificacao fiscal pode levar alguns dias uteis e pode pedir documentos adicionais.

## 7. Taxa Steam Direct

Para cada jogo/app novo na Steam, e necessario pagar a taxa Steam Direct de US$ 100 ou equivalente regional.

Pontos importantes:

- a taxa e por produto;
- nao pode ser paga com Steam Wallet;
- nao e reembolsavel de imediato;
- pode ser recuperada depois que o produto atingir pelo menos US$ 1.000 de receita bruta ajustada em vendas Steam e compras dentro do jogo, conforme regras da Valve.

## 8. Processo de Publicacao na Steam

Fluxo geral:

1. Criar ou acessar conta Steamworks.
2. Completar onboarding da empresa.
3. Assinar documentos digitais.
4. Preencher banco e impostos.
5. Pagar taxa Steam Direct.
6. Criar o app do jogo.
7. Completar checklist da pagina da loja.
8. Enviar a pagina da loja para revisao.
9. Publicar pagina `Em breve` depois de aprovada.
10. Preparar build final ou quase final.
11. Enviar build para revisao.
12. Corrigir feedback da Valve, se houver.
13. Definir preco e data.
14. Lancar manualmente quando tudo estiver aprovado.

Planejamento:

- revisao de loja costuma levar 3 a 5 dias uteis;
- revisao de build tambem costuma levar 3 a 5 dias uteis;
- planejar pelo menos 7 dias uteis para cada revisao;
- pagina `Em breve` precisa ficar publica antes do lancamento conforme regras atuais da Steam;
- existe espera minima associada ao Steam Direct/onboarding antes do primeiro lancamento.

## 9. Pagina da Loja

A pagina da loja precisa refletir o jogo real.

Preparar:

- nome do jogo;
- capsule art;
- screenshots reais de gameplay;
- trailer real;
- descricao curta;
- descricao completa;
- generos/tags;
- idiomas;
- requisitos minimos;
- requisitos recomendados;
- informacoes de controle;
- conteudo adulto/sensivel, se houver;
- preco;
- data de lancamento;
- suporte;
- links oficiais;
- publisher/developer corretos.

Nao prometer recursos que nao existem na build enviada.

## 10. Assets Graficos da Steam

A Steam exige assets graficos especificos para loja e biblioteca.

Itens comuns:

- Header Capsule: 920 x 430;
- Small Capsule: 462 x 174;
- Main Capsule: 1232 x 706;
- Vertical Capsule: 748 x 896;
- Library Capsule;
- Library Hero;
- Library Logo;
- screenshots em formato adequado;
- icone do aplicativo.

Usar templates oficiais da Steamworks e conferir regras de texto, logos, premios, descontos e elementos promocionais.

## 11. Build do Jogo Para Steam

Para Aes Divinus, a build Steam deve focar em:

- Windows;
- Linux/Steam Deck;
- macOS somente se a empresa decidir suportar e testar.

Android e iOS nao sao builds de distribuicao normal pela Steam.

Antes de enviar:

- remover comportamento de desenvolvimento;
- remover tokens e segredos;
- garantir que saves funcionam offline;
- testar primeira inicializacao limpa;
- testar reset;
- testar teclado/controle;
- testar tela cheia/janela;
- testar resolucoes diferentes;
- testar hardware fraco;
- testar audio;
- testar instalacao pelo SteamPipe;
- confirmar que o jogo abre pelo cliente Steam.

## 12. Saves, Steam Cloud e GitHub Sync

Para uma versao Steam, o caminho recomendado e usar Steam Cloud para saves do jogador.

O GitHub Sync atual do projeto pode ser util para desenvolvimento, testes ou builds internas, mas deve ser avaliado antes de publicar na Steam porque:

- exige token GitHub do usuario/desenvolvedor;
- usa servico externo fora da Steam;
- pode gerar preocupacao de privacidade/revisao;
- nao e o fluxo padrao esperado para jogadores Steam.

Recomendacao para build Steam:

- manter IndexedDB/local save;
- implementar Steam Cloud;
- desativar exigencia de token GitHub para jogadores comuns;
- manter GitHub Sync apenas em modo desenvolvedor/admin, se necessario.

## 13. Compras Dentro do Jogo

Se Aes Divinus vender itens, moedas ou DLC dentro da versao Steam, deve usar Steam Wallet/Microtransaction API.

Permitido sem pagamento real:

- moeda interna ganha no jogo;
- lojas internas usando recursos ficticios;
- itens desbloqueados por progresso.

Se houver dinheiro real:

- usar Steam Wallet na Steam;
- mostrar preco e conteudo com clareza;
- respeitar regras de reembolso e compras da plataforma;
- evitar sistemas externos de pagamento dentro da build Steam.

## 14. Classificacao Indicativa e Conteudo

Aes Divinus tem fantasia sombria, combate, medo, horror leve, possivel sangue/violencia estilizada e temas politicos. Isso deve ser declarado corretamente.

Preparar:

- lista de conteudos sensiveis;
- videos/screenshots representativos;
- descricao de violencia;
- descricao de horror/medo;
- descricao de compras, se existirem;
- descricao de interacao online, se existir;
- classificacao por territorio/plataforma quando exigida.

IARC pode ser usado em algumas lojas digitais participantes, mas a Steam pode exigir procedimentos proprios dependendo do territorio e do tipo de conteudo.

## 15. Privacidade, Dados e Criancas

Para reduzir risco com LGPD, GDPR, COPPA e regras de plataformas:

- coletar o minimo possivel;
- explicar finalidade dos dados;
- pedir aceite de privacidade;
- pedir confirmacao de idade ou responsavel quando necessario;
- nao salvar senha em texto;
- redigir token e email em saves remotos;
- permitir reset/exclusao de save local;
- publicar politica de privacidade;
- definir contato de privacidade;
- nao coletar dados de menores sem base legal/consentimento adequado.

Para Aes Divinus, manter:

- `PRIVACY_POLICY.md`;
- `TERMS_OF_USE.md`;
- `COMPLIANCE_RELEASE_CHECKLIST.md`;
- logs sem dados sensiveis;
- dependencia sem vulnerabilidade conhecida.

## 16. Open Source, Bibliotecas e SDKs

Criar um inventario de bibliotecas:

- Electron;
- Capacitor;
- dependencias npm;
- bibliotecas de audio;
- SDKs futuros da Steam;
- qualquer plugin externo.

Para cada uma:

- nome;
- versao;
- licenca;
- link;
- obrigacoes de atribuicao;
- se permite uso comercial;
- se exige disponibilizar codigo-fonte.

Evitar dependencias sem licenca clara.

## 17. Checklist de Prontidao Legal

Antes de publicar:

- a empresa tem direito sobre todo o jogo;
- todos os colaboradores assinaram cessao/licenca;
- todos os assets externos tem licenca comercial;
- musicas/sons tem licenca comprovada;
- fontes tem permissao comercial;
- marcas foram verificadas;
- politica de privacidade publicada;
- termos de uso publicados;
- classificacao indicativa resolvida;
- compras reais usam sistema da plataforma;
- dados de menores tratados corretamente;
- build nao contem token ou segredo;
- Steam Cloud planejado/implementado para Steam;
- pagina da loja nao promete recurso inexistente;
- trailer/screenshots mostram gameplay real;
- banco e impostos da Steamworks estao aprovados;
- build passou em testes.

## 18. Checklist Especifico Para Aes Divinus

Itens ja iniciados no projeto:

- termos de uso;
- politica de privacidade;
- checklist de conformidade;
- aceite de idade/termos/privacidade no cadastro;
- redacao de email/token/device id no save remoto;
- testes automatizados de seguranca;
- builds Windows/Linux/Android/iOS projeto;
- releases no GitHub.

Itens ainda recomendados antes da Steam:

- migrar save Steam para Steam Cloud;
- criar build Steam sem GitHub token para jogador comum;
- criar SteamPipe scripts;
- preparar App ID e depots;
- preparar capsulas Steam em todos os tamanhos;
- gravar trailer de gameplay;
- tirar screenshots finais;
- revisar licencas de todos os assets;
- revisar documento com advogado;
- definir classificacao indicativa;
- assinar build se necessario;
- testar no Steam Deck.

## 19. Fontes Oficiais e Referencias

- Steamworks Onboarding: https://partner.steamgames.com/doc/gettingstarted/onboarding
- Steam Direct Fee: https://partner.steamgames.com/doc/gettingstarted/appfee
- Steam Direct Partner Program: https://partner.steamgames.com/steamdirect
- Steam Release Process: https://partner.steamgames.com/doc/store/releasing
- Steam Review Process: https://partner.steamgames.com/doc/store/review_process
- Steam Coming Soon: https://partner.steamgames.com/doc/store/coming_soon
- Steam Graphical Assets: https://partner.steamgames.com/doc/store/assets
- Steam Graphical Asset Rules: https://partner.steamgames.com/doc/store/assets/rules
- Steam Microtransactions: https://partner.steamgames.com/doc/features/microtransactions
- Steam Cloud: https://partner.steamgames.com/doc/features/cloud
- ANPD/LGPD guias: https://www.gov.br/anpd/pt-br
- FTC COPPA: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
- IARC: https://globalratings.com/
