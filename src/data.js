export const FEAR_STATES = {
  steady: { label: "Firme", initiative: 0, accuracy: 0, defense: 0, skipChance: 0 },
  nervous: { label: "Nervoso", initiative: -1, accuracy: -4, defense: 0, skipChance: 0 },
  afraid: { label: "Assustado", initiative: -3, accuracy: -9, defense: -2, skipChance: 0 },
  terrified: { label: "Apavorado", initiative: -5, accuracy: -14, defense: -4, skipChance: 0.24 },
  paralyzed: { label: "Paralisado", initiative: -99, accuracy: -99, defense: -8, skipChance: 1 },
  desperate: { label: "Desesperado", initiative: -7, accuracy: -18, defense: -6, skipChance: 0.34 }
};

export const WEAPONS = {
  iron_sword: { id: "iron_sword", name: "Espada de ferro", min: 5, max: 10, type: "cut", accuracy: 5, range: 1, strengthScale: 0.55 },
  iron_axe: { id: "iron_axe", name: "Machado de ferro", min: 6, max: 12, type: "cut", accuracy: 0, range: 1, strengthScale: 0.7 },
  spear: { id: "spear", name: "Lanca de ferro", min: 5, max: 10, type: "pierce", accuracy: 3, range: 2, strengthScale: 0.45 },
  bow: { id: "bow", name: "Arco", min: 3, max: 8, type: "pierce", accuracy: 2, range: 5, strengthScale: 0.25, ammo: "arrow" },
  fire_bow: { id: "fire_bow", name: "Flecha de fogo", min: 3, max: 8, type: "fire", accuracy: 0, range: 5, strengthScale: 0.2, burn: 2 },
  aes_spear: { id: "aes_spear", name: "Lanca Aes", min: 10, max: 15, type: "pierce", accuracy: 7, range: 2, strengthScale: 0.55, courageDamage: 6 },
  claws: { id: "claws", name: "Garras", min: 5, max: 12, type: "cut", accuracy: 4, range: 1, strengthScale: 0.55, threat: 10 },
  dread: { id: "dread", name: "Uivo sobrenatural", min: 0, max: 2, type: "supernatural", accuracy: 10, range: 6, strengthScale: 0, courageDamage: 14, threat: 18 }
};

export const ARMORS = {
  cloth: { id: "cloth", name: "Roupa reforcada", mitigation: { cut: 1, pierce: 1, impact: 0, fire: 0, supernatural: 0 }, defense: 1, initiative: 1, dodge: 4, strengthReq: 0 },
  light: { id: "light", name: "Couro leve", mitigation: { cut: 2, pierce: 1, impact: 1, fire: 0, supernatural: 0 }, defense: 2, initiative: 1, dodge: 3, strengthReq: 0 },
  medium: { id: "medium", name: "Malha media", mitigation: { cut: 4, pierce: 3, impact: 2, fire: 0, supernatural: 0 }, defense: 4, initiative: -1, dodge: 0, strengthReq: 8 },
  heavy: { id: "heavy", name: "Brigantina pesada", mitigation: { cut: 7, pierce: 5, impact: 3, fire: 1, supernatural: 0 }, defense: 6, initiative: -3, dodge: -3, strengthReq: 12 }
};

export const POSITION_TRAITS = [
  { lane: "front", cover: 0, height: 0, label: "Frente alta" },
  { lane: "front", cover: 1, height: 0, label: "Frente cobertura" },
  { lane: "front", cover: 0, height: 1, label: "Frente elevada" },
  { lane: "back", cover: 2, height: 0, label: "Retaguarda coberta" },
  { lane: "back", cover: 1, height: 1, label: "Retaguarda elevada" },
  { lane: "back", cover: 0, height: 0, label: "Retaguarda aberta" }
];

