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
  const account = game.registerAccount({ name: "LZ", email: "lz@example.com", password: "segredo1" });
  assert.equal(account.ok, true);
  assert.equal(game.state.mode, "character_create");

  const character = game.createCharacter({
    name: "Aurel",
    origin: "frontier",
    body: "Atletico",
    face: "Oval",
    hair: "Preto liso",
    beard: "Barba curta",
    palette: "iron_gold",
    weapon: "spear"
  });
  assert.equal(character.ok, true);
  assert.equal(game.state.mode, "title");
  assert.equal(game.state.playerCharacter.name, "Aurel");
  assert.equal(game.state.heroes.find((hero) => hero.id === "william").weapon, "spear");
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

test("campaign includes the requested 38 mission structure", () => {
  assert.equal(MISSIONS.length, 38);
  assert.deepEqual(
    MISSIONS.map((mission) => mission.order),
    Array.from({ length: 38 }, (_, index) => index + 1)
  );
  assert.equal(MISSIONS[0].title, "Conselho de Pedra");
  assert.equal(MISSIONS[37].title, "Ultima Ordem");
  assert.ok(MISSIONS.every((mission) => mission.objective && mission.impact && mission.type));
});
