import assert from "node:assert/strict";
import test from "node:test";
import { AesDivinusGame, MISSIONS, Rng } from "../src/game.js";
import { MemoryGameDatabase } from "../src/database.js";

test("starts a tactical battle with initiative and 2 AP", () => {
  const game = new AesDivinusGame({ rng: new Rng(1), database: new MemoryGameDatabase() });
  game.state.selectedMissionId = "gate_at_dusk";
  game.startSelectedMission();
  const battle = game.state.battle;
  assert.equal(game.state.mode, "combat");
  assert.ok(battle.queue.length > 0);
  assert.ok(battle.activeId);
  assert.equal(game.activeUnit().ap, 2);
});

test("attack separates hit chance from damage and spends AP", () => {
  const game = new AesDivinusGame({ rng: new Rng(2), database: new MemoryGameDatabase() });
  game.state.selectedMissionId = "gate_at_dusk";
  game.startSelectedMission();
  const william = game.unit("william");
  game.state.battle.activeId = "william";
  william.ap = 2;
  const target = game.living("enemy")[0];
  const before = target.hp;
  const result = game.attack("william", target.id);
  assert.equal(result.ok, true);
  assert.equal(william.ap, 1);
  assert.ok(target.hp <= before);
  assert.ok(result.chance >= 8 && result.chance <= 95);
});

test("fear tests can apply a psychological state", () => {
  const game = new AesDivinusGame({ rng: new Rng(3), database: new MemoryGameDatabase() });
  game.state.selectedMissionId = "herald_of_the_woods";
  game.startSelectedMission();
  const ethan = game.unit("ethan");
  const state = game.testFear(ethan, 35, "ameaca sobrenatural");
  assert.notEqual(state, "steady");
  assert.equal(ethan.fear, state);
});

test("principality decisions spend and grant resources", () => {
  const game = new AesDivinusGame({ rng: new Rng(4), database: new MemoryGameDatabase() });
  const beforeGold = game.state.principality.gold;
  const beforeFood = game.state.principality.food;
  game.spendOn("food");
  assert.equal(game.state.principality.gold, beforeGold - 8);
  assert.equal(game.state.principality.food, beforeFood + 14);
});

test("save and load preserve campaign state", async () => {
  const database = new MemoryGameDatabase();
  const game = new AesDivinusGame({ rng: new Rng(5), database });
  game.state.campaign.day = 7;
  await game.save();
  const loaded = new AesDivinusGame({ rng: new Rng(6), database });
  assert.equal(await loaded.load(), true);
  assert.equal(loaded.state.campaign.day, 7);
});

test("database records gameplay events", async () => {
  const database = new MemoryGameDatabase();
  const game = new AesDivinusGame({ rng: new Rng(7), database });
  game.state.selectedMissionId = "gate_at_dusk";
  game.startSelectedMission();
  await game.save();
  assert.ok(await database.countEvents() >= 2);
});

test("account and character creation move through the screen flow", () => {
  const game = new AesDivinusGame({ rng: new Rng(8), database: new MemoryGameDatabase() });
  const account = game.registerAccount({ name: "LZ", email: "lz@example.com", password: "segredo1", remember: true });
  assert.equal(account.ok, true);
  assert.equal(game.state.mode, "character_create");
  assert.equal(game.state.rememberedProfiles[0].email, "lz@example.com");

  const character = game.createCharacter({
    name: "Aurel",
    origin: "frontier",
    body: "Atletico",
    bodyShape: "Trapezio",
    face: "Oval",
    eyeShape: "Amendoados",
    eyeColor: "Azul safira",
    hair: "Ondulado 2B",
    hairColor: "Castanho medio",
    beard: "Barba curta",
    palette: "iron_gold",
    weapon: "spear"
  });
  assert.equal(character.ok, true);
  assert.equal(game.state.mode, "title");
  assert.equal(game.state.playerCharacter.name, "Aurel");
  assert.equal(game.state.playerCharacter.eyeColor, "Azul safira");
  assert.equal(game.state.heroes.find((hero) => hero.id === "william").weapon, "spear");
});

test("shop economy buys, equips and blocks equipped sales", () => {
  const game = new AesDivinusGame({ rng: new Rng(11), database: new MemoryGameDatabase() });
  const before = game.state.economy.balance;
  const bought = game.buyItem("aes_compass");
  assert.equal(bought.ok, true);
  assert.equal(game.state.economy.balance, before - 64);
  assert.ok(game.state.inventory.owned.includes("aes_compass"));

  const equipped = game.equipItem("william", "aes_compass");
  assert.equal(equipped.ok, true);
  assert.equal(game.state.inventory.equipped.william.tool, "aes_compass");
  assert.equal(game.sellItem("aes_compass").ok, false);
});

test("mission scenes advance into combat", () => {
  const game = new AesDivinusGame({ rng: new Rng(9), database: new MemoryGameDatabase() });
  game.startStoryScene("gate_at_dusk");
  assert.equal(game.state.mode, "mission_scene");
  game.advanceScene();
  game.advanceScene();
  assert.equal(game.state.mode, "combat");
  assert.ok(game.state.battle);
});

test("campaign includes prologue plus the requested 38 mission structure", () => {
  assert.equal(MISSIONS.length, 47);
  assert.deepEqual(
    MISSIONS.map((mission) => mission.order),
    Array.from({ length: 47 }, (_, index) => index + 1)
  );
  assert.equal(MISSIONS[0].title, "Cena P0 - Abertura");
  assert.equal(MISSIONS[8].title, "Cena P8 - O Hubris");
  assert.equal(MISSIONS[9].title, "Conselho de Pedra");
  assert.equal(MISSIONS[46].title, "Ultima Ordem");
  assert.ok(MISSIONS.every((mission) => mission.objective && mission.impact && mission.type));
});

test("prologue entries progress into the original act one campaign", () => {
  const game = new AesDivinusGame({ rng: new Rng(10), database: new MemoryGameDatabase() });
  assert.equal(game.state.selectedMissionId, "prologue_opening");
  game.startStoryScene("prologue_opening");
  game.advanceScene();
  game.advanceScene();
  assert.equal(game.state.selectedMissionId, "old_road");
});
