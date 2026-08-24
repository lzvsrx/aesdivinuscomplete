import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import test from "node:test";
import { AUDIO_CATALOG, AudioSystem } from "../src/audio.js";
import { AesDivinusGame } from "../src/game.js";
import { MemoryGameDatabase } from "../src/database.js";

test("audio catalog maps every sound to local slots and Pixabay sources", () => {
  const required = ["ui_click", "menu_open", "title_ambience", "mission_scene", "forest_ambience", "combat_start", "sword_attack", "armor_hit", "bow_attack", "fire", "fear", "victory", "defeat"];
  assert.deepEqual(Object.keys(AUDIO_CATALOG), required);
  for (const entry of Object.values(AUDIO_CATALOG)) {
    assert.ok(entry.label);
    assert.ok(entry.fallback);
    assert.ok(entry.files.every((file) => file.startsWith("assets/audio/") && file.endsWith(".mp3")));
    assert.ok(entry.sources.every((source) => source.url.startsWith("https://pixabay.com/")));
  }
});

test("all catalog audio slots have local mp3 assets", () => {
  const files = Object.values(AUDIO_CATALOG).flatMap((entry) => entry.files);
  assert.equal(files.length, 29);
  for (const file of files) {
    assert.equal(existsSync(file), true, `${file} is missing`);
    assert.ok(statSync(file).size > 1024, `${file} is too small`);
  }
});

test("audio settings are part of persistent game state", async () => {
  const database = new MemoryGameDatabase();
  const game = new AesDivinusGame({ database });
  game.setAudioEnabled(false);
  game.setAudioVolume(0.35);
  await game.save();

  const loaded = new AesDivinusGame({ database });
  assert.equal(await loaded.load(), true);
  assert.equal(loaded.state.audio.enabled, false);
  assert.equal(loaded.state.audio.masterVolume, 0.35);
});

test("audio system falls back without throwing when local files are unavailable", async () => {
  let fallbackType = "";
  const player = {
    volume: 0,
    loop: false,
    play: () => Promise.reject(new Error("missing file"))
  };
  const system = new AudioSystem({
    audioFactory: () => player,
    contextFactory: () => {
      throw new Error("blocked audio context");
    }
  });
  system.playFallback = (type) => {
    fallbackType = type;
  };

  system.play("sword_attack");
  await Promise.resolve();
  assert.equal(fallbackType, "slash");
});
