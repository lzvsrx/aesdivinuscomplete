import assert from "node:assert/strict";
import test from "node:test";
import { AesDivinusGame } from "../src/game.js";
import { detectHardware } from "../src/hardware.js";
import { MemoryGameDatabase } from "../src/database.js";

function fakeEnv({ cores, memory, webgl = true, pixelRatio = 1, touch = 0, reducedMotion = false, width = 1920, height = 1080 }) {
  const gl = {
    getExtension: () => null,
    getParameter: () => "Fake GPU"
  };
  return {
    navigator: {
      platform: "test",
      userAgent: "test",
      language: "pt-BR",
      hardwareConcurrency: cores,
      deviceMemory: memory,
      maxTouchPoints: touch,
      onLine: true
    },
    screen: {
      width,
      height
    },
    innerWidth: 1280,
    innerHeight: 720,
    devicePixelRatio: pixelRatio,
    matchMedia: () => ({ matches: reducedMotion }),
    document: {
      createElement: () => ({
        getContext: () => (webgl ? gl : null)
      })
    }
  };
}

test("hardware detector chooses low preset for weak devices", () => {
  const detected = detectHardware(fakeEnv({ cores: 2, memory: 2, webgl: true, pixelRatio: 3, touch: 5, width: 720, height: 1280 }));
  assert.equal(detected.presetId, "very_low");
});

test("hardware detector chooses high or ultra for strong devices", () => {
  const detected = detectHardware(fakeEnv({ cores: 16, memory: 16, webgl: true, pixelRatio: 1, touch: 0 }));
  assert.ok(["high", "ultra"].includes(detected.presetId));
});

test("game applies hardware preset to graphics state", () => {
  const game = new AesDivinusGame({ database: new MemoryGameDatabase() });
  const detected = game.detectAndApplyHardware(fakeEnv({ cores: 2, memory: 2, webgl: false, pixelRatio: 1, touch: 0 }));
  assert.equal(detected.presetId, "very_low");
  assert.equal(game.state.graphics.quality, "very_low");
  assert.equal(game.state.graphics.preset.fps, 30);
});
