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
      codex: CODEX
    },
    null,
    2
  )
);

console.log("Godot data exported to godot/data/aes_divinus_data.json");
