import fs from "node:fs/promises";
import path from "node:path";
import {
  ARMORS,
  CHARACTER_OPTIONS,
  CODEX,
  EQUIPMENT_DESIGNS,
  FEAR_STATES,
  GAME_CURRENCY,
  HEROES,
  INITIAL_PRINCIPALITY,
  ITEM_CATALOG,
  MISSIONS,
  MISSION_SCENES,
  POSITION_TRAITS,
  SHOP_AREAS,
  WEAPONS
} from "../src/data.js";
import { AUDIO_CATALOG } from "../src/audio.js";

const root = process.cwd();
const outDir = path.join(root, "godot", "data");

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  path.join(outDir, "aes_divinus_data.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      game: "Aes Divinus",
      source: "src/data.js",
      fearStates: FEAR_STATES,
      weapons: WEAPONS,
      armors: ARMORS,
      gameCurrency: GAME_CURRENCY,
      shopAreas: SHOP_AREAS,
      itemCatalog: ITEM_CATALOG,
      positionTraits: POSITION_TRAITS,
      heroes: HEROES,
      initialPrincipality: INITIAL_PRINCIPALITY,
      missions: MISSIONS,
      missionScenes: MISSION_SCENES,
      characterOptions: CHARACTER_OPTIONS,
      equipmentDesigns: EQUIPMENT_DESIGNS,
      audioCatalog: AUDIO_CATALOG,
      codex: CODEX,
      parityManifest: {
        requiredStatus: "Everything built from the web/Electron version must remain represented in the Godot version.",
        gameplaySystems: [
          "login/cadastro local lembrado",
          "criacao de personagem completa",
          "campanha com prologo e 38 missoes principais",
          "cenas narrativas de missao",
          "combate tatico por turnos",
          "posicoes, PA, acerto, dano, cobertura e alcance",
          "medo, coragem e lideranca",
          "principado, recursos e reputacao",
          "arsenal, lojas, compra, venda, equipamentos e Coroas de Aes",
          "pedras vinculadas a itens",
          "codex",
          "audio por contexto",
          "configuracoes/acessibilidade",
          "deteccao de hardware",
          "autosave local",
          "sincronizacao GitHub preparada",
          "seguranca, privacidade, termos e resposta a incidentes",
          "modelagem 3D Godot e pipeline Blender/glTF",
          "nucleo C++ preparado para GDExtension"
        ],
        documents: [
          "README.md",
          "PRIVACY_POLICY.md",
          "TERMS_OF_USE.md",
          "COMPLIANCE_RELEASE_CHECKLIST.md",
          "docs/PLANO_RESPOSTA_INCIDENTES_CIBERNETICOS.md",
          "docs/CONTATOS_AUTORIDADES_CIBERNETICAS_GLOBAIS.md",
          "docs/DIREITOS_PUBLICACAO_STEAM_REGRAS.md",
          "docs/MODELAGEM_GODOT_BLENDER_PIPELINE.md"
        ],
        buildTargets: ["Windows", "Linux", "Android", "iOS", "Steam-ready documentation"]
      }
    },
    null,
    2
  )
);

console.log("Godot data exported to godot/data/aes_divinus_data.json");
