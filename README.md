# Aes Divinus

**Aes Divinus** e um RPG tatico por turnos de fantasia medieval sombria criado para a LZASANTOSWORLDSGAMES. O projeto combina combate por posicoes, coragem, medo, lideranca, consequencias persistentes, criacao de personagem, cenas de missao, gestao de principado e banco local de progresso.

Esta versao e uma implementacao jogavel web/desktop/mobile do documento de design do jogo, com empacotamento para Windows, Linux, Android e projeto iOS.

## Status

- Jogo web funcional.
- App desktop com Electron.
- Windows installer NSIS gerado.
- Linux portatil gerado.
- Android APK debug gerado.
- Projeto iOS Capacitor criado e pronto para Xcode.
- Banco local IndexedDB ativo.
- Testes automatizados passando.

## Principais sistemas do jogo

- **Login e cadastro lembrados:** cadastro minimo, login local, modo convidado, perfis lembrados por dispositivo e campos preparados para teclado mobile.
- **Criacao de personagem:** nome, tratamento, origem, corpo, forma corporal, rosto, formato/cor dos olhos, tipo/cor do cabelo, barba, paleta e arma inicial.
- **Fluxo sequencial de telas:** conta, personagem, titulo, cenas, mesa de missoes, combate, arsenal, principado e codex.
- **Cenas de missao:** cenas narrativas antes das missoes, com camera, escolha e efeito.
- **Campanha em 47 entradas:** prologo jogavel na Floresta de Sangue, cinco atos e epilogo com conselho, investigacao, resgate, escolta, companheiros, defesa, politica, chefes, cerco, dungeon, escolhas criticas e final multifasico.
- **Combate tatico por turnos:** unidades com 2 PA, iniciativa, fila de turno, movimento, ataque, guarda, inspiracao, flecha de fogo e espera.
- **Sistema de posicoes:** seis posicoes por lado, linha de frente, retaguarda, altura, cobertura e alcance.
- **Acerto e dano separados:** chance de acerto por agilidade, defesa, cobertura, distancia e estado; dano por arma, forca, armadura e mitigacao.
- **Medo e coragem:** estados psicologicos como Firme, Nervoso, Assustado, Apavorado, Paralisado e Desesperado.
- **Lideranca:** William pode inspirar aliados, recuperar coragem e fortalecer iniciativa.
- **Principado:** comida, madeira, ferro, ouro, tropas, infraestrutura e reputacao por faccoes.
- **Consequencias persistentes:** resultados de combate e gestao alteram personagens, recursos, diario e reputacao.
- **Arsenal, lojas e economia:** moeda Coroas de Aes, compra, venda, equipamento por personagem e areas de loja para armas, armaduras, ferramentas e reliquias.
- **Pedras dos itens:** armas, armaduras e ferramentas possuem pedra associada para lore, gameplay e direcao de modelagem.
- **Codex:** explicacao interna dos sistemas principais.
- **Save completo:** todo progresso e salvo no IndexedDB com autosave.
- **Autosave GitHub obrigatorio no fluxo:** criar conta, logar, criar personagem e salvar progresso disparam envio para o repositorio configurado, usando token pessoal fornecido pelo dono do jogo.
- **Deteccao de hardware:** o jogo identifica CPU logica, memoria aproximada, GPU/WebGL, tela, pixel ratio, touch e preferencia de movimento reduzido para aplicar qualidade automaticamente.
- **Audio adaptativo:** mapa sonoro por tela/acao com alternativas pesquisadas no Pixabay, controle de volume salvo no banco e fallback Web Audio para nao quebrar quando os MP3s locais ainda nao existem.
- **Configuracoes completas de jogador:** fonte, escala da interface, tamanho de tela, densidade, contraste, modos de daltonismo, movimento reduzido, velocidade de combate, botoes maiores, privacidade e confirmacao de reset.
- **Seguranca do save:** sanitizacao de entradas/textos, payloads sensiveis redigidos, envelope AES-GCM no IndexedDB quando WebCrypto esta disponivel e hash de integridade por snapshot/evento.
- **Conformidade legal:** aceite de termos/privacidade/idade antes de cadastro, politica de privacidade, termos de uso, checklist de lancamento e minimizacao de dados no save remoto.