export const HEROES = [
  {
    id: "william",
    name: "William",
    side: "ally",
    role: "Lider",
    maxHp: 34,
    hp: 34,
    strength: 10,
    agility: 14,
    perception: 12,
    courage: 78,
    loyalty: 100,
    inspiration: 16,
    defense: 4,
    weapon: "iron_sword",
    armor: "medium",
    position: 1,
    personality: "Determinado",
    trauma: "Peso da coroa"
  },
  {
    id: "ethan",
    name: "Ethan",
    side: "ally",
    role: "Arqueiro",
    maxHp: 25,
    hp: 25,
    strength: 7,
    agility: 12,
    perception: 15,
    courage: 64,
    loyalty: 72,
    inspiration: 4,
    defense: 2,
    weapon: "bow",
    armor: "light",
    position: 4,
    personality: "Pragmatico",
    trauma: "Culpa antiga"
  },
  {
    id: "albert",
    name: "Albert",
    side: "ally",
    role: "Defensor",
    maxHp: 40,
    hp: 40,
    strength: 14,
    agility: 9,
    perception: 9,
    courage: 70,
    loyalty: 68,
    inspiration: 2,
    defense: 6,
    weapon: "spear",
    armor: "heavy",
    position: 0,
    personality: "Leal",
    trauma: "Ferida no ombro"
  }
];

export const ENEMY_SETS = {
  forest_first_contact: [
    {
      id: "barbarian_1",
      name: "Saqueador",
      side: "enemy",
      role: "Barbaro",
      maxHp: 24,
      hp: 24,
      strength: 9,
      agility: 10,
      perception: 8,
      courage: 52,
      loyalty: 0,
      inspiration: 0,
      defense: 2,
      weapon: "iron_axe",
      armor: "light",
      position: 1,
      ai: "aggressive"
    },
    {
      id: "barbarian_2",
      name: "Batedor",
      side: "enemy",
      role: "Arqueiro",
      maxHp: 19,
      hp: 19,
      strength: 7,
      agility: 13,
      perception: 12,
      courage: 48,
      loyalty: 0,
      inspiration: 0,
      defense: 1,
      weapon: "bow",
      armor: "cloth",
      position: 4,
      ai: "archer"
    }
  ],
  manifestation: [
    {
      id: "dread_wolf",
      name: "Manifestacao",
      side: "enemy",
      role: "Criatura aterrorizante",
      size: 2,
      maxHp: 45,
      hp: 45,
      strength: 15,
      agility: 11,
      perception: 14,
      courage: 95,
      loyalty: 0,
      inspiration: 0,
      defense: 5,
      weapon: "claws",
      armor: "medium",
      position: 2,
      ai: "terror"
    }
  ]
};

export const MISSIONS = [
  {
    id: "blood_forest",
    act: "Prologo",
    title: "Floresta de Sangue",
    type: "Exploracao + combate",
    objective: "Sobreviva ao contato, mantenha William vivo e elimine a ameaca humana.",
    optional: ["Vencer antes da rodada 6", "Nenhum aliado cair", "Usar inspiracao em um aliado abalado"],
    clockLimit: 8,
    enemySet: "forest_first_contact",
    eventRounds: {
      2: "Os inimigos reorganizam a linha e procuram cobertura.",
      3: "Um uivo distante testa a coragem do grupo.",
      4: "Reforcos barbaros se aproximam pela estrada.",
      6: "A pressao psicologica aumenta; a retirada fica mais dificil."
    },
    rewards: { food: 12, wood: 6, iron: 4, gold: 9, troops: 2, reputation: { companions: 5, infantry: 4, peasants: 2 } }
  },
  {
    id: "empty_granaries",
    act: "Ato I",
    title: "Celeiros Vazios",
    type: "Investigacao/gestao",
    objective: "Escolha uma prioridade do principado e prepare a proxima expedicao.",
    optional: ["Preservar comida", "Evitar queda de reputacao camponesa"],
    managementOnly: true,
    rewards: { food: 8, wood: 2, iron: 0, gold: 6, troops: 1, reputation: { peasants: 5, kingdom: 1 } }
  }
];

