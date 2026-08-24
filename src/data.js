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

const MISSION_ROWS = [
  [1, "Ato I - O Peso da Coroa", "stone_council", "Conselho de Pedra", "Cena de conselho", "Escolher prioridade: comida, defesa ou investigacao.", "Abre rotas e modifica recursos."],
  [2, "Ato I - O Peso da Coroa", "empty_granaries", "Celeiros Vazios", "Investigacao/gestao", "Descobrir causa da falta de comida.", "Pode revelar roubo, corrupcao ou ataque."],
  [3, "Ato I - O Peso da Coroa", "village_without_bells", "A Vila sem Sinos", "Exploracao + resgate", "Encontrar moradores e retirar sobreviventes.", "Primeiro mapa semiaberto."],
  [4, "Ato I - O Peso da Coroa", "wolves_on_the_road", "Lobos na Estrada", "Escolta", "Levar carregamento ate o principado.", "Emboscadas e rotas alternativas."],
  [5, "Ato I - O Peso da Coroa", "blood_debt", "Divida de Sangue", "Missao de companheiro", "Resolver conflito ligado a Donovan/Ethan/Albert.", "Lealdade individual."],
  [6, "Ato I - O Peso da Coroa", "gate_at_dusk", "O Portao ao Anoitecer", "Defesa", "Defender entrada por varias rodadas.", "Barricadas, arqueiros e reforcos."],
  [7, "Ato I - O Peso da Coroa", "prince_trial", "Julgamento do Principe", "Cena politica", "Julgar responsaveis e consequencias.", "Reputacao por faccao."],
  [8, "Ato I - O Peso da Coroa", "herald_of_the_woods", "Chefe - O Arauto da Mata", "Cacada/chefe", "Eliminar ou capturar criatura/comandante.", "Chefe com medo e terreno."],
  [9, "Ato II - Fronteiras em Chamas", "act_ii_burning_frontiers", "Ato II - Fronteiras em Chamas", "Ato", "Abrir o arco de guerra nas fronteiras.", "Novas rotas, pressoes militares e ameacas coordenadas."],
  [10, "Ato II - Fronteiras em Chamas", "ash_bridge", "Ponte de Cinzas", "Defesa/controle", "Segurar ponte ou destrui-la.", "Muda rota estrategica."],
  [11, "Ato II - Fronteiras em Chamas", "lost_caravan", "Caravana Perdida", "Busca/resgate", "Localizar caravana antes do tempo acabar.", "Recursos e sobreviventes."],
  [12, "Ato II - Fronteiras em Chamas", "broken_fortress", "Fortaleza Partida", "Assalto", "Abrir portao por infiltracao, sabotagem ou ataque frontal.", "Tres rotas."],
  [13, "Ato II - Fronteiras em Chamas", "field_of_the_dead", "Campo dos Mortos", "Investigacao", "Descobrir por que corpos desapareceram.", "Sobrenatural cresce."],
  [14, "Ato II - Fronteiras em Chamas", "blood_between_banners", "Sangue entre Estandartes", "Diplomacia armada", "Evitar ou vencer conflito entre aliados.", "Reputacao politica."],
  [15, "Ato II - Fronteiras em Chamas", "siege", "Cerco", "Grande batalha", "Defender setores, comandar tropas e escolher onde intervir.", "Perdas persistentes."],
  [16, "Ato II - Fronteiras em Chamas", "faceless_general", "O General sem Rosto", "Chefe", "Quebrar comando inimigo e sobreviver as fases.", "Inimigos coordenados + medo."],
  [17, "Ato III - Vozes Sob a Terra", "act_iii_voices_below", "Ato III - Vozes Sob a Terra", "Ato", "Iniciar a descida as ruinas e segredos proibidos.", "O horror e os traumas passam a alterar missoes."],
  [18, "Ato III - Vozes Sob a Terra", "abandoned_monastery", "Mosteiro Abandonado", "Exploracao/horror", "Encontrar registros e sobreviver ao local.", "Puzzles leves e medo."],
  [19, "Ato III - Vozes Sob a Terra", "under_the_crypt", "Sob a Cripta", "Dungeon tatica", "Abrir caminho por ruinas subterraneas.", "Luz, armadilhas e rotas."],
  [20, "Ato III - Vozes Sob a Terra", "forbidden_name", "O Nome Proibido", "Investigacao", "Reconstruir ritual por documentos e testemunhos.", "Lore e decisao."],
  [21, "Ato III - Vozes Sob a Terra", "echoes_of_fear", "Ecos de Medo", "Missao psicologica", "Enfrentar manifestacao ligada aos traumas do grupo.", "Traumas alteram encontros."],
  [22, "Ato III - Vozes Sob a Terra", "artifact", "O Artefato", "Escolha critica", "Destruir, guardar ou usar objeto sobrenatural.", "Campanha ramifica."],
  [23, "Ato III - Vozes Sob a Terra", "mouth_of_the_earth", "A Boca da Terra", "Chefe", "Impedir ritual e selar passagem.", "Objetivo por fases, nao apenas HP."],
  [24, "Ato IV - Reino Dividido", "act_iv_divided_kingdom", "Ato IV - Reino Dividido", "Ato", "Abrir a crise politica do reino.", "Aliancas e reputacoes passam a definir rotas."],
  [25, "Ato IV - Reino Dividido", "messengers", "Mensageiros", "Corrida estrategica", "Entregar ordens antes que regioes caiam.", "Mapa e tempo."],
  [26, "Ato IV - Reino Dividido", "dukes_choice", "A Escolha dos Duques", "Politica", "Convencer faccoes com reputacao acumulada.", "Aliancas reais."],
  [27, "Ato IV - Reino Dividido", "brothers_against_brothers", "Irmaos contra Irmaos", "Batalha moral", "Vencer sem massacrar aliados quando possivel.", "Captura/rendicao."],
  [28, "Ato IV - Reino Dividido", "besieged_city", "A Cidade Cercada", "Mapa grande", "Gerenciar comida, setores e civis durante cerco.", "Principado + combate."],
  [29, "Ato IV - Reino Dividido", "betrayal", "Traicao", "Cena/combate variavel", "Revelar traidor conforme relacoes e decisoes.", "Lealdade paga consequencia."],
  [30, "Ato IV - Reino Dividido", "empty_throne", "O Trono Vazio", "Assalto politico", "Retomar ou proteger centro de poder.", "Varias rotas e objetivos."],
  [31, "Ato V - Aes Divinus", "act_v_aes_divinus", "Ato V - Aes Divinus", "Ato", "Abrir a marcha final contra a fonte do poder.", "Todas as escolhas anteriores entram em jogo."],
  [32, "Ato V - Aes Divinus", "final_march", "Marcha Final", "Preparacao", "Escolher tropas, companheiros e suprimentos.", "Tudo que foi administrado importa."],
  [33, "Ato V - Aes Divinus", "corrupted_land", "Terra Corrompida", "Travessia", "Cruzar regiao alterada pelo sobrenatural.", "Recursos e Coragem."],
  [34, "Ato V - Aes Divinus", "those_who_remained", "Os Que Ficaram", "Missao de consequencias", "Encontrar personagens/faccoes conforme escolhas anteriores.", "Campanha reativa."],
  [35, "Ato V - Aes Divinus", "abyss_gates", "Portoes do Abismo", "Assalto", "Romper tres objetivos em ordem escolhida.", "Grande arena multiobjetivo."],
  [36, "Ato V - Aes Divinus", "price_of_the_crown", "O Preco da Coroa", "Cena decisiva", "Escolha politica/pessoal antes do final.", "Define aliados e condicoes."],
  [37, "Ato V - Aes Divinus", "aes_divinus_final", "Aes Divinus", "Chefe final multifasico", "Sobreviver, quebrar mecanismos/ritual e enfrentar entidade.", "Combate, medo, lideranca, terreno."],
  [38, "Epilogo", "last_order", "Ultima Ordem", "Decisao final", "Escolher destino do poder/principado.", "Define epilogo."]
];