## Telas implementadas

1. **Conta** - login, cadastro e convidado.
2. **Personagem** - criacao modular do protagonista com corpo, rosto, olhos, cabelo, barba e modelo base.
3. **Titulo** - menu principal com logo do jogo e marca da desenvolvedora.
4. **Cena** - narrativa/cutscene antes da missao.
5. **Mesa** - selecao de missoes e diario.
6. **Combate** - arena tatica por turnos.
7. **Arsenal** - lojas, Coroas de Aes, compra/venda, equipamentos, pedras e direcao visual.
8. **Principado** - recursos, reputacao e politicas.
9. **Config** - diagnostico do dispositivo, configuracao grafica, acessibilidade, audio e seguranca.
10. **Codex** - sistemas e referencias do jogo.

## Campanha

A campanha foi adequada para a estrutura completa solicitada:

- Prologo - Floresta de Sangue: `Cena P0 - Abertura`, `Missao P1 - Pela Estrada Velha`, `Cena P2 - Sinais na Mata`, `Missao P3 - Emboscada`, `Cena P4 - Depois do Sangue`, `Missao P5 - O Sobrevivente`, `Cena P6 - A Transformacao`, `Missao P7 - A Real Batalha` e `Cena P8 - O Hubris`.
- Ato I - O Peso da Coroa: `Conselho de Pedra` ate `Chefe - O Arauto da Mata`.
- Ato II - Fronteiras em Chamas: `Ponte de Cinzas` ate `O General sem Rosto`.
- Ato III - Vozes Sob a Terra: `Mosteiro Abandonado` ate `A Boca da Terra`.
- Ato IV - Reino Dividido: `Mensageiros` ate `O Trono Vazio`.
- Ato V - Aes Divinus: `Marcha Final` ate `Aes Divinus`.
- Epilogo: `Ultima Ordem`.

Cada missao possui numero, ato, tipo, objetivo, impacto, objetivos opcionais, cenas previas, recompensas, progressao para a proxima entrada e comportamento de gestao ou combate. As missoes de chefe usam ameaca sobrenatural e medo; missoes de defesa usam reforcos e pressao por rodadas; cenas politicas e escolhas criticas modificam recursos e reputacao.

## Audio e fontes Pixabay

O sistema de audio fica em `src/audio.js` e usa arquivos locais em `assets/audio/`. A tela **Config** lista os sons por funcao e permite ligar/desligar som ou ajustar volume. Esses ajustes sao salvos no IndexedDB.

Funcoes sonoras implementadas:

- clique de interface e abertura de menu
- ambiente de titulo e dark fantasy
- cena narrativa
- floresta/exploracao
- inicio de combate
- ataque de espada, impacto em armadura, arco/flecha e fogo
- medo/sobrenatural
- vitoria e derrota

Fontes pesquisadas no Pixabay:

- https://pixabay.com/sound-effects/search/ui%20click/
- https://pixabay.com/sound-effects/search/fantasy%20menu/
- https://pixabay.com/sound-effects/search/dark%20fantasy/
- https://pixabay.com/sound-effects/search/fantasy%20forest/
- https://pixabay.com/sound-effects/search/sword/
- https://pixabay.com/sound-effects/search/bow%20arrow/
- https://pixabay.com/sound-effects/search/fire/
- https://pixabay.com/sound-effects/horror-horror-sting-25237/
- https://pixabay.com/sound-effects/musical-medieval-fanfare-6826/
- https://pixabay.com/sound-effects/search/defeat/

O jogo evita hotlink externo. Os 29 arquivos MP3 locais ja estao dentro de `assets/audio/` e podem ser regenerados com:

```powershell
npm run audio:generate
```

