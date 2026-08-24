import assert from "node:assert/strict";
import test from "node:test";
import {
  BESTIARY,
  CHARACTER_DATABASE,
  DIVINE_MARKS,
  DUCHIES,
  GODOT_GAME_STRUCTURE,
  HISTORICAL_TIMELINE,
  SIDE_SCROLLER_ACTIONS,
  WILLIAM_ROUTES,
  WORLD_LORE
} from "../src/data.js";

test("Godot content includes attached lore, movement and world systems", () => {
  assert.equal(WILLIAM_ROUTES.length, 6);
  assert.ok(SIDE_SCROLLER_ACTIONS.some((action) => action.state === "PARRY"));
  assert.ok(SIDE_SCROLLER_ACTIONS.some((action) => action.state === "DODGE"));
  assert.ok(GODOT_GAME_STRUCTURE.targetStyle.includes("Side-Scroller"));
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