const MANAGEMENT_TYPES = ["Ato", "Cena de conselho", "Investigacao/gestao", "Cena politica", "Politica", "Escolha critica", "Preparacao", "Cena decisiva", "Decisao final"];
const BOSS_TYPES = ["Cacada/chefe", "Chefe", "Chefe final multifasico"];
const SUPERNATURAL_TYPES = ["Exploracao/horror", "Dungeon tatica", "Missao psicologica", "Travessia", "Chefe final multifasico"];

function missionEnemySet(type) {
  if (BOSS_TYPES.includes(type) || SUPERNATURAL_TYPES.includes(type)) return "manifestation";
  return "forest_first_contact";
}

function missionRewards(order, type) {
  const boss = BOSS_TYPES.includes(type);
  const political = MANAGEMENT_TYPES.includes(type);
  return {
    food: political ? 5 : 3,
    wood: order % 3 === 0 ? 5 : 2,
    iron: boss ? 6 : 2,
    gold: 4 + Math.ceil(order / 8),
    troops: type.includes("Defesa") || type.includes("batalha") || type.includes("Assalto") ? 2 : 1,
    reputation: {
      companions: type.includes("companheiro") || type.includes("psicologica") ? 5 : 2,
      infantry: type.includes("Defesa") || type.includes("batalha") || type.includes("Assalto") ? 5 : 2,
      knights: type.includes("Politica") || type.includes("Duques") ? 5 : 1,
      peasants: type.includes("resgate") || type.includes("Celeiros") || type.includes("Cidade") ? 5 : 2,
      nobles: political ? 4 : 1,
      kingdom: boss || order >= 30 ? 5 : 2
    }
  };
}