export const SCREEN_FLOW = [
  { id: "auth", label: "Conta", template: "portal", purpose: "Entrar, cadastrar e criar um save local no banco." },
  { id: "character_create", label: "Personagem", template: "atelier", purpose: "Definir identidade, origem, corpo, rosto, cabelo, barba, equipamento inicial e estilo." },
  { id: "title", label: "Titulo", template: "main-menu", purpose: "Continuar campanha, iniciar prologo, revisar codex e opcoes." },
  { id: "mission_scene", label: "Cena", template: "cinematic", purpose: "Apresentar contexto, objetivo, escolhas e consequencias antes da missao." },
  { id: "briefing", label: "Mesa", template: "war-table", purpose: "Escolher missoes, preparar grupo e administrar o principado." },
  { id: "combat", label: "Combate", template: "tactical", purpose: "Resolver encontros por turnos, posicoes, PA, medo e lideranca." },
  { id: "inventory", label: "Inventario", template: "forge", purpose: "Inspecionar armas, ferramentas, armaduras e seus papeis no jogo." },
  { id: "settings", label: "Hardware", template: "diagnostic", purpose: "Detectar dispositivo, escolher qualidade e adaptar UI/desempenho." },
  { id: "principality", label: "Principado", template: "domain", purpose: "Gerenciar recursos, reputacoes, obras e tropas." },
  { id: "codex", label: "Codex", template: "archive", purpose: "Consultar sistemas, faccoes, criaturas, dano, defesa e status." }
];

export const CHARACTER_OPTIONS = {
  origins: [
    { id: "abakorum", label: "Abakorum", bonus: "Lealdade +5", description: "Criado perto da coroa e acostumado a peso politico." },
    { id: "frontier", label: "Fronteira", bonus: "Coragem +5", description: "Sobreviveu a estradas, emboscadas e inverno duro." },
    { id: "monastery", label: "Mosteiro", bonus: "Percepcao +2", description: "Educado entre textos proibidos e pressagios." }
  ],
  bodies: ["Magro", "Definido", "Atletico", "Forte", "Corpulento"],
  faces: ["Oval", "Quadrado", "Diamante", "Alongado", "Triangular"],
  hair: ["Preto liso", "Castanho ondulado", "Loiro curto", "Grisalho preso", "Raspado"],
  beards: ["Sem barba", "Barba curta", "Cavanhaque", "Barba cheia", "Bigode nobre"],
  palettes: [
    { id: "iron_gold", label: "Ferro e ouro", primary: "#d0a951", secondary: "#313536" },
    { id: "blood_oath", label: "Juramento rubro", primary: "#b84b42", secondary: "#2a1918" },
    { id: "ash_blue", label: "Cinza azulado", primary: "#6e8fa4", secondary: "#232a2d" }
  ]
};

export const MISSION_SCENES = {
  blood_forest: [
    {
      title: "P0 - Abertura",
      camera: "Plano baixo na estrada, copa das arvores fechando a luz.",
      text: "William atravessa a Floresta de Sangue com Ethan e Albert. A estrada sumiu sob lama, marcas de carroca e silencio demais.",
      choice: "Avancar em formacao cautelosa",
      effect: "O grupo comeca com foco defensivo e o jogador aprende objetivo, medo e posicoes."
    },
    {
      title: "P1 - Rastros",
      camera: "Close em pegadas, cinzas frias e tecido rasgado preso a um galho.",
      text: "A Percepcao revela que os atacantes nao estavam fugindo. Eles esperavam por alguem.",
      choice: "Investigar antes do contato",
      effect: "O combate inicia com previsao de cobertura e alvos visiveis."
    },
    {
      title: "P2 - Primeiro Contato",
      camera: "Corte rapido para a clareira, inimigos a direita e grupo em seis posicoes a esquerda.",
      text: "Saqueadores saem da linha das arvores. William precisa vencer sem deixar o medo quebrar a formacao.",
      choice: "Entrar em combate",
      effect: "Inicia a arena tatica da Floresta de Sangue."
    }
  ],
  empty_granaries: [
    {
      title: "Conselho de Pedra",
      camera: "Mesa de guerra com paes duros, moedas contadas e mapas do principado.",
      text: "Os celeiros estao baixos. Uma decisao de governo pode salvar pessoas agora ou fortalecer a defesa para depois.",
      choice: "Abrir a mesa do principado",
      effect: "Libera decisoes de comida, defesa e infraestrutura."
    }
  ]
};