O download automatico direto do Pixabay foi bloqueado pela protecao do site durante a execucao local; por isso os slots foram preenchidos com MP3s gerados localmente e o manifesto preserva os links Pixabay para substituicao manual/licenciada quando desejado. Consulte sempre a licenca oficial: https://pixabay.com/service/license-summary/.

## Configuracoes do jogador

A aba **Config** concentra opcoes para diferentes tipos de jogadores e dispositivos:

- escala de fonte
- escala da interface
- tamanho/largura da tela
- densidade compacta, normal ou espacada
- contraste normal ou alto
- modos de cor para deuteranopia, protanopia e tritanopia
- movimento automatico, reduzido ou completo
- espacamento de texto
- velocidade de combate
- tamanho de botoes
- autosave
- confirmacao para reset da campanha
- modo privacidade para desfocar email/marca em captura ou streaming

Todas as configuracoes ficam salvas no IndexedDB junto do resto do progresso.

## Login lembrado e GitHub Sync

O cadastro e o login sao lembrados por dispositivo quando a opcao **Lembrar cadastro e login neste dispositivo** esta marcada. O jogo salva perfis recentes no banco local para preencher nome/email na proxima abertura, e a senha digitada nao entra no estado do jogo.

Na aba **Config**, o painel **Autosave no GitHub** configura o envio automatico obrigatorio do fluxo de save:

- usuario ou organizacao
- repositorio
- branch
- caminho do arquivo de save
- token pessoal do jogador

Cada save local tambem tenta enviar snapshots JSON para o GitHub pela API Contents. Isso acontece ao criar conta, logar, criar personagem, comprar/vender/equipar itens, iniciar/avancar missoes, combater, mudar configuracoes e salvar manualmente. O token fica apenas no armazenamento local criptografado quando WebCrypto esta disponivel, e e removido do snapshot enviado ao repositorio.

Importante: o GitHub nao aceita escrita anonima pela API. Se o token pessoal ainda nao foi preenchido, o save local continua funcionando e o painel mostra que o envio remoto esta pendente por falta de token.

Por padrao, o jogo fica configurado para `lzvsrx/aesdivinuscomplete` e salva:

- `saves/aes-divinus-save.json`: snapshot completo.
- `saves/systems/account.json`: conta, perfis lembrados e sessao do dispositivo.
- `saves/systems/character.json`: personagem criado.
- `saves/systems/campaign.json`: campanha, missao atual, cenas e diario.
- `saves/systems/principality.json`: recursos, reputacoes e estado do principado.
- `saves/systems/inventory-economy.json`: itens, equipamentos, moeda e transacoes.
- `saves/systems/combat.json`: combate atual e herois.
- `saves/systems/settings.json`: configuracoes, audio, hardware e graficos.
- `saves/systems/journal-codex.json`: diario e codex.

## Configuracao automatica por hardware

Ao iniciar, o jogo avalia o dispositivo e escolhe um perfil:

- Muito baixo
- Baixo
- Medio
- Alto
- Ultra

O perfil ajusta:

- FPS alvo
- escala de renderizacao
- texturas
- animacoes
- sombras
- particulas
- efeitos de UI
- tamanho de botoes em dispositivos touch

A tela **Hardware** permite reavaliar o dispositivo ou trocar a qualidade manualmente. O resultado e salvo no IndexedDB junto com o resto do progresso.

## Armas e ferramentas

- Espada de ferro
- Lanca de ferro
- Lanca Aes
- Machado de ferro
- Martelo de guerra
- Arco de batedor
- Flecha de fogo
- Kit de campo
- Ferramentas de percepcao
- Bussola Aes

## Lojas e moeda

A moeda de jogador e **Coroas de Aes (CA)**. A aba **Arsenal** possui tres areas de venda:

- **Forja do Principado:** armas e armaduras de combate.
- **Intendencia Real:** ferramentas, suprimentos e armaduras leves.
- **Relicario Aes:** itens raros ligados a pedras sobrenaturais.

Cada item tem preco de compra, valor de venda, tipo, slot de equipamento, descricao e pedra vinculada, como Granito Jurado, Ametista Aes, Hematita, Onix Real, Agata de Cura e Safira de Norte.

