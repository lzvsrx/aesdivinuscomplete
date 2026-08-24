import {
  ARMORS,
  CHARACTER_OPTIONS,
  CODEX,
  ENEMY_SETS,
  EQUIPMENT_DESIGNS,
  FEAR_STATES,
  GAME_CURRENCY,
  HEROES,
  INITIAL_PRINCIPALITY,
  ITEM_CATALOG,
  MISSIONS,
  MISSION_SCENES,
  POSITION_TRAITS,
  SCREEN_FLOW,
  SHOP_AREAS,
  WEAPONS
} from "./data.js";
import { IndexedDbGameDatabase, LEGACY_SAVE_KEY } from "./database.js";
import { defaultGithubSyncSettings, normalizeGithubSyncSettings, pushSaveToGithub } from "./githubSync.js";
import { detectHardware, QUALITY_PRESETS } from "./hardware.js";
import { clampNumber, sanitizeEmail, sanitizeText } from "./security.js";

const SAVE_KEY = LEGACY_SAVE_KEY;

function clone(value) {
  return structuredClone(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class Rng {
  constructor(seed = 73129) {
    this.seed = seed >>> 0;
  }

  next() {
    this.seed = (1664525 * this.seed + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

export class AesDivinusGame {
  constructor({ rng = new Rng(), database = null, storage = globalThis.localStorage, fetchApi = globalThis.fetch } = {}) {
    this.rng = rng;
    this.database = database ?? new IndexedDbGameDatabase({ legacyStorage: storage });
    this.fetchApi = fetchApi;
    this.state = this.createNewState();
    this.lastSaveError = null;
    this.lastGithubSync = null;
  }

  createNewState() {
    return {
      mode: "auth",
      selectedMissionId: "prologue_opening",
      activeTab: "mission",
      authMode: "login",
      account: null,
      rememberedProfiles: [],
      session: {
        rememberLogin: true,
        deviceId: this.getDeviceId(),
        lastLoginAt: null
      },
      playerCharacter: null,
      hardware: null,
      graphics: {
        auto: true,
        quality: "medium",
        preset: QUALITY_PRESETS.medium
      },
      audio: {
        enabled: true,
        masterVolume: 0.7,
        currentAmbience: null
      },
      settings: this.defaultSettings(),
      githubSync: defaultGithubSyncSettings(),
      economy: {
        currency: GAME_CURRENCY.id,
        balance: 72,
        transactions: []
      },
      inventory: {
        owned: ["iron_sword", "bow", "spear", "cloth", "light", "medium", "heavy", "field_kit", "survey_tools"],
        equipped: {
          william: { weapon: "iron_sword", armor: "medium", tool: "field_kit" },
          ethan: { weapon: "bow", armor: "light", tool: "survey_tools" },
          albert: { weapon: "spear", armor: "heavy", tool: "field_kit" }
        }
      },
      currentSceneIndex: 0,
      battle: null,
      heroes: clone(HEROES),
      principality: clone(INITIAL_PRINCIPALITY),
      campaign: {
        day: 1,
        flags: {},
        completedMissions: [],
        difficulty: "Aventureiro",
        journal: ["William chega a Floresta de Sangue com poucos aliados e muitas duvidas."]
      },
      codex: clone(CODEX)
    };
  }

  getDeviceId() {
    return `device-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  }

  defaultSettings() {
    return {
      fontScale: 1,
      interfaceScale: 1,
      screenWidth: "auto",
      layoutDensity: "normal",
      contrast: "normal",
      colorBlindMode: "off",
      motion: "auto",
      textSpacing: "normal",
      combatSpeed: 1,
      targetSize: "auto",
      autosave: true,
      confirmDanger: true,
      privacyMode: false
    };
  }

  detectAndApplyHardware(env = globalThis) {
    const detected = detectHardware(env);
    this.state.hardware = detected;
    if (this.state.graphics.auto) {
      this.state.graphics.quality = detected.presetId;
      this.state.graphics.preset = detected.preset;
    }
    this.queueSave("hardware_detect", "Hardware detectado e configuracao aplicada.", {
      score: detected.score,
      presetId: detected.presetId
    });
    return detected;
  }

  setGraphicsQuality(quality, auto = false) {
    const preset = QUALITY_PRESETS[quality] ?? QUALITY_PRESETS.medium;
    this.state.graphics = {
      auto,
      quality: QUALITY_PRESETS[quality] ? quality : "medium",
      preset
    };
    this.queueSave("graphics_quality", `Qualidade grafica definida: ${preset.label}.`, { quality, auto });
  }

  setAudioEnabled(enabled) {
    this.state.audio ??= { enabled: true, masterVolume: 0.7, currentAmbience: null };
    this.state.audio.enabled = Boolean(enabled);
    this.queueSave("audio_enabled", `Audio ${enabled ? "ativado" : "desativado"}.`, { enabled: Boolean(enabled) });
  }

  setAudioVolume(masterVolume) {
    this.state.audio ??= { enabled: true, masterVolume: 0.7, currentAmbience: null };
    const numericVolume = Number(masterVolume);
    this.state.audio.masterVolume = Number.isFinite(numericVolume) ? Math.max(0, Math.min(1, numericVolume)) : 0.7;
    this.queueSave("audio_volume", "Volume principal alterado.", { masterVolume: this.state.audio.masterVolume });
  }

  setUserSetting(key, value) {
    const next = { ...this.defaultSettings(), ...(this.state.settings ?? {}) };
    if (key === "fontScale") next.fontScale = clampNumber(value, 0.85, 1.45, 1);
    else if (key === "interfaceScale") next.interfaceScale = clampNumber(value, 0.9, 1.25, 1);
    else if (key === "screenWidth") next.screenWidth = ["auto", "compact", "comfort", "wide"].includes(value) ? value : "auto";
    else if (key === "layoutDensity") next.layoutDensity = ["compact", "normal", "comfortable"].includes(value) ? value : "normal";
    else if (key === "contrast") next.contrast = ["normal", "high"].includes(value) ? value : "normal";
    else if (key === "colorBlindMode") next.colorBlindMode = ["off", "deuteranopia", "protanopia", "tritanopia"].includes(value) ? value : "off";
    else if (key === "motion") next.motion = ["auto", "reduced", "full"].includes(value) ? value : "auto";
    else if (key === "textSpacing") next.textSpacing = ["normal", "wide"].includes(value) ? value : "normal";
    else if (key === "combatSpeed") next.combatSpeed = clampNumber(value, 0.5, 2, 1);
    else if (key === "targetSize") next.targetSize = ["auto", "large", "extra"].includes(value) ? value : "auto";
    else if (key === "autosave") next.autosave = Boolean(value);
    else if (key === "confirmDanger") next.confirmDanger = Boolean(value);
    else if (key === "privacyMode") next.privacyMode = Boolean(value);
    this.state.settings = next;
    this.queueSave("user_setting", `Configuracao alterada: ${key}.`, { key, value: next[key] });
  }

  resetUserSettings() {
    this.state.settings = this.defaultSettings();
    this.queueSave("settings_reset", "Configuracoes restauradas.", { settings: this.state.settings });
  }

  ensureRuntimeDefaults() {
    this.state.selectedMissionId = MISSIONS.some((mission) => mission.id === this.state.selectedMissionId)
      ? this.state.selectedMissionId
      : "prologue_opening";
    this.state.activeTab ??= "mission";
    this.state.hardware ??= null;
    this.state.graphics ??= {
      auto: true,
      quality: "medium",
      preset: QUALITY_PRESETS.medium
    };
    this.state.graphics.preset = QUALITY_PRESETS[this.state.graphics.quality] ?? QUALITY_PRESETS.medium;
    this.state.audio ??= {
      enabled: true,
      masterVolume: 0.7,
      currentAmbience: null
    };
    this.state.audio.enabled = this.state.audio.enabled !== false;
    const numericVolume = Number(this.state.audio.masterVolume);
    this.state.audio.masterVolume = Number.isFinite(numericVolume) ? Math.max(0, Math.min(1, numericVolume)) : 0.7;
    this.state.settings = { ...this.defaultSettings(), ...(this.state.settings ?? {}) };
    this.state.githubSync = normalizeGithubSyncSettings(this.state.githubSync ?? {});
    this.state.rememberedProfiles = Array.isArray(this.state.rememberedProfiles) ? this.state.rememberedProfiles : [];
    this.state.session = {
      rememberLogin: true,
      deviceId: this.state.session?.deviceId ?? this.getDeviceId(),
      lastLoginAt: this.state.session?.lastLoginAt ?? null,
      ...(this.state.session ?? {})
    };
    this.state.economy ??= {
      currency: GAME_CURRENCY.id,
      balance: 72,
      transactions: []
    };
    this.state.inventory ??= {
      owned: ["iron_sword", "cloth", "field_kit"],
      equipped: {
        william: { weapon: "iron_sword", armor: "medium", tool: "field_kit" },
        ethan: { weapon: "bow", armor: "light", tool: "survey_tools" },
        albert: { weapon: "spear", armor: "heavy", tool: "field_kit" }
      }
    };
    this.state.inventory.equipped ??= {};
    const equippedIds = Object.values(this.state.inventory.equipped).flatMap((slots) => Object.values(slots ?? {}));
    this.state.inventory.owned = [...new Set([...(this.state.inventory.owned ?? []), ...equippedIds])];
    if (this.state.account && this.state.mode === "auth") this.state.mode = this.state.playerCharacter ? "title" : "character_create";
  }

  rememberAccount(account) {
    if (!this.state.session?.rememberLogin || !account || account.guest) return;
    const remembered = {
      id: account.id,
      name: account.name,
      email: account.email,
      lastLoginAt: new Date().toISOString(),
      deviceId: this.state.session.deviceId
    };
    this.state.rememberedProfiles = [remembered, ...(this.state.rememberedProfiles ?? []).filter((item) => item.email !== account.email)].slice(0, 5);
    this.state.session.lastLoginAt = remembered.lastLoginAt;
  }

  enterAsGuest() {
    this.state.account = {
      id: "guest",
      name: "Jogador",
      email: "convidado@local",
      createdAt: new Date().toISOString(),
      guest: true
    };
    this.state.mode = this.state.playerCharacter ? "title" : "character_create";
    this.queueSave("guest_login", "Entrada como convidado.", { accountId: "guest" });
  }

  registerAccount({ name, email, password, remember }) {
    const cleanName = sanitizeText(name, 80);
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = String(password ?? "");
    if (cleanName.length < 2) return { ok: false, reason: "Informe um nome com pelo menos 2 caracteres." };
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) return { ok: false, reason: "Informe um email valido." };
    if (cleanPassword.length < 6) return { ok: false, reason: "A senha precisa ter pelo menos 6 caracteres." };
    this.state.account = {
      id: `local-${cleanEmail}`,
      name: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      guest: false
    };
    this.state.session.rememberLogin = remember !== "off" && remember !== false;
    this.rememberAccount(this.state.account);
    this.state.mode = this.state.playerCharacter ? "title" : "character_create";
    this.queueSave("account_register", "Conta local cadastrada.", { email: cleanEmail });
    return { ok: true };
  }

  loginAccount({ email, name, remember }) {
    const cleanEmail = sanitizeEmail(email);
    if (this.state.account?.email === cleanEmail || cleanEmail.includes("@")) {
      this.state.account = {
        id: `local-${cleanEmail}`,
        name: this.state.account?.name ?? sanitizeText(name, 80) ?? "Jogador",
        email: cleanEmail,
        createdAt: this.state.account?.createdAt ?? new Date().toISOString(),
        guest: false
      };
      this.state.session.rememberLogin = remember !== "off" && remember !== false;
      this.rememberAccount(this.state.account);
      this.state.mode = this.state.playerCharacter ? "title" : "character_create";
      this.queueSave("account_login", "Conta local acessada.", { email: cleanEmail });
      return { ok: true };
    }
    return { ok: false, reason: "Digite um email valido para entrar." };
  }

  createCharacter(options) {
    const name = sanitizeText(options.name, 80);
    if (name.length < 2) return { ok: false, reason: "Escolha um nome para o personagem." };
    const origin = CHARACTER_OPTIONS.origins.find((item) => item.id === options.origin) ?? CHARACTER_OPTIONS.origins[0];
    this.state.playerCharacter = {
      id: "player_avatar",
      name,
      pronoun: sanitizeText(options.pronoun ?? "Livre", 40),
      origin: origin.id,
      originLabel: origin.label,
      body: sanitizeText(options.body ?? CHARACTER_OPTIONS.bodies[2], 40),
      face: sanitizeText(options.face ?? CHARACTER_OPTIONS.faces[0], 40),
      bodyShape: sanitizeText(options.bodyShape ?? CHARACTER_OPTIONS.bodyShapes[0], 40),
      eyeShape: sanitizeText(options.eyeShape ?? CHARACTER_OPTIONS.eyeShapes[0], 60),
      eyeColor: sanitizeText(options.eyeColor ?? CHARACTER_OPTIONS.eyeColors[0], 60),
      hair: sanitizeText(options.hair ?? CHARACTER_OPTIONS.hair[0], 40),
      hairColor: sanitizeText(options.hairColor ?? CHARACTER_OPTIONS.hairColors[0], 60),
      beard: sanitizeText(options.beard ?? CHARACTER_OPTIONS.beards[0], 40),
      palette: options.palette ?? CHARACTER_OPTIONS.palettes[0].id,
      weapon: options.weapon ?? "iron_sword",
      createdAt: new Date().toISOString()
    };
    const william = this.state.heroes.find((hero) => hero.id === "william");
    if (william) {
      william.name = name;
      if (origin.id === "frontier") william.courage = Math.min(100, william.courage + 5);
      if (origin.id === "abakorum") william.loyalty = Math.min(100, william.loyalty + 5);
      if (origin.id === "monastery") william.perception += 2;
      william.weapon = this.state.playerCharacter.weapon;
      this.state.inventory.equipped.william = {
        ...(this.state.inventory.equipped.william ?? {}),
        weapon: this.state.playerCharacter.weapon,
        armor: william.armor,
        tool: this.state.inventory.equipped.william?.tool ?? "field_kit"
      };
    }
    this.state.mode = "title";
    this.queueSave("character_create", "Personagem criado.", { character: this.state.playerCharacter });
    return { ok: true };
  }

  goToMode(mode) {
    if (["mission", "principality", "characters", "inventory", "settings", "flow", "codex"].includes(mode)) {
      this.state.activeTab = mode;
      this.state.mode = "briefing";
    } else {
      this.state.mode = mode;
    }
    this.queueSave("screen_change", `Tela aberta: ${mode}.`, { mode });
  }

  startStoryScene(missionId = this.state.selectedMissionId) {
    this.state.selectedMissionId = missionId;
    this.state.currentSceneIndex = 0;
    this.state.mode = "mission_scene";
    this.queueSave("scene_start", "Cena de missao iniciada.", { missionId });
  }

  currentScene() {
    const scenes = MISSION_SCENES[this.state.selectedMissionId] ?? [];
    return scenes[this.state.currentSceneIndex] ?? scenes[0] ?? null;
  }

  advanceScene() {
    const scenes = MISSION_SCENES[this.state.selectedMissionId] ?? [];
    if (this.state.currentSceneIndex < scenes.length - 1) {
      this.state.currentSceneIndex += 1;
      this.queueSave("scene_advance", "Cena avancada.", { index: this.state.currentSceneIndex });
      return;
    }
    const mission = this.selectedMission;
    if (mission.managementOnly) this.resolveManagementMission(mission);
    else this.startSelectedMission();
  }

  async reset() {
    this.state = this.createNewState();
    return this.persist("reset", "Novo jogo criado.");
  }

  async save() {
    return this.persist("manual_save", "Progresso salvo manualmente.");
  }

  async load() {
    if (!this.database) return false;
    const loaded = await this.database.load();
    if (!loaded) return false;
    this.state = loaded;
    this.ensureRuntimeDefaults();
    return true;
  }

  async persist(type = "autosave", message = "Estado salvo.", payload = {}) {
    if (!this.database) return false;
    try {
      if (type === "reset" && typeof this.database.reset === "function") {
        await this.database.reset(this.state);
      } else {
        await this.database.save(this.state, { type, message, payload });
      }
      if (this.state.githubSync?.enabled) {
        const sync = await pushSaveToGithub(this.publicSyncState(), this.state.githubSync, { fetchApi: this.fetchApi });
        this.lastGithubSync = sync;
        this.state.githubSync.lastSyncAt = sync.ok ? new Date().toISOString() : this.state.githubSync.lastSyncAt;
        this.state.githubSync.lastError = sync.ok ? null : sync.reason;
      }
      this.lastSaveError = null;
      return true;
    } catch (error) {
      this.lastSaveError = error;
      console.error("Falha ao salvar o jogo:", error);
      return false;
    }
  }

  publicSyncState() {
    const snapshot = clone(this.state);
    if (snapshot.githubSync) snapshot.githubSync.token = "";
    return snapshot;
  }

  configureGithubSync(config = {}) {
    this.state.githubSync = normalizeGithubSyncSettings({ ...(this.state.githubSync ?? {}), ...config });
    this.queueSave("github_sync_settings", "Configuracao de sincronizacao GitHub atualizada.", {
      enabled: this.state.githubSync.enabled,
      owner: this.state.githubSync.owner,
      repo: this.state.githubSync.repo,
      path: this.state.githubSync.path
    });
    return { ok: true };
  }

  itemDefinition(itemId) {
    const item = ITEM_CATALOG[itemId];
    if (!item) return null;
    const base = item.type === "weapon" ? WEAPONS[itemId] : item.type === "armor" ? ARMORS[itemId] : null;
    return { ...item, name: base?.name ?? item.name ?? item.id, stats: base };
  }

  buyItem(itemId) {
    const item = this.itemDefinition(itemId);
    if (!item) return { ok: false, reason: "Item inexistente." };
    if (this.state.inventory.owned.includes(itemId)) return { ok: false, reason: "Item ja comprado." };
    if (this.state.economy.balance < item.price) return { ok: false, reason: "Coroas insuficientes." };
    this.state.economy.balance -= item.price;
    this.state.inventory.owned.push(itemId);
    this.recordTransaction("buy", itemId, -item.price);
    this.queueSave("shop_buy", `Compra realizada: ${item.name}.`, { itemId, price: item.price });
    return { ok: true };
  }

  sellItem(itemId) {
    const item = this.itemDefinition(itemId);
    if (!item) return { ok: false, reason: "Item inexistente." };
    if (!this.state.inventory.owned.includes(itemId)) return { ok: false, reason: "Item nao pertence ao jogador." };
    const equipped = Object.values(this.state.inventory.equipped ?? {}).some((slots) => Object.values(slots ?? {}).includes(itemId));
    if (equipped) return { ok: false, reason: "Nao venda item equipado." };
    this.state.inventory.owned = this.state.inventory.owned.filter((id) => id !== itemId);
    this.state.economy.balance += item.sellPrice;
    this.recordTransaction("sell", itemId, item.sellPrice);
    this.queueSave("shop_sell", `Venda realizada: ${item.name}.`, { itemId, value: item.sellPrice });
    return { ok: true };
  }

  equipItem(heroId, itemId) {
    const hero = this.state.heroes.find((candidate) => candidate.id === heroId);
    const item = this.itemDefinition(itemId);
    if (!hero || !item) return { ok: false, reason: "Equipamento invalido." };
    if (!this.state.inventory.owned.includes(itemId)) return { ok: false, reason: "Compre o item antes de equipar." };
    const slot = item.equipSlot;
    this.state.inventory.equipped[heroId] ??= {};
    this.state.inventory.equipped[heroId][slot] = itemId;
    if (slot === "weapon") hero.weapon = itemId;
    if (slot === "armor") hero.armor = itemId;
    this.queueSave("item_equip", `${hero.name} equipou ${item.name}.`, { heroId, itemId, slot });
    return { ok: true };
  }

  recordTransaction(type, itemId, amount) {
    this.state.economy.transactions.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      itemId,
      amount,
      createdAt: new Date().toISOString()
    });
    this.state.economy.transactions = this.state.economy.transactions.slice(0, 30);
  }

  queueSave(type, message, payload = {}) {
    void this.persist(type, message, payload);
  }

  get selectedMission() {
    return MISSIONS.find((mission) => mission.id === this.state.selectedMissionId) ?? MISSIONS[0];
  }

  startSelectedMission() {
    const mission = this.selectedMission;
    if (mission.managementOnly) {
      this.resolveManagementMission(mission);
      return;
    }

    const allies = this.state.heroes.map((hero) => ({
      ...clone(hero),
      hp: Math.max(1, hero.hp),
      ap: 2,
      guard: false,
      fear: hero.fear ?? "steady",
      statuses: []
    }));

    const enemies = clone(ENEMY_SETS[mission.enemySet]).map((enemy) => ({
      ...enemy,
      ap: 2,
      guard: false,
      fear: "steady",
      statuses: []
    }));

    this.state.battle = {
      missionId: mission.id,
      round: 1,
      clockMinutes: 15,
      activeId: null,
      queue: [],
      log: [],
      outcome: null,
      inspiredThisMission: false,
      reinforcementsCalled: false,
      selectedUnitId: allies[0]?.id,
      selectedTargetId: enemies[0]?.id,
      units: [...allies, ...enemies]
    };

    this.state.mode = "combat";
    this.log(`Missao iniciada: ${mission.title}.`);
    this.applyRoundEvent();
    this.rebuildInitiative();
    this.beginNextTurn();
    this.queueSave("mission_start", `Missao iniciada: ${mission.title}.`, { missionId: mission.id });
  }

  resolveManagementMission(mission) {
    this.applyRewards(mission.rewards);
    this.state.campaign.day += 1;
    if (!this.state.campaign.completedMissions.includes(mission.id)) this.state.campaign.completedMissions.push(mission.id);
    this.state.campaign.journal.push(`${mission.title}: a prioridade do principado estabilizou recursos e reputacao.`);
    this.selectNextMission(mission.id);
    this.state.mode = "briefing";
    this.queueSave("management_mission", `${mission.title} resolvida.`, { missionId: mission.id });
  }

  selectNextMission(currentMissionId = this.state.selectedMissionId) {
    const currentIndex = MISSIONS.findIndex((mission) => mission.id === currentMissionId);
    const next = MISSIONS[currentIndex + 1];
    if (next) this.state.selectedMissionId = next.id;
    return next ?? null;
  }

  units(side = null) {
    const list = this.state.battle?.units ?? [];
    return side ? list.filter((unit) => unit.side === side) : list;
  }

  living(side = null) {
    return this.units(side).filter((unit) => unit.hp > 0);
  }

  unit(id) {
    return this.units().find((unit) => unit.id === id);
  }

  activeUnit() {
    return this.unit(this.state.battle?.activeId);
  }

  equipment(unit) {
    return {
      weapon: WEAPONS[unit.weapon],
      armor: ARMORS[unit.armor]
    };
  }

  fearProfile(unit) {
    return FEAR_STATES[unit.fear ?? "steady"] ?? FEAR_STATES.steady;
  }

  courageModifier(unit) {
    if (unit.courage >= 80) return 3;
    if (unit.courage >= 65) return 2;
    if (unit.courage >= 50) return 0;
    if (unit.courage >= 35) return -2;
    return -4;
  }

  initiative(unit) {
    const { armor } = this.equipment(unit);
    const strengthPenalty = unit.strength < armor.strengthReq ? -2 : 0;
    return unit.agility + this.courageModifier(unit) + armor.initiative + this.fearProfile(unit).initiative + strengthPenalty + (unit.inspired ? 2 : 0);
  }

  rebuildInitiative() {
    const battle = this.state.battle;
    battle.queue = this.living()
      .filter((unit) => this.fearProfile(unit).skipChance < 1)
      .map((unit) => ({ id: unit.id, initiative: this.initiative(unit), agility: unit.agility }))
      .sort((a, b) => b.initiative - a.initiative || b.agility - a.agility || a.id.localeCompare(b.id))
      .map((entry) => entry.id);
  }

  beginNextTurn() {
    const battle = this.state.battle;
    if (!battle || battle.outcome) return;
    this.checkOutcome();
    if (battle.outcome) return;

    if (battle.queue.length === 0) {
      this.endRound();
      if (battle.outcome) return;
    }

    const nextId = battle.queue.shift();
    const unit = this.unit(nextId);
    if (!unit || unit.hp <= 0) return this.beginNextTurn();

    battle.activeId = unit.id;
    battle.selectedUnitId = unit.id;
    unit.ap = 2;
    unit.guard = false;
    this.tickStatuses(unit);

    if (unit.hp <= 0) {
      this.log(`${unit.name} sucumbe aos ferimentos.`);
      return this.beginNextTurn();
    }

    const fear = this.fearProfile(unit);
    if (fear.skipChance > 0 && this.rng.next() < fear.skipChance) {
      this.log(`${unit.name} hesita em estado ${fear.label} e perde a acao.`);
      unit.ap = 0;
      return this.endTurn();
    }

    if (unit.side === "enemy") {
      this.enemyAct(unit);
    }
  }

  endRound() {
    const battle = this.state.battle;
    battle.round += 1;
    battle.clockMinutes += 15;
    this.applyRoundEvent();
    this.rebuildInitiative();
    this.checkOutcome();
  }

  applyRoundEvent() {
    const mission = this.selectedMission;
    const battle = this.state.battle;
    const event = mission.eventRounds?.[battle.round];
    if (event) this.log(event);

    if (battle.round === 3) {
      this.living("ally").forEach((ally) => this.testFear(ally, 16, "o uivo distante"));
    }

    if (battle.round === 4 && !battle.reinforcementsCalled) {
      battle.reinforcementsCalled = true;
      battle.units.push({
        ...clone(ENEMY_SETS.forest_first_contact[0]),
        id: "barbarian_reinforcement",
        name: "Reforco barbaro",
        hp: 21,
        maxHp: 21,
        ap: 2,
        guard: false,
        fear: "steady",
        statuses: [],
        position: 5
      });
      this.log("Um reforco entra pela borda da arena.");
    }

    if (battle.round > mission.clockLimit) {
      battle.outcome = "defeat";
      this.finishBattle(false, "O relogio da missao estourou.");
    }
  }

  tickStatuses(unit) {
    unit.statuses = (unit.statuses ?? []).flatMap((status) => {
      if (status.type === "burn") {
        unit.hp = Math.max(0, unit.hp - status.power);
        this.log(`${unit.name} sofre ${status.power} de queimadura.`);
      }
      const next = { ...status, turns: status.turns - 1 };
      return next.turns > 0 ? [next] : [];
    });
    if (unit.inspiredTurns) {
      unit.inspiredTurns -= 1;
      if (unit.inspiredTurns <= 0) unit.inspired = false;
    }
  }

  canAct(unit, cost = 1) {
    return Boolean(this.state.battle && !this.state.battle.outcome && unit && unit.hp > 0 && unit.ap >= cost && this.state.battle.activeId === unit.id);
  }

  distance(attacker, target) {
    const laneDistance = Math.abs(attacker.position - target.position);
    const sideGap = attacker.side === target.side ? 0 : 1;
    return laneDistance + sideGap;
  }

  hitChance(attacker, target, weapon = WEAPONS[attacker.weapon]) {
    const targetArmor = ARMORS[target.armor];
    const targetPos = POSITION_TRAITS[target.position] ?? POSITION_TRAITS[0];
    const attackerPos = POSITION_TRAITS[attacker.position] ?? POSITION_TRAITS[0];
    const fear = this.fearProfile(attacker);
    const rangePenalty = Math.max(0, this.distance(attacker, target) - weapon.range) * 12;
    const coverPenalty = weapon.range > 1 ? targetPos.cover * 8 : 0;
    const heightBonus = attackerPos.height > targetPos.height ? 6 : 0;
    const flankBonus = attacker.position === target.position && targetPos.lane === "back" ? 8 : 0;
    const base = 68 + attacker.agility * 2 + weapon.accuracy + fear.accuracy + heightBonus + flankBonus - target.agility - target.defense - targetArmor.defense - coverPenalty - rangePenalty;
    return clamp(base, 8, 95);
  }

  damageRoll(attacker, target, weapon = WEAPONS[attacker.weapon]) {
    const armor = ARMORS[target.armor];
    const mitigation = armor.mitigation[weapon.type] ?? 0;
    const guardMitigation = target.guard ? 3 : 0;
    const raw = this.rng.int(weapon.min, weapon.max) + Math.floor(attacker.strength * weapon.strengthScale) + (attacker.inspired ? 2 : 0);
    return Math.max(1, raw - mitigation - guardMitigation);
  }

  attack(attackerId, targetId) {
    const attacker = this.unit(attackerId);
    const target = this.unit(targetId);
    if (!this.canAct(attacker, 1) || !target || target.hp <= 0 || attacker.side === target.side) {
      return { ok: false, reason: "Acao invalida." };
    }

    const weapon = WEAPONS[attacker.weapon];
    if (this.distance(attacker, target) > weapon.range + 2) {
      return { ok: false, reason: "Alvo fora de alcance." };
    }

    attacker.ap -= 1;
    const chance = this.hitChance(attacker, target, weapon);
    const roll = this.rng.int(1, 100);
    if (roll > chance) {
      this.log(`${attacker.name} erra ${target.name}. (${roll}/${chance}%)`);
      this.checkOutcome();
      this.queueSave("attack", `${attacker.name} errou ${target.name}.`, { attackerId, targetId, hit: false, chance, roll });
      return { ok: true, hit: false, chance, roll };
    }

    const crit = this.rng.next() < (0.06 + (attacker.agility - target.agility) * 0.004);
    let damage = this.damageRoll(attacker, target, weapon);
    if (crit) damage = Math.ceil(damage * 1.5);

    target.hp = Math.max(0, target.hp - damage);
    if (weapon.burn && target.hp > 0) {
      target.statuses.push({ type: "burn", turns: 2, power: weapon.burn });
    }
    if (weapon.courageDamage || weapon.threat) {
      target.courage = clamp(target.courage - (weapon.courageDamage ?? 0), 0, 100);
      this.testFear(target, weapon.threat ?? weapon.courageDamage, weapon.name);
    }
    this.log(`${attacker.name} acerta ${target.name} com ${weapon.name} por ${damage}${crit ? " critico" : ""}.`);

    if (target.hp <= 0) {
      this.log(`${target.name} caiu.`);
      this.living(target.side).forEach((ally) => {
        if (ally.id !== target.id) this.testFear(ally, 12, "queda de aliado");
      });
    }

    this.checkOutcome();
    this.queueSave("attack", `${attacker.name} atacou ${target.name}.`, { attackerId, targetId, hit: true, chance, roll, damage, crit });
    return { ok: true, hit: true, chance, roll, damage, crit };
  }

  move(unitId, direction) {
    const unit = this.unit(unitId);
    if (!this.canAct(unit, 1)) return { ok: false, reason: "Movimento invalido." };
    const next = clamp(unit.position + direction, 0, 5);
    if (next === unit.position) return { ok: false, reason: "Limite da formacao." };
    unit.position = next;
    unit.ap -= 1;
    this.log(`${unit.name} muda para ${POSITION_TRAITS[next].label}.`);
    this.queueSave("move", `${unit.name} mudou de posicao.`, { unitId, position: next });
    return { ok: true };
  }

  guard(unitId) {
    const unit = this.unit(unitId);
    if (!this.canAct(unit, 1)) return { ok: false, reason: "Postura invalida." };
    unit.guard = true;
    unit.ap -= 1;
    this.log(`${unit.name} mantem guarda e melhora a defesa.`);
    this.queueSave("guard", `${unit.name} entrou em guarda.`, { unitId });
    return { ok: true };
  }

  inspire(sourceId, targetId) {
    const source = this.unit(sourceId);
    const target = this.unit(targetId);
    if (!this.canAct(source, 1) || source.side !== "ally" || !target || target.side !== "ally") {
      return { ok: false, reason: "Inspiracao invalida." };
    }
    const power = source.id === "william" ? source.inspiration : Math.ceil(source.inspiration / 2);
    target.courage = clamp(target.courage + 8 + power, 0, 100);
    target.inspired = true;
    target.inspiredTurns = 2;
    source.ap -= 1;
    this.state.battle.inspiredThisMission = true;
    if (["nervous", "afraid", "terrified"].includes(target.fear)) target.fear = "steady";
    this.log(`${source.name} inspira ${target.name}; coragem e iniciativa sobem.`);
    this.queueSave("inspire", `${source.name} inspirou ${target.name}.`, { sourceId, targetId });
    return { ok: true };
  }

  useAesArrow(unitId) {
    const unit = this.unit(unitId);
    if (!this.canAct(unit, 1) || unit.weapon !== "bow") return { ok: false, reason: "Somente arqueiros podem preparar flecha especial." };
    unit.weapon = "fire_bow";
    unit.ap -= 1;
    this.log(`${unit.name} prepara uma flecha de fogo.`);
    this.queueSave("prepare_fire_arrow", `${unit.name} preparou flecha de fogo.`, { unitId });
    return { ok: true };
  }

  testFear(unit, threat, cause) {
    if (!unit || unit.hp <= 0) return "steady";
    const leadership = unit.side === "ally" ? Math.floor((this.unit("william")?.inspiration ?? 0) / 3) : 0;
    const roll = this.rng.int(1, 20) + Math.floor(unit.courage / 10) + leadership;
    const severity = threat - roll;
    let fear = "steady";
    if (severity >= 18) fear = "paralyzed";
    else if (severity >= 13) fear = "terrified";
    else if (severity >= 8) fear = "afraid";
    else if (severity >= 4) fear = "nervous";
    if (fear !== "steady") {
      unit.fear = fear;
      this.log(`${unit.name} fica ${FEAR_STATES[fear].label} por ${cause}.`);
      this.queueSave("fear", `${unit.name} sofreu medo: ${FEAR_STATES[fear].label}.`, { unitId: unit.id, fear, cause, threat });
    }
    return fear;
  }

  endTurn() {
    const unit = this.activeUnit();
    if (unit) {
      unit.ap = 0;
      if (unit.weapon === "fire_bow") unit.weapon = "bow";
    }
    this.queueSave("end_turn", `${unit?.name ?? "Unidade"} encerrou o turno.`, { unitId: unit?.id ?? null });
    this.beginNextTurn();
  }

  enemyAct(enemy) {
    const allies = this.living("ally");
    if (allies.length === 0) return this.checkOutcome();
    let target = allies
      .map((ally) => ({ ally, score: (ally.hp / ally.maxHp) * 30 + (ally.id === "william" ? -8 : 0) + this.distance(enemy, ally) * 4 }))
      .sort((a, b) => a.score - b.score)[0].ally;

    if (enemy.ai === "terror" && enemy.ap > 0 && this.rng.next() < 0.45) {
      enemy.weapon = "dread";
      target = allies.sort((a, b) => a.courage - b.courage)[0];
      this.attack(enemy.id, target.id);
      enemy.weapon = "claws";
    }

    while (enemy.ap > 0 && !this.state.battle.outcome) {
      const weapon = WEAPONS[enemy.weapon];
      if (this.distance(enemy, target) > weapon.range) {
        this.move(enemy.id, enemy.position > target.position ? -1 : 1);
      } else {
        this.attack(enemy.id, target.id);
      }
      if (target.hp <= 0) target = this.living("ally")[0];
      if (!target) break;
    }
    this.endTurn();
  }

  checkOutcome() {
    const battle = this.state.battle;
    if (!battle || battle.outcome) return;
    const william = this.unit("william");
    if (!william || william.hp <= 0 || this.living("ally").length === 0) {
      battle.outcome = "defeat";
      this.finishBattle(false, "William caiu; a legitimidade do grupo se rompe.");
      return;
    }
    if (this.living("enemy").length === 0) {
      battle.outcome = "victory";
      this.finishBattle(true, "A ameaca imediata foi vencida.");
    }
  }

  finishBattle(victory, reason) {
    const mission = this.selectedMission;
    this.log(reason);
    const allies = this.units("ally");
    this.state.heroes = this.state.heroes.map((hero) => {
      const battleHero = allies.find((unit) => unit.id === hero.id);
      if (!battleHero) return hero;
      return {
        ...hero,
        hp: Math.max(1, battleHero.hp),
        courage: clamp(battleHero.courage + (victory ? 4 : -8), 0, 100),
        loyalty: clamp(hero.loyalty + (victory ? 3 : -5), 0, 100),
        fear: battleHero.fear
      };
    });

    if (victory) {
      this.applyRewards(mission.rewards);
      if (!this.state.campaign.completedMissions.includes(mission.id)) this.state.campaign.completedMissions.push(mission.id);
      this.state.campaign.journal.push(`${mission.title}: vitoria em ${this.state.battle.round} rodadas.`);
      if (this.state.battle.round <= 6) this.state.principality.reputation.infantry += 2;
      if (allies.every((unit) => unit.hp > 0)) this.state.principality.reputation.companions += 2;
      this.selectNextMission(mission.id);
    } else {
      this.state.principality.food = Math.max(0, this.state.principality.food - 6);
      this.state.principality.troops = Math.max(0, this.state.principality.troops - 2);
      this.state.principality.reputation.infantry = Math.max(0, this.state.principality.reputation.infantry - 6);
      this.state.campaign.journal.push(`${mission.title}: derrota. ${reason}`);
    }

    for (const key of Object.keys(this.state.principality.reputation)) {
      this.state.principality.reputation[key] = clamp(this.state.principality.reputation[key], 0, 100);
    }
    this.state.campaign.day += 1;
    this.queueSave(victory ? "battle_victory" : "battle_defeat", reason, { missionId: mission.id, round: this.state.battle?.round ?? null });
  }

  applyRewards(rewards = {}) {
    for (const resource of ["food", "wood", "iron", "gold", "troops", "infrastructure"]) {
      if (resource in rewards) this.state.principality[resource] = Math.max(0, this.state.principality[resource] + rewards[resource]);
    }
    for (const [faction, value] of Object.entries(rewards.reputation ?? {})) {
      this.state.principality.reputation[faction] = clamp((this.state.principality.reputation[faction] ?? 0) + value, 0, 100);
    }
  }

  spendOn(policy) {
    const p = this.state.principality;
    if (policy === "food" && p.gold >= 8) {
      p.gold -= 8;
      p.food += 14;
      p.reputation.peasants = clamp(p.reputation.peasants + 4, 0, 100);
      this.state.campaign.journal.push("Ouro convertido em comida para aliviar os celeiros.");
    }
    if (policy === "defense" && p.wood >= 8 && p.iron >= 5) {
      p.wood -= 8;
      p.iron -= 5;
      p.troops += 3;
      p.reputation.infantry = clamp(p.reputation.infantry + 4, 0, 100);
      this.state.campaign.journal.push("Madeira e ferro reforcaram a defesa local.");
    }
    if (policy === "infrastructure" && p.gold >= 10 && p.wood >= 10) {
      p.gold -= 10;
      p.wood -= 10;
      p.infrastructure += 1;
      p.reputation.nobles = clamp(p.reputation.nobles + 3, 0, 100);
      this.state.campaign.journal.push("Uma obra de infraestrutura aumenta a confianca politica.");
    }
    this.queueSave("principality_policy", `Politica aplicada: ${policy}.`, { policy });
  }

  log(message) {
    const battle = this.state.battle;
    if (!battle) return;
    battle.log.unshift(message);
    battle.log = battle.log.slice(0, 12);
  }
}

export { ARMORS, CHARACTER_OPTIONS, CODEX, EQUIPMENT_DESIGNS, FEAR_STATES, GAME_CURRENCY, ITEM_CATALOG, MISSIONS, MISSION_SCENES, POSITION_TRAITS, QUALITY_PRESETS, SAVE_KEY, SCREEN_FLOW, SHOP_AREAS, WEAPONS };
