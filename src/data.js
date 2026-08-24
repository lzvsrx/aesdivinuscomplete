export const FEAR_STATES = {
  steady: { label: "Firme", initiative: 0, accuracy: 0, defense: 0, skipChance: 0 },
  nervous: { label: "Nervoso", initiative: -1, accuracy: -4, defense: 0, skipChance: 0 },
  afraid: { label: "Assustado", initiative: -3, accuracy: -9, defense: -2, skipChance: 0 },
  terrified: { label: "Apavorado", initiative: -5, accuracy: -14, defense: -4, skipChance: 0.24 },
  paralyzed: { label: "Paralisado", initiative: -99, accuracy: -99, defense: -8, skipChance: 1 },
  desperate: { label: "Desesperado", initiative: -7, accuracy: -18, defense: -6, skipChance: 0.34 }
};

export const WEAPONS = {
  iron_sword: { id: "iron_sword", name: "Espada de ferro", min: 5, max: 10, type: "cut", accuracy: 5, range: 1, strengthScale: 0.55, stone: "Granito Jurado" },
  iron_axe: { id: "iron_axe", name: "Machado de ferro", min: 6, max: 12, type: "cut", accuracy: 0, range: 1, strengthScale: 0.7, stone: "Basalto Rubro" },
  spear: { id: "spear", name: "Lanca de ferro", min: 5, max: 10, type: "pierce", accuracy: 3, range: 2, strengthScale: 0.45, stone: "Quartzo de Vigia" },
  bow: { id: "bow", name: "Arco", min: 3, max: 8, type: "pierce", accuracy: 2, range: 5, strengthScale: 0.25, ammo: "arrow", stone: "Olho de Cedro" },
  fire_bow: { id: "fire_bow", name: "Flecha de fogo", min: 3, max: 8, type: "fire", accuracy: 0, range: 5, strengthScale: 0.2, burn: 2, stone: "Cinabrio Aceso" },
  aes_spear: { id: "aes_spear", name: "Lanca Aes", min: 10, max: 15, type: "pierce", accuracy: 7, range: 2, strengthScale: 0.55, courageDamage: 6, stone: "Ametista Aes" },
  claws: { id: "claws", name: "Garras", min: 5, max: 12, type: "cut", accuracy: 4, range: 1, strengthScale: 0.55, threat: 10 },
  dread: { id: "dread", name: "Uivo sobrenatural", min: 0, max: 2, type: "supernatural", accuracy: 10, range: 6, strengthScale: 0, courageDamage: 14, threat: 18 }
};

export const ARMORS = {
  cloth: { id: "cloth", name: "Roupa reforcada", mitigation: { cut: 1, pierce: 1, impact: 0, fire: 0, supernatural: 0 }, defense: 1, initiative: 1, dodge: 4, strengthReq: 0, stone: "Argila Selada" },
  light: { id: "light", name: "Couro leve", mitigation: { cut: 2, pierce: 1, impact: 1, fire: 0, supernatural: 0 }, defense: 2, initiative: 1, dodge: 3, strengthReq: 0, stone: "Jaspe Verde" },
  medium: { id: "medium", name: "Malha media", mitigation: { cut: 4, pierce: 3, impact: 2, fire: 0, supernatural: 0 }, defense: 4, initiative: -1, dodge: 0, strengthReq: 8, stone: "Hematita" },
  heavy: { id: "heavy", name: "Brigantina pesada", mitigation: { cut: 7, pierce: 5, impact: 3, fire: 1, supernatural: 0 }, defense: 6, initiative: -3, dodge: -3, strengthReq: 12, stone: "Onix Real" }
};

export const GAME_CURRENCY = {
  id: "aes_crowns",
  name: "Coroas de Aes",
  shortName: "Coroas",
  symbol: "CA",
  description: "Moeda usada por aventureiros, ferreiros e mercados do principado."
};

export const SHOP_AREAS = [
  { id: "blacksmith", name: "Forja do Principado", specialty: "Armas e armaduras", faction: "infantry" },
  { id: "quartermaster", name: "Intendencia Real", specialty: "Ferramentas e suprimentos", faction: "peasants" },
  { id: "relicary", name: "Relicario Aes", specialty: "Itens ligados as pedras", faction: "kingdom" }
];