Cada item possui funcao de gameplay, silhueta, materiais e leitura visual para orientar icones, modelagem 3D e balanceamento.

## Banco de dados local e seguranca

O jogo usa IndexedDB com o banco `aes-divinus-db`, versao 3.

Stores:

- `saves`
- `accounts`
- `playerCharacters`
- `campaigns`
- `heroes`
- `principalities`
- `battles`
- `events`
- `security`

O save guarda um snapshot completo do estado e tambem registra eventos auditaveis como login, cadastro, criacao de personagem, inicio de missao, ataque, movimento, medo, inspiracao, fim de turno, vitoria, derrota e politicas do principado.

Medidas de seguranca implementadas:

- senha digitada nao e salva no estado.
- nomes, emails, textos e payloads de eventos passam por sanitizacao.
- renderizacao escapa HTML para reduzir risco de XSS vindo de save local/importado.
- payloads com nomes como `password`, `senha`, `token`, `secret`, `certificate` ou `profile` sao redigidos.
- quando WebCrypto esta disponivel, o snapshot principal e salvo em envelope AES-GCM com chave local do dispositivo.
- cada snapshot e evento recebe hash de integridade.
- saves antigos em texto puro continuam carregando e sao migrados no proximo save.
- o token do GitHub nao e enviado dentro do arquivo de save remoto.
- email bruto, token e identificador do dispositivo sao redigidos no save remoto estruturado.

## Documentos legais e conformidade

Arquivos incluidos no projeto:

- `PRIVACY_POLICY.md`
- `TERMS_OF_USE.md`
- `COMPLIANCE_RELEASE_CHECKLIST.md`
- `docs/PLANO_RESPOSTA_INCIDENTES_CIBERNETICOS.md`
- `docs/DIREITOS_PUBLICACAO_STEAM_REGRAS.md`

Esses documentos ajudam a preparar lancamento, revisao de loja e auditoria interna, mas devem ser revisados por advogado antes de venda publica ou publicacao mundial.

O plano de incidentes define como preservar evidencias, conter falhas, avaliar dados pessoais e acionar ANPD, titulares afetados, Policia Federal, CERT.br, plataformas ou outras autoridades quando houver obrigacao legal, indicio de crime cibernetico ou risco relevante para usuarios/empresa.

## Como rodar em desenvolvimento

Requisitos:

- Node.js 25+ ou versao moderna compativel
- npm

Instale dependencias:

```powershell
npm install
```

Rode o servidor local:

```powershell
npm start
```

Abra:

```text
http://localhost:5173
```

## Testes

```powershell
npm test
```

Cobertura atual:

- inicio de batalha e iniciativa
- ataque, acerto, dano e PA
- medo/coragem
- decisoes do principado
- save/load
- eventos no banco
- cadastro/criacao de personagem
- perfis lembrados no login
- lojas, Coroas de Aes, compra, equipamento e bloqueio de venda de item equipado
- envio de save ao GitHub com repositorio configurado pelo usuario
- cenas entrando em combate
- campanha completa com 47 entradas numeradas
- prologo da Floresta de Sangue antes dos cinco atos
- catalogo de audio, fontes Pixabay e fallback sem quebra
- 29 arquivos MP3 locais para os slots de audio do jogo
- configuracoes de acessibilidade/interface persistentes
- sanitizacao, criptografia local e hashes do banco
- aceite legal/idade e redacao de dados sensiveis no save remoto
- deteccao de hardware e aplicacao de perfil grafico

## Build web

```powershell
npm run prepare:web
```

Gera `dist-web/`, usado por Electron e Capacitor.

## Build Windows

```powershell
npm run build:windows
```

Saidas:

- `release/Aes Divinus Setup 0.1.5.exe`
- `release/win-unpacked/`

## Build Linux

No Windows, o comando abaixo gera uma pasta Linux portatil:

```powershell
npm run build:linux
```

Saida:

- `release/linux-unpacked/`

Para gerar AppImage e `.deb`, rode em Linux ou WSL:

```bash
npm run build:linux:installer
```

