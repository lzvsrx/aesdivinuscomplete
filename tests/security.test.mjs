import assert from "node:assert/strict";
import test from "node:test";
import { AesDivinusGame } from "../src/game.js";
import { MemoryGameDatabase } from "../src/database.js";
import { buildSystemSaveFiles, pushSaveToGithub } from "../src/githubSync.js";
import { createSecureEnvelope, escapeHtml, openSecureEnvelope, sanitizePayload, sanitizeText } from "../src/security.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

test("user settings are clamped and saved in game state", async () => {
  const database = new MemoryGameDatabase();
  const game = new AesDivinusGame({ database });
  game.setUserSetting("fontScale", 9);
  game.setUserSetting("screenWidth", "wide");
  game.setUserSetting("contrast", "high");
  game.setUserSetting("privacyMode", true);
  await game.save();

  const loaded = new AesDivinusGame({ database });
  assert.equal(await loaded.load(), true);
  assert.equal(loaded.state.settings.fontScale, 1.45);
  assert.equal(loaded.state.settings.screenWidth, "wide");
  assert.equal(loaded.state.settings.contrast, "high");
  assert.equal(loaded.state.settings.privacyMode, true);
});

test("text and event payload sanitizers remove unsafe content", () => {
  assert.equal(sanitizeText("  <b>Aes</b>\nDivinus  ", 20), "<b>Aes</b> Divinus");
  assert.equal(escapeHtml("<script>x</script>"), "&lt;script&gt;x&lt;/script&gt;");
  assert.deepEqual(sanitizePayload({ password: "abc", note: " ok\n" }), { password: "[redacted]", note: "ok" });
});

test("secure envelope can encrypt and reopen a local save snapshot", async () => {
  const storage = memoryStorage();
  const state = { account: { email: "lz@example.com" }, campaign: { day: 4 } };
  const envelope = await createSecureEnvelope(state, { cryptoApi: crypto, storage });
  assert.equal(envelope.algorithm, "AES-GCM");
  assert.ok(!envelope.data.includes("lz@example.com"));
  assert.deepEqual(await openSecureEnvelope(envelope, { cryptoApi: crypto, storage }), state);
});

test("github sync sends a save with user supplied repository settings", async () => {
  const calls = [];
  const fetchApi = async (url, init = {}) => {
    calls.push({ url, init });
    if (!init.method) return { ok: false, status: 404 };
    return { ok: true, json: async () => ({ commit: { sha: "abc123" } }) };
  };
  const result = await pushSaveToGithub(
    { campaign: { day: 2 }, githubSync: { token: "secret" } },
    { enabled: true, owner: "lzvsrx", repo: "aesdivinuscomplete", branch: "main", path: "saves/test.json", token: "token" },
    { fetchApi }
  );

  assert.equal(result.ok, true);
  assert.equal(result.files.length, 9);
  assert.equal(calls.length, 18);
  assert.equal(JSON.parse(calls[1].init.body).message, "Autosave Aes Divinus - snapshot completo");
  assert.ok(calls.some((call) => String(call.url).includes("saves/systems/inventory-economy.json")));
  assert.match(calls[1].init.headers.Authorization, /^Bearer /);
});

test("github structured save files cover the main game systems", () => {
  const game = new AesDivinusGame({ database: new MemoryGameDatabase() });
  assert.equal(game.state.githubSync.enabled, true);
  const files = buildSystemSaveFiles(game.publicSyncState(), { systemPath: "saves/systems" });
  assert.deepEqual(
    files.map((file) => file.path),
    [
      "saves/aes-divinus-save.json",
      "saves/systems/account.json",
      "saves/systems/character.json",
      "saves/systems/campaign.json",
      "saves/systems/principality.json",
      "saves/systems/inventory-economy.json",
      "saves/systems/combat.json",
      "saves/systems/settings.json",
      "saves/systems/journal-codex.json"
    ]
  );
});
