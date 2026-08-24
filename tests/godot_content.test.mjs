import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_ARCHETYPES,
  BESTIARY,
  CAMERA_3D_PROFILES,
  CHARACTER_DATABASE,
  CORE_GAME_LOOP,
  DESIGN_PILLARS,
  DIVINE_MARKS,
  DUCHIES,
  EXPLORATION_3D_SYSTEMS,
  GODOT_GAME_STRUCTURE,
  GODOT_TECHNICAL_ARCHITECTURE,
  HISTORICAL_TIMELINE,
  HUD_SPECS,
  PERFORMANCE_PROFILES_3D,
  SAFE_MODE_RECOVERY,
  SIDE_SCROLLER_ACTIONS,
  TACTICAL_3D_SYSTEMS,
  WILLIAM_ROUTES,
  WORLD_LORE
} from "../src/data.js";

test("Godot content includes attached lore, movement and world systems", () => {
  assert.equal(WILLIAM_ROUTES.length, 6);
  assert.ok(SIDE_SCROLLER_ACTIONS.some((action) => action.state === "PARRY"));
  assert.ok(SIDE_SCROLLER_ACTIONS.some((action) => action.state === "DODGE"));
  assert.ok(SIDE_SCROLLER_ACTIONS.some((action) => action.state === "CROUCH"));
  assert.ok(GODOT_GAME_STRUCTURE.targetStyle.includes("RPG tatico 3D"));
  assert.ok(GODOT_GAME_STRUCTURE.sceneFolders.includes("scenes/player/player.tscn"));
  assert.ok(WORLD_LORE.aesDivinus.includes("Minerio divino"));
});

test("Godot world data keeps characters, duchies, marks and bestiary connected", () => {
  assert.ok(CHARACTER_DATABASE.some((character) => character.id === "ethan_armand"));
  assert.ok(CHARACTER_DATABASE.some((character) => character.id === "donovan_mitchell"));
  assert.ok(CHARACTER_DATABASE.some((character) => character.id === "bezalel_mitchell"));
  assert.deepEqual(DUCHIES.map((duchy) => duchy.id), ["legrand", "michael", "armand", "roberts"]);
  assert.ok(BESTIARY.some((creature) => creature.id === "canis_ferox"));
  assert.ok(BESTIARY.some((creature) => creature.id === "bestia_ignis"));
  assert.ok(DIVINE_MARKS.some((mark) => mark.id === "gloregni"));
  assert.ok(DIVINE_MARKS.some((mark) => mark.id === "stipulation"));
  assert.ok(HISTORICAL_TIMELINE.some((entry) => entry.period === "1441"));
});

test("Godot master GDD V2 systems are represented", () => {
  assert.ok(DESIGN_PILLARS.length >= 6);
  assert.deepEqual(CORE_GAME_LOOP, ["Explorar", "Identificar ameaca", "Preparar formacao", "Combater", "Sofrer consequencias", "Administrar recursos", "Decidir", "Proxima missao"]);
  assert.ok(EXPLORATION_3D_SYSTEMS.some((system) => system.id === "light_stealth"));
  assert.ok(TACTICAL_3D_SYSTEMS.some((system) => system.id === "mission_clock"));
  assert.ok(CAMERA_3D_PROFILES.some((profile) => profile.context === "Combate"));
  assert.ok(AI_ARCHETYPES.some((archetype) => archetype.id === "boss"));
  assert.ok(HUD_SPECS.some((spec) => spec.context === "Combate"));
  assert.ok(GODOT_TECHNICAL_ARCHITECTURE.some((system) => system.system === "TurnManager"));
  assert.ok(PERFORMANCE_PROFILES_3D.some((profile) => profile.target === "Mobile"));
  assert.ok(SAFE_MODE_RECOVERY.some((item) => item.includes("Migradores")));
});
