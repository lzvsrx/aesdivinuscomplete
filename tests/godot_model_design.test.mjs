import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Godot procedural 3D models include polished character and equipment details", async () => {
  const library = await readFile(new URL("../godot/scripts/model_library.gd", import.meta.url), "utf8");
  const gallery = await readFile(new URL("../godot/scripts/model_gallery.gd", import.meta.url), "utf8");

  for (const detail of [
    "tabard",
    "aes_stone_chest",
    "chest_trim_l",
    "hand_l",
    "knee_l",
    "rune_stone",
    "bow_aes_stone",
    "spear_focus_stone",
    "council_stone",
    "gate_mark"
  ]) {
    assert.ok(library.includes(detail), `${detail} missing from model library`);
  }

  assert.ok(gallery.includes("WorldEnvironment"));
  assert.ok(gallery.includes("GoldRimLight"));
  assert.ok(gallery.includes("_add_display_band"));
});