export const EQUIPMENT_DESIGNS = [
  {
    id: "iron_sword_design",
    kind: "Arma",
    name: "Espada de ferro",
    role: "Corpo a corpo equilibrado",
    silhouette: "Lamina reta, guarda curta em cruz e pomo circular gasto.",
    material: "Ferro escurecido, fio polido e couro marrom no cabo.",
    gameplay: "5-10 corte, bom acerto, escala moderada com Forca.",
    icon: "sword",
    color: "#d0a951"
  },
  {
    id: "aes_spear_design",
    kind: "Arma Aes",
    name: "Lanca Aes",
    role: "Alcance e perfuracao rara",
    silhouette: "Ponta longa em folha, runa vertical e haste reforcada.",
    material: "Metal claro com brilho interno violeta e anilhas douradas.",
    gameplay: "10-15 perfuracao, reduz Coragem, rara e poderosa.",
    icon: "spear",
    color: "#8e65c9"
  },
  {
    id: "war_hammer_design",
    kind: "Arma",
    name: "Martelo de guerra",
    role: "Impacto contra armadura",
    silhouette: "Cabeca quadrada pesada com bico curto no verso.",
    material: "Aco marcado, madeira escura e rebites largos.",
    gameplay: "6-12 impacto, melhor contra protecao rigida.",
    icon: "hammer",
    color: "#b9b09b"
  },
  {
    id: "hunter_bow_design",
    kind: "Arma",
    name: "Arco de batedor",
    role: "Distancia, cobertura e altura",
    silhouette: "Arco recurvo simples, corda clara e pequenas fitas de identificacao.",
    material: "Madeira oleada, couro nas empunhaduras e flechas com penas escuras.",
    gameplay: "3-8 perfuracao, alcance alto, usa linha de visao.",
    icon: "bow",
    color: "#6e8fa4"
  },
  {
    id: "field_kit_design",
    kind: "Ferramenta",
    name: "Kit de campo",
    role: "Tratamento e acampamento",
    silhouette: "Bolsa dobravel com tesoura, agulha, ervas e bandagens.",
    material: "Couro encerado, linho cru e frascos pequenos.",
    gameplay: "Ajuda a recuperar ferimentos e reduzir penalidades leves.",
    icon: "kit",
    color: "#547c63"
  },
  {
    id: "survey_tools_design",
    kind: "Ferramenta",
    name: "Ferramentas de percepcao",
    role: "Investigacao e armadilhas",
    silhouette: "Lente, giz, estilete, corda fina e marcador de trilha.",
    material: "Bronze fosco, vidro esverdeado e tecido preto.",
    gameplay: "Aumenta leitura de pistas, rotas e ameacas ocultas.",
    icon: "tools",
    color: "#d0a951"
  }
];

export const CODEX = [
  { title: "Combate por turnos", text: "Cada combatente usa 2 PA por turno. Movimento, ataque, postura, item, inspiracao e espera competem pelo mesmo recurso." },
  { title: "Posicoes", text: "Aliados ocupam seis posicoes a esquerda e inimigos seis a direita. Frente protege e aproxima; retaguarda favorece arco, suporte, altura e cobertura." },
  { title: "Medo e coragem", text: "Ameacas, mortes e efeitos sobrenaturais testam Coragem. Estados de medo reduzem iniciativa, acerto, defesa e podem bloquear a acao." },
  { title: "Lideranca", text: "William pode inspirar, manter formacao, reagrupar e impedir recuos. Lealdade decide se ordens perigosas sao aceitas." },
  { title: "Principado", text: "Comida, madeira, ferro, ouro, tropas, infraestrutura e reputacao conectam campanha, missoes e consequencias." }
];

export const INITIAL_PRINCIPALITY = {
  food: 42,
  wood: 28,
  iron: 16,
  gold: 33,
  troops: 12,
  infrastructure: 1,
  population: 86,
  reputation: {
    companions: 50,
    infantry: 48,
    knights: 42,
    peasants: 44,
    nobles: 38,
    kingdom: 40
  }
};