## Build Android

O projeto Android usa Capacitor.

Primeira vez, se o JDK 21 portatil nao existir:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-android-jdk21.ps1
```

Gerar APK debug:

```powershell
npm run android:apk
```

Saida:

- `android/app/build/outputs/apk/debug/app-debug.apk`

## Build iOS

O projeto iOS foi criado com Capacitor:

```powershell
npm run ios:sync
```

No Windows, nao e possivel gerar `.ipa` assinado. Para finalizar iOS, abra em um Mac:

```text
ios/App/App.xcworkspace
```

Depois instale CocoaPods, configure assinatura Apple no Xcode, rode Archive e exporte o `.ipa`.

## Build IPA pelo GitHub

O workflow `.github/workflows/build-ios-ipa.yml` gera o IPA em runner macOS do GitHub Actions e envia o arquivo para a release informada.

Sem secrets Apple, ele gera `Aes-Divinus-iOS-unsigned.ipa`, util para validacao e empacotamento, mas nao instalavel em iPhone comum. Para gerar IPA assinado e instalavel, configure estes secrets no GitHub:

- `APPLE_CERTIFICATE_BASE64`: certificado `.p12` em base64.
- `APPLE_CERTIFICATE_PASSWORD`: senha do `.p12`.
- `APPLE_PROVISIONING_PROFILE_BASE64`: perfil `.mobileprovision` em base64.
- `APPLE_TEAM_ID`: Team ID da Apple Developer.
- `KEYCHAIN_PASSWORD`: senha temporaria para o keychain do runner.

Depois rode manualmente **Actions > Build iOS IPA > Run workflow** usando `v0.1.5` como release tag.

## Scripts principais

```json
{
  "start": "python -m http.server 5173",
  "test": "node --test tests/*.test.mjs",
  "prepare:web": "node scripts/prepare-web.mjs",
  "desktop": "npm run prepare:web && electron .",
  "build:windows": "npm run prepare:web && electron-builder --win nsis --x64",
  "build:linux": "npm run prepare:web && electron-builder --linux dir --x64",
  "build:linux:installer": "npm run prepare:web && electron-builder --linux AppImage deb --x64",
  "android:apk": "npm run android:sync && powershell -ExecutionPolicy Bypass -File scripts/build-android-debug.ps1",
  "ios:sync": "npm run prepare:web && cap sync ios"
}
```

## Estrutura do projeto

```text
assets/                 logos, icones e marca da desenvolvedora
src/                    jogo web, sistemas, banco e UI
tests/                  testes automatizados
electron/               entrada do app desktop
android/                projeto nativo Android Capacitor
ios/                    projeto nativo iOS Capacitor
scripts/                scripts de build e setup
build/                  icones de empacotamento
release/                builds geradas localmente, nao versionadas
```

## Arte e marca

- Logo do jogo: `assets/aes-divinus-logo.png`
- Icones do jogo: `assets/aes-divinus-icon-512.png`, `assets/aes-divinus-icon-192.png`, `assets/favicon.png`
- Logo LZASANTOSWORLDSGAMES: `assets/lzasantosworldsgames-logo.png`

## Instaladores e releases

Os binarios grandes devem ficar no GitHub Releases, nao no historico Git:

- Windows: `.exe`
- Linux: `.zip` portatil ou AppImage/deb quando gerado em Linux
- Android: `.apk`
- iOS: `.ipa` assinado em macOS/Xcode

## Limitacoes conhecidas

- O login/cadastro e singleplayer/local, com memoria por dispositivo e GitHub Sync opcional. Login online real entre contas exige servidor, API e autenticacao segura.
- O iOS precisa de macOS, Xcode, CocoaPods e certificado Apple para gerar IPA.
- AppImage/deb completos devem ser gerados em Linux ou WSL; no Windows foi gerada versao Linux portatil.

## Desenvolvedora

LZASANTOSWORLDSGAMES

## Licenca

Todos os direitos reservados a LZASANTOSWORLDSGAMES, salvo definicao posterior de licenca.