export const ITEM_CATALOG = {
  iron_sword: { id: "iron_sword", type: "weapon", shop: "blacksmith", price: 26, sellPrice: 10, stone: "Granito Jurado", description: "Lamina confiavel para lideres de linha.", equipSlot: "weapon" },
  iron_axe: { id: "iron_axe", type: "weapon", shop: "blacksmith", price: 31, sellPrice: 12, stone: "Basalto Rubro", description: "Arma pesada para quebrar defesa.", equipSlot: "weapon" },
  spear: { id: "spear", type: "weapon", shop: "blacksmith", price: 29, sellPrice: 11, stone: "Quartzo de Vigia", description: "Alcance seguro para controlar corredores.", equipSlot: "weapon" },
  bow: { id: "bow", type: "weapon", shop: "blacksmith", price: 24, sellPrice: 9, stone: "Olho de Cedro", description: "Arco de patrulha para retaguarda.", equipSlot: "weapon" },
  aes_spear: { id: "aes_spear", type: "weapon", shop: "relicary", price: 90, sellPrice: 35, stone: "Ametista Aes", description: "Relicario perfurante que abala coragem.", equipSlot: "weapon" },
  cloth: { id: "cloth", type: "armor", shop: "quartermaster", price: 14, sellPrice: 5, stone: "Argila Selada", description: "Roupa reforcada para exploracao.", equipSlot: "armor" },
  light: { id: "light", type: "armor", shop: "quartermaster", price: 22, sellPrice: 8, stone: "Jaspe Verde", description: "Couro flexivel para batedores.", equipSlot: "armor" },
  medium: { id: "medium", type: "armor", shop: "blacksmith", price: 38, sellPrice: 15, stone: "Hematita", description: "Malha equilibrada para combate longo.", equipSlot: "armor" },
  heavy: { id: "heavy", type: "armor", shop: "blacksmith", price: 55, sellPrice: 22, stone: "Onix Real", description: "Brigantina de defesa alta.", equipSlot: "armor" },
  field_kit: { id: "field_kit", name: "Kit de campo", type: "tool", shop: "quartermaster", price: 18, sellPrice: 7, stone: "Agata de Cura", description: "Kit para ferimentos, acampamento e resgate.", equipSlot: "tool" },
  survey_tools: { id: "survey_tools", name: "Ferramentas de percepcao", type: "tool", shop: "quartermaster", price: 20, sellPrice: 8, stone: "Fluorita de Pista", description: "Lente, giz e marcadores para investigacao.", equipSlot: "tool" },
  aes_compass: { id: "aes_compass", name: "Bussola Aes", type: "tool", shop: "relicary", price: 64, sellPrice: 24, stone: "Safira de Norte", description: "Aponta rotas escondidas quando a coragem falha.", equipSlot: "tool" }
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

const PROLOGUE_ROWS = [
  ["Prologo - Floresta de Sangue", "prologue_opening", "Cena P0 - Abertura", "Cena cinematica", "Apresentar William, o grupo e a viagem pela Floresta de Sangue.", "Define tom, contexto e primeira leitura dos companheiros."],
  ["Prologo - Floresta de Sangue", "old_road", "Missao P1 - Pela Estrada Velha", "Tutorial de exploracao", "Explorar a trilha, seguir rastros e encontrar suprimentos opcionais.", "Ensina movimento, interacao e Percepcao."],
  ["Prologo - Floresta de Sangue", "forest_signs", "Cena P2 - Sinais na Mata", "Cena de tensao", "Ouvir os sons da floresta e perceber que algo acompanha o grupo.", "Aumenta tensao e prepara a emboscada."],
  ["Prologo - Floresta de Sangue", "ambush", "Missao P3 - Emboscada", "Primeiro combate", "Vencer ou forcar retirada dos barbaros.", "Ensina turnos, PA, ataque, movimento e cobertura."],
  ["Prologo - Floresta de Sangue", "after_blood", "Cena P4 - Depois do Sangue", "Cena de dialogo", "Escolher como os companheiros reagem a batalha.", "Altera lealdade, marca emocional e personalidade do grupo."],
  ["Prologo - Floresta de Sangue", "survivor", "Missao P5 - O Sobrevivente", "Resgate/batalha", "Encontrar um sobrevivente ferido, ajuda-lo e eliminar inimigos.", "Combina interacao, resgate e combate."],
  ["Prologo - Floresta de Sangue", "transformation", "Cena P6 - A Transformacao", "Cena sobrenatural", "Sobreviver ao primeiro sinal de transformacao de um inimigo.", "Introduz Medo e Coragem."],
  ["Prologo - Floresta de Sangue", "real_battle", "Missao P7 - A Real Batalha", "Chefe tutorial", "Proteger companheiros e, opcionalmente, deixar a criatura com meia vida.", "Ensina medo, lideranca e retirada."],
  ["Prologo - Floresta de Sangue", "hubris", "Cena P8 - O Hubris", "Cena politica", "Decidir como relatar o ocorrido ao retornar.", "Gera a primeira consequencia politica."]
];

const ACT_ROWS = [
  ["Ato I - O Peso da Coroa", "stone_council", "Conselho de Pedra", "Cena de conselho", "Escolher prioridade: comida, defesa ou investigacao.", "Abre rotas e modifica recursos."],
  ["Ato I - O Peso da Coroa", "empty_granaries", "Celeiros Vazios", "Investigacao/gestao", "Descobrir causa da falta de comida.", "Pode revelar roubo, corrupcao ou ataque."],
  ["Ato I - O Peso da Coroa", "village_without_bells", "A Vila sem Sinos", "Exploracao + resgate", "Encontrar moradores e retirar sobreviventes.", "Primeiro mapa semiaberto."],
  ["Ato I - O Peso da Coroa", "wolves_on_the_road", "Lobos na Estrada", "Escolta", "Levar carregamento ate o principado.", "Emboscadas e rotas alternativas."],
  ["Ato I - O Peso da Coroa", "blood_debt", "Divida de Sangue", "Missao de companheiro", "Resolver conflito ligado a Donovan/Ethan/Albert.", "Lealdade individual."],
  ["Ato I - O Peso da Coroa", "gate_at_dusk", "O Portao ao Anoitecer", "Defesa", "Defender entrada por varias rodadas.", "Barricadas, arqueiros e reforcos."],
  ["Ato I - O Peso da Coroa", "prince_trial", "Julgamento do Principe", "Cena politica", "Julgar responsaveis e consequencias.", "Reputacao por faccao."],
  ["Ato I - O Peso da Coroa", "herald_of_the_woods", "Chefe - O Arauto da Mata", "Cacada/chefe", "Eliminar ou capturar criatura/comandante.", "Chefe com medo e terreno."],
  ["Ato II - Fronteiras em Chamas", "act_ii_burning_frontiers", "Ato II - Fronteiras em Chamas", "Ato", "Abrir o arco de guerra nas fronteiras.", "Novas rotas, pressoes militares e ameacas coordenadas."],
  ["Ato II - Fronteiras em Chamas", "ash_bridge", "Ponte de Cinzas", "Defesa/controle", "Segurar ponte ou destrui-la.", "Muda rota estrategica."],
  ["Ato II - Fronteiras em Chamas", "lost_caravan", "Caravana Perdida", "Busca/resgate", "Localizar caravana antes do tempo acabar.", "Recursos e sobreviventes."],
  ["Ato II - Fronteiras em Chamas", "broken_fortress", "Fortaleza Partida", "Assalto", "Abrir portao por infiltracao, sabotagem ou ataque frontal.", "Tres rotas."],
  ["Ato II - Fronteiras em Chamas", "field_of_the_dead", "Campo dos Mortos", "Investigacao", "Descobrir por que corpos desapareceram.", "Sobrenatural cresce."],
  ["Ato II - Fronteiras em Chamas", "blood_between_banners", "Sangue entre Estandartes", "Diplomacia armada", "Evitar ou vencer conflito entre aliados.", "Reputacao politica."],
  ["Ato II - Fronteiras em Chamas", "siege", "Cerco", "Grande batalha", "Defender setores, comandar tropas e escolher onde intervir.", "Perdas persistentes."],
  ["Ato II - Fronteiras em Chamas", "faceless_general", "O General sem Rosto", "Chefe", "Quebrar comando inimigo e sobreviver as fases.", "Inimigos coordenados + medo."],
  ["Ato III - Vozes Sob a Terra", "act_iii_voices_below", "Ato III - Vozes Sob a Terra", "Ato", "Iniciar a descida as ruinas e segredos proibidos.", "O horror e os traumas passam a alterar missoes."],
  ["Ato III - Vozes Sob a Terra", "abandoned_monastery", "Mosteiro Abandonado", "Exploracao/horror", "Encontrar registros e sobreviver ao local.", "Puzzles leves e medo."],
  ["Ato III - Vozes Sob a Terra", "under_the_crypt", "Sob a Cripta", "Dungeon tatica", "Abrir caminho por ruinas subterraneas.", "Luz, armadilhas e rotas."],
  ["Ato III - Vozes Sob a Terra", "forbidden_name", "O Nome Proibido", "Investigacao", "Reconstruir ritual por documentos e testemunhos.", "Lore e decisao."],
  ["Ato III - Vozes Sob a Terra", "echoes_of_fear", "Ecos de Medo", "Missao psicologica", "Enfrentar manifestacao ligada aos traumas do grupo.", "Traumas alteram encontros."],
  ["Ato III - Vozes Sob a Terra", "artifact", "O Artefato", "Escolha critica", "Destruir, guardar ou usar objeto sobrenatural.", "Campanha ramifica."],
  ["Ato III - Vozes Sob a Terra", "mouth_of_the_earth", "A Boca da Terra", "Chefe", "Impedir ritual e selar passagem.", "Objetivo por fases, nao apenas HP."],
  ["Ato IV - Reino Dividido", "act_iv_divided_kingdom", "Ato IV - Reino Dividido", "Ato", "Abrir a crise politica do reino.", "Aliancas e reputacoes passam a definir rotas."],
  ["Ato IV - Reino Dividido", "messengers", "Mensageiros", "Corrida estrategica", "Entregar ordens antes que regioes caiam.", "Mapa e tempo."],
  ["Ato IV - Reino Dividido", "dukes_choice", "A Escolha dos Duques", "Politica", "Convencer faccoes com reputacao acumulada.", "Aliancas reais."],
  ["Ato IV - Reino Dividido", "brothers_against_brothers", "Irmaos contra Irmaos", "Batalha moral", "Vencer sem massacrar aliados quando possivel.", "Captura/rendicao."],
  ["Ato IV - Reino Dividido", "besieged_city", "A Cidade Cercada", "Mapa grande", "Gerenciar comida, setores e civis durante cerco.", "Principado + combate."],
  ["Ato IV - Reino Dividido", "betrayal", "Traicao", "Cena/combate variavel", "Revelar traidor conforme relacoes e decisoes.", "Lealdade paga consequencia."],
  ["Ato IV - Reino Dividido", "empty_throne", "O Trono Vazio", "Assalto politico", "Retomar ou proteger centro de poder.", "Varias rotas e objetivos."],
  ["Ato V - Aes Divinus", "act_v_aes_divinus", "Ato V - Aes Divinus", "Ato", "Abrir a marcha final contra a fonte do poder.", "Todas as escolhas anteriores entram em jogo."],
  ["Ato V - Aes Divinus", "final_march", "Marcha Final", "Preparacao", "Escolher tropas, companheiros e suprimentos.", "Tudo que foi administrado importa."],
  ["Ato V - Aes Divinus", "corrupted_land", "Terra Corrompida", "Travessia", "Cruzar regiao alterada pelo sobrenatural.", "Recursos e Coragem."],
  ["Ato V - Aes Divinus", "those_who_remained", "Os Que Ficaram", "Missao de consequencias", "Encontrar personagens/faccoes conforme escolhas anteriores.", "Campanha reativa."],
  ["Ato V - Aes Divinus", "abyss_gates", "Portoes do Abismo", "Assalto", "Romper tres objetivos em ordem escolhida.", "Grande arena multiobjetivo."],
  ["Ato V - Aes Divinus", "price_of_the_crown", "O Preco da Coroa", "Cena decisiva", "Escolha politica/pessoal antes do final.", "Define aliados e condicoes."],
  ["Ato V - Aes Divinus", "aes_divinus_final", "Aes Divinus", "Chefe final multifasico", "Sobreviver, quebrar mecanismos/ritual e enfrentar entidade.", "Combate, medo, lideranca, terreno."],
  ["Epilogo", "last_order", "Ultima Ordem", "Decisao final", "Escolher destino do poder/principado.", "Define epilogo."]
];

const MISSION_ROWS = [...PROLOGUE_ROWS, ...ACT_ROWS].map((row, index) => [index + 1, ...row]);

const MANAGEMENT_TYPES = ["Ato", "Cena cinematica", "Cena de tensao", "Cena de dialogo", "Cena sobrenatural", "Cena de conselho", "Investigacao/gestao", "Cena politica", "Politica", "Escolha critica", "Preparacao", "Cena decisiva", "Decisao final"];
const BOSS_TYPES = ["Cacada/chefe", "Chefe", "Chefe tutorial", "Chefe final multifasico"];
const SUPERNATURAL_TYPES = ["Cena sobrenatural", "Exploracao/horror", "Dungeon tatica", "Missao psicologica", "Travessia", "Chefe tutorial", "Chefe final multifasico"];

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

function missionBackdrop(mission) {
  const type = mission.type.toLowerCase();
  const act = mission.act.toLowerCase();
  if (mission.id.includes("prologue") || mission.id.includes("road") || act.includes("floresta")) {
    return {
      id: "blood_forest",
      name: "Floresta de Sangue",
      mood: "Trilha escura, arvores fechadas, lama, folhas vermelhas e sinais de emboscada.",
      palette: ["#07100b", "#253126", "#6d1d1b", "#d0a951"],
      props: ["rastro", "tronco caido", "suprimentos", "neblina baixa"],
      camera: "terceira pessoa baixa que abre para enquadramento tatico quando a ameaca aparece"
    };
  }
  if (type.includes("conselho") || type.includes("politica") || type.includes("decisiva") || type.includes("decisao") || mission.managementOnly) {
    return {
      id: "war_council",
      name: "Mesa de Guerra",
      mood: "Pedra, velas, mapas marcados, bandeiras de faccao e pressao politica.",
      palette: ["#101214", "#2c2520", "#8a6a2e", "#d0a951"],
      props: ["mapa", "velas", "selos", "estandartes"],
      camera: "plano de mesa com cortes para rostos e emblemas de faccao"
    };
  }
  if (type.includes("defesa") || type.includes("cerco") || type.includes("ponte")) {
    return {
      id: "siege_line",
      name: "Linha de Defesa",
      mood: "Barricadas, arqueiros, fumaca, setores sob pressao e rotas alternativas.",
      palette: ["#121313", "#343632", "#7d2d23", "#b9b09b"],
      props: ["barricada", "portao", "plataforma de arqueiro", "fogo"],
      camera: "camera tatica alta para setor, reforcos e objetivos de defesa"
    };
  }
  if (type.includes("chefe") || type.includes("sobrenatural") || type.includes("horror") || type.includes("cripta") || type.includes("abismo")) {
    return {
      id: "corrupted_ritual",
      name: "Ritual Corrompido",
      mood: "Pedra fria, veios violetas, sombras vivas e medo crescendo no terreno.",
      palette: ["#050508", "#18121e", "#5b2e83", "#c7b37a"],
      props: ["runa", "monolito", "nevoa violeta", "fissura"],
      camera: "enquadramento amplo para fases, mecanismos e escala da ameaca"
    };
  }
  if (type.includes("resgate") || type.includes("busca") || type.includes("exploracao") || type.includes("investigacao")) {
    return {
      id: "search_zone",
      name: "Zona de Busca",
      mood: "Casas quebradas, marcas no chao, silencio de vila e pontos de interacao.",
      palette: ["#0d1212", "#26302d", "#547c63", "#c7b37a"],
      props: ["pista", "corpo", "porta", "rota escondida"],
      camera: "terceira pessoa exploratoria com destaques de percepcao"
    };
  }
  return {
    id: "battlefield",
    name: "Campo de Missao",
    mood: "Terreno aberto, cobertura, posicoes de frente/retaguarda e relogio de missao.",
    palette: ["#0c0f0f", "#272b2a", "#6e8fa4", "#d0a951"],
    props: ["cobertura", "altura", "objetivo", "marcador de rota"],
    camera: "camera tatica orbitavel para combate por turnos"
  };
}

function missionActions(mission) {
  const type = mission.type.toLowerCase();
  const actions = [
    { id: `${mission.id}_objective`, label: `Executar objetivo: ${mission.title}`, cost: "2 PA", effect: mission.objective },
    { id: `${mission.id}_perception`, label: "Ler terreno", cost: "1 PA", effect: "Revela pistas, cobertura, rotas e ameacas." }
  ];
  if (type.includes("defesa") || type.includes("cerco")) {
    actions.push({ id: `${mission.id}_barricade`, label: "Reforcar barricada", cost: "1 PA + madeira", effect: "Aumenta defesa do setor e atrasa reforcos inimigos." });
    actions.push({ id: `${mission.id}_archers`, label: "Reposicionar arqueiros", cost: "1 PA", effect: "Ganha altura, cobertura e controle de linha de visao." });
  } else if (type.includes("chefe")) {
    actions.push({ id: `${mission.id}_break_phase`, label: "Quebrar mecanismo/fase", cost: "2 PA", effect: "Avanca objetivo de chefe alem de reduzir HP." });
    actions.push({ id: `${mission.id}_hold_courage`, label: "Comandar coragem", cost: "1 PA", effect: "Reduz medo e impede colapso de companheiros." });
  } else if (type.includes("politica") || type.includes("conselho") || mission.managementOnly) {
    actions.push({ id: `${mission.id}_negotiate`, label: "Negociar com faccao", cost: "decisao", effect: "Altera reputacao e abre rotas politicas." });
    actions.push({ id: `${mission.id}_spend_resources`, label: "Comprometer recursos", cost: "recursos", effect: "Muda comida, defesa, tropas ou investigacao." });
  } else if (type.includes("resgate") || type.includes("busca")) {
    actions.push({ id: `${mission.id}_evacuate`, label: "Retirar sobreviventes", cost: "2 PA", effect: "Salva civis e reduz perdas persistentes." });
    actions.push({ id: `${mission.id}_race_clock`, label: "Acelerar busca", cost: "1 PA + risco", effect: "Avanca antes do tempo, mas aumenta chance de emboscada." });
  } else if (type.includes("investigacao") || type.includes("exploracao")) {
    actions.push({ id: `${mission.id}_inspect`, label: "Investigar pista chave", cost: "1 PA", effect: "Revela causa, culpado, ritual ou rota oculta." });
    actions.push({ id: `${mission.id}_interact`, label: "Interagir com objeto", cost: "1 PA", effect: "Aciona porta, alavanca, registro, corpo ou suprimento." });
  } else {
    actions.push({ id: `${mission.id}_attack`, label: "Atacar ameaca", cost: "1 PA", effect: "Resolve conflito direto com arma equipada." });
    actions.push({ id: `${mission.id}_formation`, label: "Manter formacao", cost: "1 PA", effect: "Melhora defesa, cobertura e lealdade em risco." });
  }
  actions.push({ id: `${mission.id}_finish`, label: "Registrar consequencia", cost: "final", effect: mission.impact });
  return actions;
}

export const MISSION_PRESENTATION = Object.fromEntries(
  MISSIONS.map((mission) => [
    mission.id,
    {
      background: missionBackdrop(mission),
      actions: missionActions(mission)
    }
  ])
);

const MISSION_SCENE_OVERRIDES = {
  prologue_opening: [
    {
      title: "Cena P0 - Abertura",
      camera: "Cinematica curta sobre estrada, brasoes gastos, fogueira baixa e a Floresta de Sangue fechando o horizonte.",
      text: "William viaja com Ethan e Albert antes de entender o tamanho da coroa que o espera.",
      choice: "Observar o grupo",
      effect: "Apresenta William, companheiros, contexto e tom sem combate."
    },
    {
      title: "A estrada aceita o grupo",
      camera: "Plano lateral lento acompanha capas, lama e marcas antigas nas arvores.",
      text: "O silencio da mata transforma uma viagem politica em pressagio.",
      choice: "Seguir pela Estrada Velha",
      effect: "Abre o tutorial de movimento, interacao e Percepcao."
    }
  ],
  old_road: [
    {
      title: "Missao P1 - Pela Estrada Velha",
      camera: "Camera baixa mostra rastros, galhos quebrados e suprimentos esquecidos.",
      text: "Explore a trilha, leia rastros e encontre suprimentos opcionais antes que a luz acabe.",
      choice: "Investigar a trilha",
      effect: "Treina movimento, interacao e Percepcao."
    },
    {
      title: "Suprimentos sob folhas",
      camera: "A camera destaca pontos de interacao e cobertura natural.",
      text: "Cada pista encontrada melhora a preparacao do grupo para o primeiro contato.",
      choice: "Avancar",
      effect: "Inicia encontro tatico leve."
    }
  ],
  forest_signs: [
    {
      title: "Cena P2 - Sinais na Mata",
      camera: "Folhas tremem sem vento; sons de floresta entram e desaparecem em cortes secos.",
      text: "Ethan para de andar. Albert baixa a mao para a lanca. Algo esta perto demais.",
      choice: "Manter formacao",
      effect: "A tensao cresce e prepara a emboscada."
    }
  ],
  ambush: [
    {
      title: "Missao P3 - Emboscada",
      camera: "Camera tatica abre posicoes, cobertura e linha de frente.",
      text: "Barbaros surgem entre troncos. Venca ou force a retirada inimiga; opcional: ninguem cair.",
      choice: "Entrar em combate",
      effect: "Ensina turnos, PA, ataque, movimento e cobertura."
    }
  ],
  after_blood: [
    {
      title: "Cena P4 - Depois do Sangue",
      camera: "Close nos companheiros, respiracao pesada e armas ainda erguidas.",
      text: "A primeira batalha deixa marcas. William precisa escolher como falar com o grupo.",
      choice: "Consolar, cobrar ou silenciar",
      effect: "Altera lealdade, marca emocional e personalidade."
    }
  ],
  survivor: [
    {
      title: "Missao P5 - O Sobrevivente",
      camera: "Um corpo se mexe perto da estrada; inimigos retornam entre as arvores.",
      text: "Encontre o sobrevivente ferido, ajude-o e elimine os inimigos que tentam apagar testemunhas.",
      choice: "Proteger o ferido",
      effect: "Combina interacao, resgate e batalha."
    }
  ],
  transformation: [
    {
      title: "Cena P6 - A Transformacao",
      camera: "Plano fechado em uma ferida escura que se abre como rachadura viva.",
      text: "Um inimigo deixa de parecer humano. O medo agora tem regras.",
      choice: "Resistir",
      effect: "Introduz Medo e Coragem."
    }
  ],
  real_battle: [
    {
      title: "Missao P7 - A Real Batalha",
      camera: "A criatura ocupa a arena; a camera enfatiza escala, rotas de retirada e companheiros vulneraveis.",
      text: "Proteja os companheiros e sobreviva. Opcional: reduzir a criatura a meia vida antes da retirada.",
      choice: "Liderar sob medo",
      effect: "Testa medo, lideranca e retirada."
    }
  ],
  hubris: [
    {
      title: "Cena P8 - O Hubris",
      camera: "O grupo retorna diferente; o mapa politico surge sobre a mesa.",
      text: "William decide como relatar o ocorrido: verdade, omissao ou uso politico da historia.",
      choice: "Definir relato",
      effect: "Primeira consequencia politica registrada."
    }
  ]
};

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

export const GODOT_GAME_STRUCTURE = {
  targetStyle: "RPG tatico 3D single-player por turnos com exploracao em terceira pessoa.",
  note: "O GDD mestre V2 define a versao Godot como 3D. A ideia side-scroller anterior fica como decisao convertida: exploracao lateral vira terceira pessoa 3D, combate vira arena tatica 3D.",
  sceneFolders: [
    "scenes/core/main.tscn",
    "scenes/core/game_manager.tscn",
    "scenes/core/transition.tscn",
    "scenes/player/player.tscn",
    "scenes/player/player_camera.tscn",
    "scenes/player/player_effects.tscn",
    "scenes/characters/william.tscn",
    "scenes/characters/ethan.tscn",
    "scenes/characters/donovan.tscn",
    "scenes/characters/albert.tscn",
    "scenes/characters/hilda.tscn",
    "scenes/characters/elric.tscn",
    "scenes/enemies/barbarian.tscn",
    "scenes/enemies/canis_ferox.tscn",
    "scenes/enemies/homines_corrupti.tscn",
    "scenes/enemies/bestia_ignis.tscn",
    "scenes/bosses/ogre_larva_belli.tscn",
    "scenes/maps/wood_forest_01.tscn",
    "scenes/maps/wood_forest_02.tscn",
    "scenes/maps/wood_forest_03.tscn",
    "scenes/maps/gradon_city.tscn",
    "scenes/maps/gradon_castle.tscn",
    "scenes/maps/council_room.tscn",
    "scenes/maps/prince_room.tscn",
    "scenes/maps/military_quarters.tscn",
    "scenes/maps/blacksmith.tscn",
    "scenes/ui/hud.tscn",
    "scenes/ui/pause_menu.tscn",
    "scenes/ui/inventory.tscn",
    "scenes/ui/equipment.tscn",
    "scenes/ui/dialogue_box.tscn",
    "scenes/ui/map_menu.tscn",
    "scenes/ui/game_over.tscn",
    "scenes/cutscenes/intro.tscn",
    "scenes/cutscenes/wood_ambush.tscn",
    "scenes/cutscenes/army_massacre.tscn",
    "scenes/cutscenes/william_fall.tscn"
  ],
  mainSceneResponsibilities: ["carregar mapas", "carregar jogador", "controlar HUD", "controlar transicoes", "controlar musica", "controlar progresso", "trocar cenas", "abrir menus"],
  playerNodePlan: ["CharacterBody3D", "Skeleton3D", "AnimationTree", "CollisionShape3D", "HurtBox3D", "AttackArea3D", "InteractionArea3D", "SpringArm3D", "Camera3D", "AudioStreamPlayer3D", "PlayerStats", "Marker3D"],
  conversionDecisions: [
    "Side-scroller lateral -> exploracao 3D em terceira pessoa.",
    "Linhas dianteira/traseira -> posicionamento 3D com zona de controle, cobertura e formacao.",
    "Rodada longa fixa -> turno abstrato com relogio de missao separado.",
    "Aparencia fixa -> sistema modular 3D de corpo, rosto, cabelo, barba, roupa, armadura e ferimentos.",
    "Mapa simples -> mapa regional + mapas locais 3D."
  ]
};

export const SIDE_SCROLLER_ACTIONS = [
  { id: "idle", state: "IDLE", animation: "idle", input: "sem direcao", gameplay: "Respirar, mover roupa/cabelo e manter arma preparada em ambiente 3D." },
  { id: "walk", state: "WALK", animation: "walk", input: "WASD/analogico", gameplay: "Movimento preciso para exploracao em terceira pessoa." },
  { id: "run", state: "RUN", animation: "run", input: "Shift/analogico pressionado", gameplay: "Maior velocidade, possivel consumo de stamina, mais ruido e fadiga." },
  { id: "sprint", state: "SPRINT", animation: "sprint", input: "corrida longa", gameplay: "Travessia rapida fora do combate com custo alto de stamina/ruido." },
  { id: "crouch", state: "CROUCH", animation: "crouch", input: "agachar", gameplay: "Stealth leve, menor ruido e melhor aproximacao por cobertura." },
  { id: "turn", state: "TURN", animation: "turn", input: "camera/direcao", gameplay: "Ajuste de orientacao para leitura de linha de visao e flanqueamento." },
  { id: "attack", state: "ATTACK", animation: "attack", input: "ataque leve", gameplay: "Ataque rapido ligado a previsao tatica e alvo valido." },
  { id: "heavy_attack", state: "HEAVY_ATTACK", animation: "heavy_attack", input: "ataque forte", gameplay: "Ataque mais lento com maior dano/impacto." },
  { id: "block", state: "BLOCK", animation: "block", input: "defesa", gameplay: "Reduz dano frontal e prepara contra-ataque." },
  { id: "parry", state: "PARRY", animation: "parry", input: "reacao defensiva", gameplay: "Janela tecnica de reacao que pode anular golpe e abrir contra-ataque." },
  { id: "dodge", state: "DODGE", animation: "dodge", input: "esquiva", gameplay: "Reposicionamento curto, chance/condicao clara e custo de recurso." },
  { id: "hurt", state: "HURT", animation: "hurt", input: "receber dano", gameplay: "Interrompe acoes e aplica impacto." },
  { id: "stun", state: "STUN", animation: "stun", input: "postura quebrada", gameplay: "Impede agir por tempo limitado." },
  { id: "interact", state: "INTERACT", animation: "interact", input: "interacao", gameplay: "Falar, coletar, examinar pistas e ativar objetos." },
  { id: "special", state: "SPECIAL", animation: "special", input: "habilidade", gameplay: "Uso de marca, lideranca ou golpe especial." },
  { id: "dead", state: "DEAD", animation: "dead", input: "HP zero", gameplay: "Fim da unidade/cena de derrota." }
];

export const DESIGN_PILLARS = [
  "Combate tatico legivel com turno, posicao, alcance, iniciativa, formacao, dano e estados.",
  "Consequencias persistentes em ferimentos, traumas, lealdade e reputacao.",
  "Lideranca como mecanica: William influencia coragem, formacao, moral e decisoes.",
  "Gestao conectada a guerra: recursos do principado afetam missoes e populacao.",
  "Personagens individualizados por atributos, psicologia, aparencia 3D, equipamento e relacoes.",
  "Narrativa sistemica emergindo de combate, medo, recursos e escolhas."
];

export const CORE_GAME_LOOP = ["Explorar", "Identificar ameaca", "Preparar formacao", "Combater", "Sofrer consequencias", "Administrar recursos", "Decidir", "Proxima missao"];

export const EXPLORATION_3D_SYSTEMS = [
  { id: "perception", name: "Percepcao", function: "Revela pistas, inimigos ocultos, armadilhas, rotas e objetos interativos." },
  { id: "formation", name: "Formacao", function: "Escolhe ordem e espacamento do grupo antes do contato." },
  { id: "light_stealth", name: "Stealth leve", function: "Linha de visao e ruido podem evitar combate ou iniciar encontro em vantagem." },
  { id: "interaction", name: "Interacao", function: "Portas, alavancas, baus, rastros, corpos, NPCs, recursos e elementos de cenario." },
  { id: "camp", name: "Acampamento", function: "Recuperacao limitada, conversa, troca de equipamento e tratamento de traumas." },
  { id: "maps", name: "Mapa regional/local", function: "Deslocamento estrategico e leitura de mapas 3D de exploracao." }
];

export const TACTICAL_3D_SYSTEMS = [
  { id: "turn", name: "Turno", rule: "Unidade abstrata de acao; nao representa literalmente 15 minutos." },
  { id: "mission_clock", name: "Relogio da missao", rule: "Avanca separado dos turnos e pode disparar reforcos, fuga, morte de civis ou fracasso." },
  { id: "actions", name: "Acoes", rule: "Movimento, ataque, habilidade, item, postura, interacao, inspiracao e espera." },
  { id: "action_points", name: "Pontos de Acao", rule: "Base 2 PA por turno; habilidades podem consumir 1 ou 2." },
  { id: "reaction", name: "Reacao", rule: "Parry, ataque de oportunidade, guarda ou habilidade especifica." },
  { id: "height", name: "Altura", rule: "Terreno elevado melhora visao e pode beneficiar ataques a distancia." },
  { id: "cover", name: "Cobertura", rule: "Reduz chance de acerto de projeteis; pode ser parcial ou total." },
  { id: "flanking", name: "Flanqueamento", rule: "Ataques laterais/traseiros recebem bonus e podem reduzir defesa." },
  { id: "zone_control", name: "Zona de controle", rule: "Presenca de unidades limita rotas e pune movimentacao descuidada." }
];

export const CAMERA_3D_PROFILES = [
  { context: "Exploracao", camera: "Terceira pessoa atras de William com ajuste de distancia." },
  { context: "Combate", camera: "Camera tatica 3D orbitavel com foco automatico no personagem ativo." },
  { context: "Ataque especial", camera: "Zoom curto cinematografico sem esconder informacoes essenciais." },
  { context: "Chefe", camera: "Enquadramento mais aberto para comunicar escala." },
  { context: "Dialogo", camera: "Planos medios/close-ups com camera dirigida." },
  { context: "Gestao", camera: "Mapa, mesa estrategica ou interface dedicada." }
];

export const LEADERSHIP_COMMANDS = [
  { id: "attack_leader", name: "Lider de Ataque", effect: "Aumenta temporariamente Coragem, iniciativa e dano." },
  { id: "hold_formation", name: "Mantenham a Formacao", effect: "Reduz chance de fuga e melhora defesa coletiva." },
  { id: "no_retreat", name: "Nao Recuem", effect: "Impede retirada involuntaria por alguns turnos." },
  { id: "regroup", name: "Reagrupar", effect: "Remove parte das penalidades de medo e aproxima aliados." },
  { id: "protect_wounded", name: "Protejam os Feridos", effect: "Altera prioridade de IA e concede bonus defensivo." }
];

export const TRAUMA_SYSTEM = [
  { type: "Fisico", examples: ["Perna ferida", "Braco ferido", "Olho ferido", "Cicatriz"], consequence: "Penalidades, animacoes e aparencia persistentes." },
  { type: "Psicologico", examples: ["Medo de monstros", "Medo de fogo", "Pesadelos", "Perda de confianca"], consequence: "Testes adicionais e dialogos especificos." },
  { type: "Social", examples: ["Humilhacao", "Desobediencia", "Ressentimento"], consequence: "Altera lealdade e relacoes." }
];

export const AI_ARCHETYPES = [
  { id: "aggressor", name: "Agressor", behavior: "Busca alvo vulneravel, flanqueia e pressiona HP/coragem." },
  { id: "archer", name: "Atirador", behavior: "Procura linha de visao, altura e cobertura antes de atacar." },
  { id: "defender", name: "Defensor", behavior: "Protege objetivo, feridos ou unidade chave e mantem zona de controle." },
  { id: "creature", name: "Criatura", behavior: "Usa medo, investida, terreno e ataques imprevisiveis." },
  { id: "boss", name: "Chefe", behavior: "Altera regras, objetivos, terreno e fases em vez de apenas ter HP alto." },
  { id: "ally", name: "Aliado", behavior: "Obedece ordens conforme lealdade, coragem, relacao e risco percebido." }
];

export const HUD_SPECS = [
  { context: "Exploracao", layout: "HUD discreto com vida, estado, objetivo e interacoes." },
  { context: "Combate", layout: "Topo com iniciativa e relogio; canto esquerdo com retratos; base com PA, acoes, previsao de dano, movimento, cobertura, estados e log." },
  { context: "Personagem", layout: "Atributos, equipamento, traumas, coragem, lealdade e relacoes." },
  { context: "Acessibilidade", layout: "Icones com texto, escala de UI, contraste, remapeamento e codificacao que nao depende so de cor." }
];

export const GODOT_TECHNICAL_ARCHITECTURE = [
  { system: "GameState", responsibility: "Estado global da campanha, flags, progresso e versao de save." },
  { system: "TurnManager", responsibility: "Fila de iniciativa, PA, turnos, reacoes e encerramento de rodada." },
  { system: "CombatSystem", responsibility: "Acerto, dano, tipos de dano, cobertura, altura, flanqueamento e objetivos." },
  { system: "FearSystem", responsibility: "Medo, coragem, colapso psicologico, bravura e recuperacao." },
  { system: "CompanionSystem", responsibility: "Lealdade, relacoes, traumas, conflitos e obediencia." },
  { system: "ReputationSystem", responsibility: "Valores por faccao e gatilhos narrativos." },
  { system: "PrincipalitySystem", responsibility: "Recursos, producao, consumo e infraestrutura." },
  { system: "MissionSystem", responsibility: "Objetivos, relogio, falhas, reforcos e recompensas." },
  { system: "SaveSystem", responsibility: "Persistencia local, backups, migradores e recuperacao." },
  { system: "EquipmentSystem", responsibility: "Inventario, equipamento, peso, resistencias e representacao 3D." }
];

export const PERFORMANCE_PROFILES_3D = [
  { target: "Desktop alto", graphics: "Sombras e materiais completos, maior distancia de visao, LOD alto e particulas completas." },
  { target: "Desktop medio", graphics: "Sombras moderadas, LOD medio, particulas limitadas e culling agressivo." },
  { target: "Mobile", graphics: "Texturas menores, LODs baixos, efeitos reduzidos, UI touch e 30 FPS opcional." },
  { target: "Modo seguro", graphics: "Qualidade minima, sem efeitos pesados, foco em save/load e leitura de UI." }
];

export const SAFE_MODE_RECOVERY = [
  "Logs de erros essenciais para cena, combate, IA, save, audio e plataforma.",
  "Backup antes de sobrescrever save.",
  "Migradores por versao de schema.",
  "Fallback de IA quando navmesh, alvo ou caminho falhar.",
  "Separar logica autoritativa de animacoes para evitar desync visual/logico.",
  "Opcoes de reduzir sombras, particulas, draw calls e distancia em caso de baixo desempenho."
];

export const WILLIAM_ROUTES = [
  { id: "route_1_knight", name: "Rota 1 - Cavaleiro orgulhoso", personality: "Bravura e determinacao", flaws: "Impulsivo e arrogante", weapons: ["Espada de duas maos", "Martelo de guerra"], armor: "Armadura pesada", items: ["Bracelete", "Capacete"], bonuses: { strength: 5, courage: 2, perception: -5, inspiration: -2 }, markBias: ["Gloregni", "Iusdicta"] },
  { id: "route_2_diplomat", name: "Rota 2 - Cavaleiro diplomata", personality: "Compromisso e transparencia", flaws: "Hesitacao e peso moral", weapons: ["Espada", "Escudo"], armor: "Malha media", items: ["Selo de audiencia"], bonuses: { inspiration: 4, perception: 2, courage: -1 }, markBias: ["Gloregni", "Satiae"] },
  { id: "route_3_builder", name: "Rota 3 - Governante construtor", personality: "Pragmatismo e responsabilidade", flaws: "Controle excessivo", weapons: ["Martelo de guerra", "Espada curta"], armor: "Armadura media", items: ["Ferramentas de corte"], bonuses: { infrastructure: 5, perception: 2, strength: 1 }, markBias: ["Thofestoe", "Gloregni"] },
  { id: "route_4_strategist", name: "Rota 4 - Estrategista", personality: "Analise e paciencia", flaws: "Frieza e distancia", weapons: ["Lanca", "Arco"], armor: "Couro reforcado", items: ["Mapa de campanha"], bonuses: { perception: 4, inspiration: 3, strength: -1 }, markBias: ["Satiae", "Iusdicta"] },
  { id: "route_5_survivor", name: "Rota 5 - Sobrevivente da corte", personality: "Astucia e adaptacao", flaws: "Desconfianca e cinismo", weapons: ["Adaga", "Espada"], armor: "Couro leve", items: ["Anel de corte"], bonuses: { agility: 4, perception: 3, courage: -2 }, markBias: ["Satiae", "Stipulation"] },
  { id: "route_6_hard", name: "Rota 6 - Dificil", personality: "Orgulho ferido e ambicao", flaws: "Risco de crueldade", weapons: ["Espada de duas maos", "Lanca Aes"], armor: "Armadura pesada", items: ["Marca instavel"], bonuses: { strength: 3, courage: 3, loyalty: -5 }, markBias: ["A Sanctis Signatus", "Gloregni"] }
];

export const WORLD_LORE = {
  startingDate: "25 de fevereiro de 1441",
  startingRegion: "Principado de Berwick/Gradron, caminho entre King's Lynn e Foxley Wood",
  aesDivinus: "Minerio divino surgido apos grandes rupturas historicas. E pesado demais para armaduras eficientes, mas excelente para joias, pontas de flecha e armas contra corrompidos.",
  aesWeapons: "Espadas, lancas e alabardas Aes possuem metal esverdeado com tons dourados. Em humanos cortam como aco; em seres abencoados por anjos corrompidos ferem, envenenam e atravessam pele como papel.",
  greatRupture: "A Grande Ruptura separou anjos puros e corrompidos; os corrompidos foram banidos para uma dimensao fora da realidade humana.",
  divineLandsWar: "As Guerras das Terras Divinas explicam a disputa por territorio, minerio Aes e legitimidade imperial."
};

export const CHARACTER_DATABASE = [
  { id: "william_augusto", name: "William Augusto", group: "Protagonistas", age: 19, role: "Principe e protagonista", description: "Rosto jovial, nariz reto, olhos azuis com tons amarelos/dourados, corpo um pouco magro e sorriso arrogante.", traits: ["rotas mudam personalidade", "lideranca", "governo"], flaws: ["orgulho", "pressao da corte"] },
  { id: "hilda_augusto", name: "Hilda Augusto", group: "Protagonistas", age: 19, role: "Versao feminina/rota alternativa de William", description: "Mesma funcao narrativa de William em rota alternativa de genero.", traits: ["lideranca", "coroa"], flaws: ["pressao da corte"] },
  { id: "elric_legrand", name: "Duque Elric Legrand", group: "Aliados e corte", age: 35, role: "Antigo cavaleiro da Guerra das Terras Divinas", description: "Responsavel e sereno, conservador e cinico; mentor militar/politico de William.", traits: ["experiencia", "disciplina"], flaws: ["conservadorismo", "cinismo"] },
  { id: "ethan_armand", name: "Ethan Armand", group: "Companheiros", age: 20, role: "Cavaleiro da dinastia Armand", description: "Alto, definido, cabelo ondulado castanho, rosto oval, barba inicial, olhos redondos castanhos.", traits: ["leal", "reservado"], flaws: ["superficial", "irritadico"] },
  { id: "donovan_mitchell", name: "Donovan Mitchell", group: "Companheiros", age: 22, role: "Cavaleiro, filho unico do duque Bezalel", description: "Corpo atletico, cabelos pretos lisos, rosto coracao, olhos azul-escuros redondos.", traits: ["paciente", "versatil"], flaws: ["individualista", "egocentrico"] },
  { id: "albert_roberts", name: "Albert Roberts", group: "Companheiros", age: 21, role: "Cavaleiro da dinastia Roberts", description: "Cabelos ruivos ondulados, olhos verdes amendoados e fisico definido.", traits: ["temperado", "solidario"], flaws: ["arrogante", "ignorante"] },
  { id: "enguerrand_corbin", name: "Enguerrand Corbin", group: "Aliados variaveis", age: 34, role: "Mercenario", description: "Paciente e resiliente, mas oportunista e desonesto.", traits: ["resiliencia"], flaws: ["oportunismo", "desonestidade"] },
  { id: "isabeau_moreau", name: "Isabeau Moreau", group: "Aliados", age: 18, role: "Santa guerreira", description: "Ganha importancia a partir do final do Ato I.", traits: ["fe", "combate"], flaws: ["idealismo"] },
  { id: "roger_redhead", name: "Roger Redhead", group: "Aliados", age: 18, role: "Soldado de infantaria", description: "Acompanhou William durante grande parte da campanha.", traits: ["persistencia"], flaws: ["inexperiencia"] },
  { id: "cadman_armand", name: "Cadman Armand", group: "Corte", age: 28, role: "Irmao mais velho de Ethan", description: "Cavaleiro respeitado, orgulhoso da familia e proximo de Elric.", traits: ["forca", "orgulho"], flaws: ["rigidez"] },
  { id: "bezalel_mitchell", name: "Duque Bezalel Mitchell", group: "Antagonistas politicos", age: 37, role: "Pai de Donovan e antagonista politico", description: "Inteligente, manipulador e sadico.", traits: ["estrategia", "manipulacao"], flaws: ["crueldade"] },
  { id: "frederico", name: "Bispo Frederico", group: "Corte e igreja", age: 50, role: "Clerigo", description: "Figura religiosa ligada a corte e aos conflitos de fe.", traits: ["autoridade"], flaws: ["dogmatismo"] },
  { id: "john", name: "John", group: "Corte e igreja", age: 27, role: "Monge copista", description: "Guarda e interpreta registros.", traits: ["memoria"], flaws: ["medo"] },
  { id: "agnes_heller", name: "Agnes Heller", group: "Corte e igreja", age: 19, role: "Freira", description: "Ligada a cuidados, fe e rumor popular.", traits: ["compaixao"], flaws: ["fragilidade politica"] },
  { id: "robert_smith", name: "Robert Smith", group: "Povo e oficio", age: 39, role: "Ferreiro", description: "Ferreiro do principado e ponto de ligacao com armas/ferramentas.", traits: ["oficio"], flaws: ["familia vulneravel"] },
  { id: "maria", name: "Maria", group: "Povo e oficio", age: 39, role: "Esposa de Robert", description: "Parte da familia do ferreiro.", traits: ["cuidado"], flaws: ["risco civil"] },
  { id: "mateus", name: "Mateus", group: "Povo e oficio", age: 12, role: "Filho mais velho do ferreiro", description: "Crianca civil afetada por decisoes de guerra.", traits: ["curiosidade"], flaws: ["vulnerabilidade"] },
  { id: "tome", name: "Tome", group: "Povo e oficio", age: 7, role: "Filho mais novo do ferreiro", description: "Crianca civil afetada por fome e cerco.", traits: ["inocencia"], flaws: ["vulnerabilidade"] },
  { id: "rafael", name: "Rafael", group: "Povo e oficio", age: 49, role: "Barbeiro-cirurgiao", description: "Tratamento de feridos e consequencias fisicas.", traits: ["medicina pratica"], flaws: ["limites tecnicos"] },
  { id: "guilherme", name: "Guilherme", group: "Povo e oficio", age: 17, role: "Aprendiz de cirurgiao", description: "Aprendiz de Rafael.", traits: ["aprendizado"], flaws: ["inexperiencia"] },
  { id: "godwin", name: "Godwin", group: "Corte e igreja", age: 60, role: "Monge", description: "Memoria antiga da fe e das escrituras.", traits: ["tradicao"], flaws: ["cansaco"] }
];

export const DUCHIES = [
  { id: "legrand", name: "Dinastia Legrand", duke: "Elric Legrand", position: "Direita do principado, abaixo do ducado Michael", specialty: "Diplomacia e memoria militar", emblem: "Ave carregando uma espada", resources: "Recursos moderados e exercito de cerca de 200 homens", tension: "Respeitado, mas pequeno para sustentar a crise sozinho." },
  { id: "michael", name: "Dinastia Michael", duke: "Bezalel Mitchell", position: "Direita do principado, acima de Legrand", specialty: "Segredos, espionagem e neutralidade calculada", emblem: "Corvo escuro em floresta escura", resources: "Informacao e forcas ocultas", tension: "Acusada de alimentar conflitos sem deixar provas." },
  { id: "armand", name: "Dinastia Armand", duke: "Cadman Armand", position: "Esquerda do principado, acima de Roberts", specialty: "Exercitos e forca militar", emblem: "Cavaleiro erguendo espada contra um leao", resources: "Principal forca armada do principado", tension: "Pode enfrentar barbaros ou o principe se enxergar fraqueza." },
  { id: "roberts", name: "Dinastia Roberts", duke: "Casa Roberts", position: "Esquerda do principado, abaixo de Armand", specialty: "Fe, comida e recursos", emblem: "Cruz laranja com circulo", resources: "Principal fonte de alimento e suprimentos", tension: "Religiosa e conservadora, confia primeiro na propria fe." }
];

export const BESTIARY = [
  { id: "homines_corrupti", name: "Homines Corrupti", act: "Prologo/Ato I", type: "Humano corrompido", threat: "Atacam viajantes, soldados isolados e grupos pequenos nas florestas.", combat: "Pele um pouco mais resistente, vulneravel a espada e arco; aumenta medo em camponeses.", model: "Silhueta humana ferida, olhos vazios, pele irregular." },
  { id: "barbarian_homines_corrupti", name: "Homines Corrupti Barbaros", act: "Prologo/Ato II", type: "Barbaro corrompido", threat: "Tropa de choque das invasoes barbaras.", combat: "Mais resistente, usa protecoes em ombros/capacete e pressiona linha de frente.", model: "Barbaro com armadura quebrada e veios de corrupcao." },
  { id: "servi_belli_larvae", name: "Servi Belli Larvae", act: "Ato II", type: "Cadaver de guerra reanimado", threat: "Mortos usados para distrair tropas e abrir caminho aos invasores.", combat: "Avanca em massa, causa atordoamento e medo.", model: "Corpo incompleto com roupa antiga, feridas abertas e arma simples." },
  { id: "ogre_larva_belli", name: "Ogre Larva Belli", act: "Ato II/Ato III", type: "Chefe grotesco", threat: "Evolucao de Servi apos matar ou ser alterado por barbaros.", combat: "Alto HP, membros extras, armas fundidas a carne, ataques de area.", model: "Gigante sem humanidade, torso exposto e cranio animal." },
  { id: "praecones_caesarum", name: "Praecones Caesarum", act: "Ato III/Ato V", type: "Arauto dos anjos traidores", threat: "Lidera campanhas, rituais e corrupcao territorial.", combat: "Fases, medo, invocacao e retorno ao continente corrompido se destruido.", model: "Humano nobre deformado por marca profana." },
  { id: "canis_ferox", name: "Canis Ferox", act: "Prologo/Ato II", type: "Canino corrompido", threat: "Caca viajantes e camponeses; anda em bandos de ate quatro.", combat: "Rapido, flanqueia, late para aumentar medo.", model: "Canino grande, ferido, olhos furiosos." },
  { id: "bestia_ignis", name: "Bestia Ignis", act: "Ato II/Ato III", type: "Abominacao ritual", threat: "Mistura de lobo/cao, cabra e serpente usada como arma barbarica.", combat: "Fogo, mordida, chifres, veneno e garras.", model: "Cabeca canina/caprina, cauda de serpente, garganta incandescente." },
  { id: "corvus_stipulation", name: "Corvus Stipulation", act: "Final do Ato II", type: "Guardiao monstruoso", threat: "Corvo gigante de tres olhos guardando o territorio Michael.", combat: "Bico esmagador, patas pesadas, sombras e terror.", model: "Ave enorme preta, tres olhos, aura de escuridao." },
  { id: "umbrae_maleficae", name: "Umbrae Maleficae", act: "Ato III", type: "Cultistas das sombras", threat: "Manipuladoras e assassinas ligadas a Stipulation.", combat: "Emboscada, ilusao, pouca luz e controle social.", model: "Mantos escuros, rosto quase oculto, gestos rituais." },
  { id: "superior_umbrae_maleficae", name: "Superior Umbrae Maleficae", act: "Ato III", type: "Lider de culto", threat: "Porta-voz de Stipulation e criadora de criaturas sombrias.", combat: "Rituais, convocacao e mapas em escuridao sufocante.", model: "Figura cerimonial com marcas e luz negra." },
  { id: "mulier_umbris_consumptae", name: "Mulier Umbris Consumptae", act: "Ato III", type: "Vitima amaldicoada", threat: "Mulheres sacrificadas que vagam gritando maldicoes e espalhando medo.", combat: "Grito, peste, dano de coragem.", model: "Sem olhos, boca aberta, liquido escuro." },
  { id: "qui_decepti_sunt", name: "Qui Decepti Sunt", act: "Ato III", type: "Servo enganado", threat: "Homens consumidos por falsas promessas de poder.", combat: "Obediencia absoluta, ataques coordenados, resistencia mental baixa.", model: "Pele palida, olhos negros e marcas de lagrima escura." },
  { id: "bellum_bellatoris", name: "Bellum Bellatoris", act: "Ato V", type: "Vilao sobrenatural", threat: "Demonio ligado a guerra/sangue e aos horrores maiores da campanha.", combat: "Multifasico, pressao de medo, sangue, terreno e lideranca.", model: "Entidade marcial, carne e metal vivo." }
];

export const DIVINE_MARKS = [
  { id: "iusdicta", name: "Marca de Iusdicta", alignment: "Anjo puro", domain: "Justica", sign: "Asas nas costas e olhos azul-claro/dourados; a cegueira fisica abre visao astral.", gameplay: "Revela pecados, enfraquece marcados por Stipulation e fortalece decisoes justas." },
  { id: "thofestoe", name: "Marca de Thofestoe", alignment: "Anjo puro", domain: "Fogo calmo, oficio e construcao", sign: "Marca do antebraco ao torso como calor acolhedor.", gameplay: "Melhora forja, ferramentas, obras, armas e leitura de materiais." },
  { id: "gloregni", name: "Marca de Gloregni", alignment: "Anjo puro", domain: "Coroa e lideranca", sign: "Surge na mao de monarcas em tempos de caos.", gameplay: "Amplifica outras marcas, lideranca, forca e autoridade politica." },
  { id: "satiae", name: "Marca de Satiae", alignment: "Anjo puro", domain: "Conhecimento e sabedoria", sign: "Olhos verdes marcados por tons escuros ao redor.", gameplay: "Aumenta aprendizado, leitura social, investigacao e risco de arrogancia." },
  { id: "miseritae", name: "Marca de Miseritae", alignment: "Anjo puro", domain: "Vida e misericordia", sign: "Plantas no torso crescendo aos antebracos.", gameplay: "Cura ferimentos, sente dor dos vivos e cria dilemas contra matar." },
  { id: "sanctis_signatus", name: "A Sanctis Signatus", alignment: "Marcos historicos", domain: "As cinco bencaos", sign: "Olhos dourados com detalhes de cores conforme as bencaos despertas.", gameplay: "Pode despertar marcas em outros escolhidos e ramificar poderes por acao." },
  { id: "bellinis", name: "Marca de Bellinis", alignment: "Anjo corrompido", domain: "Guerra e sangue", sign: "Carne queimada, musculos e veias expostos.", gameplay: "Cria arautos gigantes, fogo, machados vivos e destruicao brutal." },
  { id: "stipulation", name: "Marca de Stipulation", alignment: "Anjo corrompido", domain: "Manipulacao e segredo", sign: "Quase transparente, revelada por luz ou escuridao extrema; ausencia de sombra.", gameplay: "Disfarce, espionagem, asas negras e controle por mentira." }
];

export const ANGELS = {
  pure: ["Anjo da Coragem", "Anjo da Justica", "Anjo da Vida", "Anjo da Esperanca", "Anjo da Harmonia"],
  corrupted: ["Anjo da Guerra e do Sangue", "Anjo da Manipulacao e das Artimanhas", "Anjo da Morte", "Anjo do Medo", "Anjo da Perfeicao"]
};

export const HISTORICAL_TIMELINE = [
  { period: "600-700", title: "Comeco do Imperio Romano Bizatino", summary: "Martinus, Amandus, Agustinos e Catao marcam a formacao, golpe e sucessao inicial." },
  { period: "750-800", title: "Grande Era Bizantina", summary: "Marcus fortalece armas, protecoes, escolas e saude antes da transicao imperial." },
  { period: "800-850", title: "Era de Cesar", summary: "Expansionismo tiranico, fome, incendio de Roma e traicao de Brutus." },
  { period: "850-910", title: "Era dos Caidos", summary: "Tribos do norte contatam Bellinis; Nero pesquisa anjos caidos e quase rompe o selo da morte." },
  { period: "910-950", title: "Era dos Marcados", summary: "Surgem Homines Corrupti, Praecones Caesarum e os herois Sanctis Signatus contra Nero." },
  { period: "950-1000", title: "Fim do velho imperio", summary: "Revoltas e fragmentacao levam ao Imperio Gra-Franco-Saxao, reino Itano e novas potencias." },
  { period: "1280-1436", title: "Guerras das Terras Divinas", summary: "Conflitos por territorio, legitimidade e minerio Aes preparam a crise de 1441." },
  { period: "1441", title: "Prologo - Floresta de Sangue", summary: "William lidera 300 homens entre King's Lynn e Foxley Wood contra invasores barbaros." }
];

export const CHARACTER_OPTIONS = {
  origins: [
    { id: "abakorum", label: "Abakorum", bonus: "Lealdade +5", description: "Criado perto da coroa e acostumado a peso politico." },
    { id: "frontier", label: "Fronteira", bonus: "Coragem +5", description: "Sobreviveu a estradas, emboscadas e inverno duro." },
    { id: "monastery", label: "Mosteiro", bonus: "Percepcao +2", description: "Educado entre textos proibidos e pressagios." }
  ],
  bodies: ["Magro", "Definido", "Fit", "Atletico", "Musculoso", "Forte", "Corpulento", "Gordinho"],
  bodyShapes: ["Retangular", "Triangular", "Trapezio", "Oval", "Triangulo invertido"],
  faces: ["Oval", "Hexagonal", "Triangular", "Longo", "Redondo", "Diamante", "Coracao", "Quadrado"],
  eyeShapes: ["Redondos", "Redondos amendoados", "Amendoados", "Amendoados finos", "Caidos", "Caidos escondidos", "Escondidos", "Orientais", "Orientais arredondados"],
  eyeColors: ["Castanho", "Azul", "Verde", "Azul esverdeado", "Verde amarelado", "Ambar", "Avela", "Azul profundo", "Verde escuro", "Avela sardento", "Azul acinzentado", "Verde floresta", "Avela escuro", "Cinza", "Verde primavera", "Azul safira", "Azul gelo", "Onix", "Chocolate", "Violeta ametista"],
  hair: ["Liso 1A", "Liso 1B", "Liso 1C", "Ondulado 2A", "Ondulado 2B", "Ondulado 2C", "Cacheado 3A", "Cacheado 3B", "Cacheado 3C", "Crespo 4A", "Crespo 4B", "Crespo 4C", "Raspado"],
  hairColors: ["Preto profundo", "Preto natural", "Castanho escuro", "Castanho medio", "Castanho claro", "Loiro escuro", "Loiro medio", "Loiro claro", "Loiro muito claro", "Loiro clarissimo", "Acinzentado", "Violeta", "Dourado", "Cobre", "Acaju", "Vermelho", "Marrom"],
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
    MISSION_SCENE_OVERRIDES[mission.id] ?? [
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
  { title: "Exploracao 2D side-scroller", text: "A versao Godot recebe base de Action RPG 2D Pixel Art / Side-Scroller para mapas de exploracao, interacao, camera lateral, estados de movimento e transicoes para combate tatico." },
  { title: "Posicoes", text: "Aliados ocupam seis posicoes a esquerda e inimigos seis a direita. Frente protege e aproxima; retaguarda favorece arco, suporte, altura e cobertura." },
  { title: "Medo e coragem", text: "Ameacas, mortes e efeitos sobrenaturais testam Coragem. Estados de medo reduzem iniciativa, acerto, defesa e podem bloquear a acao." },
  { title: "Lideranca", text: "William pode inspirar, manter formacao, reagrupar e impedir recuos. Lealdade decide se ordens perigosas sao aceitas." },
  { title: "Principado", text: "Comida, madeira, ferro, ouro, tropas, infraestrutura e reputacao conectam campanha, missoes e consequencias." },
  { title: "Ducados de Gradron", text: "Legrand, Michael, Armand e Roberts formam a pressao politica do principado, cada um com recursos, emblemas, rivalidades e rotas proprias." },
  { title: "Aes Divinus", text: "Minerio divino pesado, usado em joias, pontas de flecha e armas esverdeadas/douradas capazes de ferir criaturas corrompidas com eficacia superior." },
  { title: "Marcas divinas", text: "Iusdicta, Thofestoe, Gloregni, Satiae, Miseritae, A Sanctis Signatus, Bellinis e Stipulation conectam poderes, consequencias fisicas, politica e escolhas." },
  { title: "Bestiario", text: "Homines Corrupti, Servi Belli Larvae, Ogre Larva Belli, Praecones Caesarum, Canis Ferox, Bestia Ignis e criaturas de Stipulation entram como ameacas de campanha e direcao de modelagem." }
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