function missionOptionals(type, impact) {
  if (type === "Ato") return ["Revisar diario", "Preparar recursos", "Consultar reputacoes"];
  if (BOSS_TYPES.includes(type)) return ["Vencer sem William cair", "Usar lideranca contra medo", "Explorar terreno da arena"];
  if (type.includes("resgate")) return ["Salvar sobreviventes", "Evitar baixas", "Concluir antes do prazo"];
  if (type.includes("Defesa") || type.includes("Cerco")) return ["Manter setor chave", "Preservar tropas", "Usar barricadas"];
  if (type.includes("Politica") || type.includes("conselho")) return ["Ouvir faccoes", "Evitar ruptura", impact];
  return ["Investigar pista opcional", "Preservar recursos", impact];
}

function missionEvents(type) {
  if (BOSS_TYPES.includes(type)) {
    return {
      2: "O chefe muda de postura e pressiona a coragem do grupo.",
      3: "O terreno se torna mais perigoso.",
      5: "Uma fase nova comeca; o objetivo muda.",
      7: "A ameaca sobrenatural chega ao limite."
    };
  }
  if (type.includes("Defesa") || type.includes("Cerco")) {
    return {
      2: "Inimigos testam a linha de frente.",
      3: "Arqueiros buscam angulo alto.",
      4: "Reforcos se aproximam.",
      6: "O setor principal fica sob pressao."
    };
  }
  return {
    2: "O campo muda e novas rotas ficam evidentes.",
    3: "A pressao da missao aumenta.",
    4: "Um evento inesperado altera prioridades.",
    6: "O relogio de missao entra em fase critica."
  };
}

export const MISSIONS = MISSION_ROWS.map(([order, act, id, title, type, objective, impact]) => {
  const managementOnly = MANAGEMENT_TYPES.includes(type);
  return {
    order,
    id,
    act,
    title,
    type,
    objective,
    impact,
    optional: missionOptionals(type, impact),
    managementOnly,
    clockLimit: BOSS_TYPES.includes(type) ? 10 : type.includes("Corrida") || type.includes("Busca") ? 6 : 8,
    enemySet: managementOnly ? null : missionEnemySet(type),
    eventRounds: missionEvents(type),
    rewards: missionRewards(order, type)
  };
});

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

export const MISSION_SCENES = Object.fromEntries(
  MISSIONS.map((mission) => [
    mission.id,
    [
      {
        title: `${mission.order}. ${mission.title}`,
        camera: mission.managementOnly ? "Mesa de guerra, rostos tensos e mapas marcados por velas." : "Plano de estabelecimento mostrando rotas, cobertura e objetivo principal.",
        text: `${mission.act}. ${mission.objective}`,
        choice: mission.managementOnly ? "Tomar decisao" : "Preparar formacao",
        effect: mission.impact
      },
      {
        title: "Complicacao",
        camera: BOSS_TYPES.includes(mission.type) ? "Camera baixa para comunicar escala e ameaca." : "Camera tatica abre o espaco da missao.",
        text: mission.managementOnly ? "As faccoes cobram uma resposta. A decisao altera recursos, reputacao e proximas rotas." : "O grupo identifica riscos, posicoes e consequencias antes do contato.",
        choice: mission.managementOnly ? "Registrar consequencia" : "Entrar na missao",
        effect: mission.managementOnly ? "Resolve como cena/gestao e volta a mesa." : "Inicia combate ou encontro tatico."
      }
    ]
  ])
);

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
