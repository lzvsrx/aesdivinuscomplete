import { AesDivinusGame, CHARACTER_OPTIONS, EQUIPMENT_DESIGNS, FEAR_STATES, GAME_CURRENCY, ITEM_CATALOG, MISSIONS, POSITION_TRAITS, QUALITY_PRESETS, SCREEN_FLOW, SHOP_AREAS } from "./game.js";
import { AUDIO_CATALOG, AudioSystem } from "./audio.js";
import { escapeHtml } from "./security.js";

const app = document.querySelector("#app");
const game = new AesDivinusGame();
const audio = new AudioSystem();
let saveStatus = "Banco pronto";
await game.load();
game.detectAndApplyHardware();
audio.configure(game.state.audio);

const tabs = [
  ["mission", "Missao"],
  ["principality", "Principado"],
  ["characters", "Personagens"],
  ["inventory", "Arsenal"],
  ["settings", "Config"],
  ["flow", "Telas"],
  ["codex", "Codex"]
];

function pct(value, max) {
  return `${Math.round((value / max) * 100)}%`;
}

function minutesToClock(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

function active() {
  return game.activeUnit();
}

function selectedTarget() {
  const battle = game.state.battle;
  return game.unit(battle?.selectedTargetId) ?? game.living("enemy")[0] ?? game.living("ally")[0];
}

function selectedAlly() {
  const battle = game.state.battle;
  const selected = game.unit(battle?.selectedUnitId);
  if (selected?.side === "ally") return selected;
  return active()?.side === "ally" ? active() : game.living("ally")[0];
}

function currentMissionForScreen() {
  return MISSIONS.find((item) => item.id === game.state.battle?.missionId) ?? game.selectedMission;
}

function actionButton(label, title, handler, disabled = false) {
  const button = document.createElement("button");
  button.className = "action-button";
  button.type = "button";
  button.textContent = label;
  button.title = title;
  button.disabled = disabled;
  button.addEventListener("click", () => {
    void audio.unlock();
    audio.configure(game.state.audio);
    audio.play("ui_click", { volume: 0.6 });
    const result = handler();
    if (result instanceof Promise) {
      saveStatus = "Salvando...";
      render();
      result
        .then(() => {
          saveStatus = game.lastSaveError ? "Erro ao salvar" : "Banco salvo";
          render();
        })
        .catch(() => {
          saveStatus = "Erro ao salvar";
          render();
        });
      return;
    }
    saveStatus = game.lastSaveError ? "Erro ao salvar" : "Banco salvo";
    render();
  });
  return button;
}

function render() {
  audio.configure(game.state.audio);
  syncAmbience();
  app.innerHTML = "";
  applyUserSettings();
  app.dataset.quality = game.state.graphics.quality;
  app.dataset.touch = game.state.hardware?.info?.touch ? "true" : "false";
  app.append(renderShell());
}

function applyUserSettings() {
  const settings = game.state.settings ?? {};
  app.style.setProperty("--user-font-scale", settings.fontScale ?? 1);
  app.style.setProperty("--user-ui-scale", settings.interfaceScale ?? 1);
  app.dataset.screenWidth = settings.screenWidth ?? "auto";
  app.dataset.density = settings.layoutDensity ?? "normal";
  app.dataset.contrast = settings.contrast ?? "normal";
  app.dataset.colorBlind = settings.colorBlindMode ?? "off";
  app.dataset.motion = settings.motion ?? "auto";
  app.dataset.textSpacing = settings.textSpacing ?? "normal";
  app.dataset.targetSize = settings.targetSize ?? "auto";
  app.dataset.privacy = settings.privacyMode ? "true" : "false";
}

function syncAmbience() {
  if (!game.state.audio?.enabled) {
    audio.stopLoop();
    return;
  }
  const mission = currentMissionForScreen();
  if (game.state.mode === "title") audio.startLoop("title_ambience");
  else if (game.state.mode === "mission_scene") audio.startLoop(mission.act.includes("Floresta") ? "forest_ambience" : "mission_scene");
  else if (game.state.mode === "combat") audio.startLoop(mission.type.includes("Chefe") ? "fear" : "forest_ambience");
  else audio.stopLoop();
}

function renderShell() {
  const root = el("main", "game");
  if (!["auth", "character_create", "title", "mission_scene"].includes(game.state.mode)) root.append(renderTopBar());

  if (game.state.mode === "auth") root.append(renderAuthScreen());
  else if (game.state.mode === "character_create") root.append(renderCharacterCreator());
  else if (game.state.mode === "title") root.append(renderTitleScreen());
  else if (game.state.mode === "mission_scene") root.append(renderMissionScene());
  else if (game.state.mode === "combat") root.append(renderCombat());
  else root.append(renderCamp());

  return root;
}

function renderTopBar() {
  const header = el("header", "topbar");
  const brand = el("div", "brand");
  brand.innerHTML = `<img class="sigil" src="./assets/aes-divinus-icon-192.png" alt="Logo Aes Divinus"><div><strong>Aes Divinus</strong><small>RPG tatico por turnos</small></div>`;
  header.append(brand);

  const studioBrand = el("div", "studio-brand");
  studioBrand.innerHTML = `<img src="./assets/lzasantosworldsgames-logo.png" alt="LZASANTOSWORLDSGAMES">`;
  header.append(studioBrand);

  const nav = el("nav", "tabs");
  tabs.forEach(([id, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = game.state.activeTab === id ? "active" : "";
    button.addEventListener("click", () => {
      void audio.unlock();
      audio.play("menu_open", { volume: 0.55 });
      game.state.activeTab = id;
      game.queueSave("ui_tab", `Aba aberta: ${label}.`, { activeTab: id });
      render();
    });
    nav.append(button);
  });
  header.append(nav);

  const saveTools = el("div", "save-tools");
  const status = el("span", `db-status ${game.lastSaveError ? "error" : ""}`);
  status.textContent = saveStatus;
  saveTools.append(
    status,
    actionButton("Salvar", "Salvar progresso no banco local", () => game.save()),
    actionButton("Carregar", "Carregar progresso do banco local", async () => {
      const loaded = await game.load();
      saveStatus = loaded ? "Banco carregado" : "Sem save";
    }),
    actionButton("Novo", "Reiniciar banco da campanha", () => {
      if (game.state.settings?.confirmDanger && !confirm("Reiniciar campanha e limpar o banco local?")) return false;
      return game.reset();
    })
  );
  header.append(saveTools);
  return header;
}

function renderAuthScreen() {
  const screen = el("section", "screen auth-screen");
  const panel = el("form", "auth-panel");
  panel.innerHTML = `
    <img class="studio-hero-logo" src="./assets/lzasantosworldsgames-logo.png" alt="LZASANTOSWORLDSGAMES">
    <p class="eyebrow">Banco local / campanha persistente</p>
    <h1>Aes Divinus</h1>
    <p>Entre para carregar sua campanha local ou cadastre um perfil minimo para salvar personagem, missoes, escolhas e eventos.</p>
    <label>Nome <input name="name" autocomplete="name" inputmode="text" autocapitalize="words" enterkeyhint="next" placeholder="William" value="${escapeHtml(game.state.account?.name ?? game.state.rememberedProfiles?.[0]?.name ?? "")}"></label>
    <label>Email <input name="email" type="email" autocomplete="email" inputmode="email" autocapitalize="none" enterkeyhint="next" placeholder="voce@email.com" value="${escapeHtml(game.state.account?.email ?? game.state.rememberedProfiles?.[0]?.email ?? "")}"></label>
    <label>Senha <input name="password" type="password" autocomplete="current-password" minlength="6" enterkeyhint="done" placeholder="minimo 6 caracteres"></label>
    <label class="toggle-setting"><input name="remember" type="checkbox" ${game.state.session?.rememberLogin !== false ? "checked" : ""}> Lembrar cadastro e login neste dispositivo</label>
    <div class="legal-consent">
      <label class="toggle-setting"><input name="termsAccepted" type="checkbox" ${game.state.compliance?.termsAccepted ? "checked" : ""}> Aceito os Termos de Uso e as regras das plataformas.</label>
      <label class="toggle-setting"><input name="privacyAccepted" type="checkbox" ${game.state.compliance?.privacyAccepted ? "checked" : ""}> Li a Politica de Privacidade e entendo o autosave local/GitHub.</label>
      <label class="toggle-setting"><input name="ageConfirmed" type="checkbox" ${game.state.compliance?.ageConfirmed ? "checked" : ""}> Tenho idade permitida para o jogo no meu pais.</label>
      <label class="toggle-setting"><input name="parentalConsent" type="checkbox" ${game.state.compliance?.parentalConsent ? "checked" : ""}> Tenho autorizacao de responsavel, se exigida.</label>
    </div>
    <p class="form-error" aria-live="polite"></p>
  `;
  const remembered = game.state.rememberedProfiles ?? [];
  if (remembered.length) {
    const list = el("div", "remembered-list");
    list.innerHTML = `<strong>Perfis lembrados</strong>${remembered.map((profile) => `<button type="button" data-email="${escapeHtml(profile.email)}">${escapeHtml(profile.name)} <span>${escapeHtml(profile.email)}</span></button>`).join("")}`;
    list.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        panel.elements.email.value = button.dataset.email;
        panel.elements.name.value = remembered.find((profile) => profile.email === button.dataset.email)?.name ?? "";
        panel.elements.password.focus();
      });
    });
    panel.append(list);
  }
  const actions = el("div", "auth-actions");
  actions.append(
    actionButton("Entrar", "Entrar com perfil local", () => submitAuth(panel, "login")),
    actionButton("Cadastrar", "Criar perfil local", () => submitAuth(panel, "register")),
    actionButton("Convidado", "Entrar sem cadastro", () => game.enterAsGuest())
  );
  panel.append(actions);
  screen.append(panel, renderFlowRail("auth"));
  return screen;
}

function submitAuth(panel, mode) {
  const form = new FormData(panel);
  const data = Object.fromEntries(form.entries());
  data.remember = panel.elements.remember?.checked ?? true;
  data.termsAccepted = panel.elements.termsAccepted?.checked ?? false;
  data.privacyAccepted = panel.elements.privacyAccepted?.checked ?? false;
  data.ageConfirmed = panel.elements.ageConfirmed?.checked ?? false;
  data.parentalConsent = panel.elements.parentalConsent?.checked ?? false;
  const result = mode === "register" ? game.registerAccount(data) : game.loginAccount(data);
  if (!result.ok) {
    panel.querySelector(".form-error").textContent = result.reason;
    return;
  }
}

function renderCharacterCreator() {
  const screen = el("section", "screen creator-screen");
  const form = el("form", "creator-panel");
  const current = game.state.playerCharacter ?? {};
  form.innerHTML = `
    <p class="eyebrow">Criacao de personagem</p>
    <h1>Forje seu herdeiro</h1>
    <p>O personagem criado assume o papel de William na campanha e altera atributos iniciais conforme origem e equipamento.</p>
    <div class="creator-grid">
      <label>Nome <input name="name" autocomplete="nickname" inputmode="text" autocapitalize="words" enterkeyhint="next" placeholder="William" value="${escapeHtml(current.name ?? "William")}"></label>
      <label>Tratamento <select name="pronoun">${options(["Livre", "Ele", "Ela", "Neutro"], current.pronoun)}</select></label>
      <label>Origem <select name="origin">${CHARACTER_OPTIONS.origins.map((item) => `<option value="${item.id}" ${current.origin === item.id ? "selected" : ""}>${item.label} - ${item.bonus}</option>`).join("")}</select></label>
      <label>Corpo <select name="body">${options(CHARACTER_OPTIONS.bodies, current.body)}</select></label>
      <label>Forma do corpo <select name="bodyShape">${options(CHARACTER_OPTIONS.bodyShapes, current.bodyShape)}</select></label>
      <label>Rosto <select name="face">${options(CHARACTER_OPTIONS.faces, current.face)}</select></label>
      <label>Formato dos olhos <select name="eyeShape">${options(CHARACTER_OPTIONS.eyeShapes, current.eyeShape)}</select></label>
      <label>Cor dos olhos <select name="eyeColor">${options(CHARACTER_OPTIONS.eyeColors, current.eyeColor)}</select></label>
      <label>Cabelo <select name="hair">${options(CHARACTER_OPTIONS.hair, current.hair)}</select></label>
      <label>Cor do cabelo <select name="hairColor">${options(CHARACTER_OPTIONS.hairColors, current.hairColor)}</select></label>
      <label>Barba <select name="beard">${options(CHARACTER_OPTIONS.beards, current.beard)}</select></label>
      <label>Paleta <select name="palette">${CHARACTER_OPTIONS.palettes.map((item) => `<option value="${item.id}" ${current.palette === item.id ? "selected" : ""}>${item.label}</option>`).join("")}</select></label>
      <label>Arma inicial <select name="weapon">
        <option value="iron_sword" ${current.weapon === "iron_sword" ? "selected" : ""}>Espada de ferro</option>
        <option value="spear" ${current.weapon === "spear" ? "selected" : ""}>Lanca de ferro</option>
        <option value="bow" ${current.weapon === "bow" ? "selected" : ""}>Arco</option>
      </select></label>
    </div>
    <p class="form-error" aria-live="polite"></p>
  `;
  const preview = el("aside", "character-preview");
  preview.innerHTML = `
    ${avatarMarkup(current)}
    <h2>Modelo 3D base</h2>
    <p>Especificacao modular: esqueleto humanoide, corpo, rosto, olhos, cabelo, barba, roupa, armadura, arma, ferramenta e pedra vinculada em pecas separadas para troca em runtime.</p>
    <dl>
      <dt>Olhos</dt><dd>${escapeHtml(current.eyeColor ?? "Castanho")}</dd>
      <dt>Cabelo</dt><dd>${escapeHtml(current.hairColor ?? "Preto natural")}</dd>
      <dt>Corpo</dt><dd>${escapeHtml(current.bodyShape ?? "Trapezio")}</dd>
      <dt>Arma</dt><dd>${escapeHtml(weaponLabel(current.weapon ?? "iron_sword"))}</dd>
    </dl>
  `;
  applyAvatarAppearance(preview.querySelector(".avatar-forge"), current);
  form.addEventListener("input", () => updateCharacterPreview(form, preview));
  const actions = el("div", "auth-actions");
  actions.append(actionButton("Criar personagem", "Salvar personagem no banco", () => submitCharacter(form)));
  form.append(actions);
  screen.append(form, preview, renderFlowRail("character_create"));
  return screen;
}

function submitCharacter(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const result = game.createCharacter(data);
  if (!result.ok) form.querySelector(".form-error").textContent = result.reason;
}

function updateCharacterPreview(form, preview) {
  const data = Object.fromEntries(new FormData(form).entries());
  const avatar = preview.querySelector(".avatar-forge");
  applyAvatarAppearance(avatar, data);
  preview.querySelector("dl").innerHTML = `
    <dt>Olhos</dt><dd>${escapeHtml(data.eyeColor ?? "Castanho")}</dd>
    <dt>Cabelo</dt><dd>${escapeHtml(data.hairColor ?? "Preto natural")}</dd>
    <dt>Corpo</dt><dd>${escapeHtml(data.bodyShape ?? "Trapezio")}</dd>
    <dt>Arma</dt><dd>${escapeHtml(weaponLabel(data.weapon ?? "iron_sword"))}</dd>
  `;
}

function avatarMarkup(current = {}) {
  return `
    <div class="avatar-forge"
      data-body="${escapeHtml(current.body ?? "Atletico")}"
      data-shape="${escapeHtml(current.bodyShape ?? "Trapezio")}"
      data-face="${escapeHtml(current.face ?? "Oval")}"
      data-eye-shape="${escapeHtml(current.eyeShape ?? "Amendoados")}"
      data-hair="${escapeHtml(current.hair ?? "Ondulado 2B")}"
      data-beard="${escapeHtml(current.beard ?? "Barba curta")}"
      data-weapon="${escapeHtml(current.weapon ?? "iron_sword")}">
      <div class="avatar-rim"></div>
      <div class="avatar-cape"></div>
      <div class="avatar-legs"><span></span><span></span></div>
      <div class="avatar-boots"><span></span><span></span></div>
      <div class="avatar-body"></div>
      <div class="avatar-armor">
        <span class="armor-core"></span>
        <span class="armor-belt"></span>
        <span class="armor-stone"></span>
      </div>
      <div class="avatar-arm avatar-arm-left"></div>
      <div class="avatar-arm avatar-arm-right"></div>
      <div class="avatar-weapon"><span></span></div>
      <div class="avatar-neck"></div>
      <div class="avatar-head">
        <span class="avatar-ear left"></span>
        <span class="avatar-ear right"></span>
        <span class="avatar-hair"></span>
        <span class="avatar-eye left"></span>
        <span class="avatar-eye right"></span>
        <span class="avatar-nose"></span>
        <span class="avatar-mouth"></span>
        <span class="avatar-beard"></span>
      </div>
      <div class="avatar-nameplate">${escapeHtml(current.name ?? "William")}</div>
      <em class="avatar-shadow"></em>
    </div>
  `;
}

function applyAvatarAppearance(avatar, data = {}) {
  if (!avatar) return;
  const palette = CHARACTER_OPTIONS.palettes.find((item) => item.id === data.palette) ?? CHARACTER_OPTIONS.palettes[0];
  avatar.dataset.body = data.body ?? "Atletico";
  avatar.dataset.shape = data.bodyShape ?? "Trapezio";
  avatar.dataset.face = data.face ?? "Oval";
  avatar.dataset.eyeShape = data.eyeShape ?? "Amendoados";
  avatar.dataset.hair = data.hair ?? "Ondulado 2B";
  avatar.dataset.beard = data.beard ?? "Barba curta";
  avatar.dataset.weapon = data.weapon ?? "iron_sword";
  avatar.style.setProperty("--avatar-primary", palette.primary);
  avatar.style.setProperty("--avatar-secondary", palette.secondary);
  avatar.style.setProperty("--avatar-eye", colorForEye(data.eyeColor));
  avatar.style.setProperty("--avatar-hair", colorForHair(data.hairColor));
  avatar.querySelector(".avatar-nameplate").textContent = data.name || "William";
}

function colorForEye(value = "Castanho") {
  const key = value.toLowerCase();
  if (key.includes("violeta") || key.includes("ametista")) return "#8e65c9";
  if (key.includes("azul") || key.includes("safira")) return "#5da4d9";
  if (key.includes("verde")) return "#6fa35f";
  if (key.includes("cinza")) return "#a8b0ad";
  if (key.includes("ambar") || key.includes("a vela") || key.includes("avela")) return "#b47a2c";
  if (key.includes("onix") || key.includes("preto")) return "#171717";
  return "#6f431d";
}

function colorForHair(value = "Preto natural") {
  const key = value.toLowerCase();
  if (key.includes("violeta")) return "#7a4bb2";
  if (key.includes("vermelho") || key.includes("acaju")) return "#8e302d";
  if (key.includes("cobre")) return "#b85f25";
  if (key.includes("loiro clarissimo") || key.includes("muito claro")) return "#f1dd91";
  if (key.includes("loiro")) return "#c9a64a";
  if (key.includes("acinzentado")) return "#8c908c";
  if (key.includes("castanho claro")) return "#8a5b2e";
  if (key.includes("castanho") || key.includes("marrom")) return "#4f2e19";
  return "#151515";
}

function weaponLabel(weapon) {
  return {
    iron_sword: "Espada de ferro",
    spear: "Lanca de ferro",
    bow: "Arco"
  }[weapon] ?? "Espada de ferro";
}

function renderTitleScreen() {
  const screen = el("section", "screen title-screen");
  const hero = el("div", "title-content");
  hero.innerHTML = `
    <img class="title-logo" src="./assets/aes-divinus-logo.png" alt="Aes Divinus">
    <img class="title-studio" src="./assets/lzasantosworldsgames-logo.png" alt="LZASANTOSWORLDSGAMES">
    <h1>Aes Divinus</h1>
    <p>${escapeHtml(game.state.playerCharacter?.name ?? "William")} carrega a coroa antes de merecer o reino.</p>
  `;
  const menu = el("div", "title-menu");
  menu.append(
    actionButton("Continuar", "Ir para a mesa de missoes", () => game.goToMode("briefing")),
    actionButton("Iniciar campanha", "Comecar o prologo na Floresta de Sangue", () => {
      audio.playForMission(MISSIONS[0]);
      game.startStoryScene("prologue_opening");
    }),
    actionButton("Arsenal", "Ver armas e ferramentas", () => game.goToMode("inventory")),
    actionButton("Personagem", "Editar/criar personagem", () => game.goToMode("character_create")),
    actionButton("Salvar", "Salvar banco local", () => game.save())
  );
  screen.append(hero, menu, renderFlowRail("title"));
  return screen;
}

function renderMissionScene() {
  const scene = game.currentScene();
  const screen = el("section", "screen cinematic-screen");
  const frame = el("article", "cinematic-frame");
  frame.innerHTML = `
    <p class="eyebrow">${game.selectedMission.act} / cena ${game.state.currentSceneIndex + 1}</p>
    <h1>${scene?.title ?? game.selectedMission.title}</h1>
    <p>${escapeHtml(scene?.text ?? game.selectedMission.objective)}</p>
    <dl>
      <dt>Camera</dt><dd>${escapeHtml(scene?.camera ?? "Plano tatico.")}</dd>
      <dt>Escolha</dt><dd>${escapeHtml(scene?.choice ?? "Avancar")}</dd>
      <dt>Efeito</dt><dd>${escapeHtml(scene?.effect ?? "A missao continua.")}</dd>
    </dl>
  `;
  frame.append(actionButton("Avancar", "Ir para a proxima cena ou iniciar missao", () => {
    audio.playForMission(game.selectedMission);
    game.advanceScene();
  }));
  screen.append(frame, renderFlowRail("mission_scene"));
  return screen;
}

function renderCamp() {
  const wrap = el("section", "camp-layout");
  if (game.state.activeTab === "mission") wrap.append(renderMissionPanel());
  if (game.state.activeTab === "principality") wrap.append(renderPrincipality());
  if (game.state.activeTab === "characters") wrap.append(renderCharacters());
  if (game.state.activeTab === "inventory") wrap.append(renderInventory());
  if (game.state.activeTab === "settings") wrap.append(renderHardwareSettings());
  if (game.state.activeTab === "flow") wrap.append(renderScreensCatalog());
  if (game.state.activeTab === "codex") wrap.append(renderCodex());
  return wrap;
}

function renderMissionPanel() {
  const panel = el("div", "mission-grid");
  const list = el("aside", "mission-list");
  MISSIONS.forEach((mission) => {
    const item = el("button", `mission-item ${game.state.selectedMissionId === mission.id ? "selected" : ""}`);
    item.type = "button";
    item.innerHTML = `<strong>${mission.order}. ${escapeHtml(mission.title)}</strong><span>${escapeHtml(mission.act)} / ${escapeHtml(mission.type)}</span>`;
    item.addEventListener("click", () => {
      game.state.selectedMissionId = mission.id;
      game.queueSave("mission_select", `Missao selecionada: ${mission.title}.`, { missionId: mission.id });
      render();
    });
    list.append(item);
  });

  const mission = game.selectedMission;
  const detail = el("article", "mission-detail");
  detail.innerHTML = `
    <p class="eyebrow">${escapeHtml(mission.act)}</p>
    <h1>${mission.order}. ${escapeHtml(mission.title)}</h1>
    <p>${escapeHtml(mission.objective)}</p>
    <p class="mission-impact"><strong>Impacto:</strong> ${escapeHtml(mission.impact)}</p>
    <div class="objective-list">${mission.optional.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
  `;
  detail.append(actionButton(mission.managementOnly ? "Abrir cena de conselho" : "Abrir cenas da missao", "Comecar fluxo narrativo da missao", () => {
    audio.playForMission(mission);
    game.startStoryScene(mission.id);
  }));
  detail.append(actionButton("Iniciar direto", "Pular cenas e iniciar sistema principal da missao", () => {
    audio.play(mission.managementOnly ? "mission_scene" : "combat_start", { volume: 0.55 });
    game.startSelectedMission();
  }));
  detail.append(renderJournal());
  panel.append(list, detail);
  return panel;
}

function renderCombat() {
  const battle = game.state.battle;
  const wrap = el("section", "combat-layout");
  const mission = currentMissionForScreen();
  const activeUnit = active();

  const stage = el("div", "battle-stage");
  stage.append(renderBattleHeader(mission));
  stage.append(renderBattlefield());
  stage.append(renderActionBar(activeUnit));

  const side = el("aside", "combat-side");
  side.append(renderUnitCard(activeUnit, "Turno ativo"));
  side.append(renderUnitCard(selectedTarget(), "Alvo selecionado"));
  side.append(renderInitiative());
  side.append(renderLog());

  if (battle.outcome) {
    const modal = el("div", "result-modal");
    modal.innerHTML = `<strong>${battle.outcome === "victory" ? "Vitoria" : "Derrota"}</strong><span>${escapeHtml(battle.log[0] ?? "")}</span>`;
    modal.append(actionButton("Voltar ao principado", "Encerrar resultado", () => {
      audio.play(game.state.battle.outcome === "victory" ? "victory" : "defeat", { volume: 0.8 });
      game.state.mode = "briefing";
      game.state.battle = null;
      game.save();
    }));
    stage.append(modal);
  }

  wrap.append(stage, side);
  return wrap;
}

function renderBattleHeader(mission) {
  const header = el("div", "battle-header");
  const battle = game.state.battle;
  header.innerHTML = `
    <div><strong>${escapeHtml(mission.title)}</strong><span>${escapeHtml(mission.objective)}</span></div>
    <div class="round-clock"><span>Rodada ${battle.round}</span><span>${minutesToClock(battle.clockMinutes)}</span></div>
  `;
  return header;
}

function renderBattlefield() {
  const field = el("div", "battlefield");
  field.append(renderFormation("ally"), renderCenterScene(), renderFormation("enemy"));
  return field;
}

function renderFormation(side) {
  const formation = el("div", `formation ${side}`);
  for (let i = 0; i < 6; i += 1) {
    const slot = el("button", "slot");
    slot.type = "button";
    slot.dataset.position = i;
    slot.title = POSITION_TRAITS[i].label;
    const unit = game.living(side).find((candidate) => candidate.position === i) ?? game.units(side).find((candidate) => candidate.position === i && candidate.hp <= 0);
    if (unit) {
      slot.classList.add("occupied", unit.side, unit.hp <= 0 ? "down" : "");
      if (game.state.battle.selectedTargetId === unit.id || game.state.battle.selectedUnitId === unit.id) slot.classList.add("selected");
      slot.innerHTML = unitToken(unit);
      slot.addEventListener("click", () => {
        if (unit.side === "enemy") game.state.battle.selectedTargetId = unit.id;
        game.state.battle.selectedUnitId = unit.id;
        game.queueSave("unit_select", `Unidade selecionada: ${unit.name}.`, { unitId: unit.id });
        render();
      });
    } else {
      slot.innerHTML = `<span class="slot-label">${escapeHtml(POSITION_TRAITS[i].label)}</span>`;
    }
    formation.append(slot);
  }
  return formation;
}

function unitToken(unit) {
  const fear = FEAR_STATES[unit.fear ?? "steady"].label;
  return `
    <span class="unit-figure ${unit.side}"></span>
    <strong>${escapeHtml(unit.name)}</strong>
    <small>${escapeHtml(unit.role)}</small>
    <span class="bar"><i style="width:${pct(unit.hp, unit.maxHp)}"></i></span>
    <em>${unit.hp}/${unit.maxHp} HP / ${escapeHtml(fear)}</em>
  `;
}

function renderCenterScene() {
  const scene = el("div", "center-scene");
  scene.innerHTML = `
    <canvas id="arenaCanvas" width="420" height="360" aria-label="Arena tatica"></canvas>
    <div class="terrain-note">Cobertura, altura, gargalos e linha de frente influenciam acerto e defesa.</div>
  `;
  queueMicrotask(drawArena);
  return scene;
}

function drawArena() {
  const canvas = document.querySelector("#arenaCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#20362d");
  grad.addColorStop(0.45, "#596045");
  grad.addColorStop(1, "#281f27");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,.08)";
  for (let i = 0; i < 7; i += 1) {
    ctx.beginPath();
    ctx.ellipse(210, 42 + i * 47, 185 - i * 9, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#1b1718";
  ctx.fillRect(190, 0, 40, h);
  ctx.fillStyle = "#9a5f37";
  ctx.fillRect(196, 0, 8, h);
  ctx.fillRect(218, 0, 7, h);
  ctx.fillStyle = "rgba(238, 196, 111, .7)";
  game.living().forEach((unit) => {
    const sideX = unit.side === "ally" ? 80 : 340;
    const y = 40 + unit.position * 52;
    ctx.beginPath();
    ctx.arc(sideX, y, unit.size === 2 ? 22 : 15, 0, Math.PI * 2);
    ctx.fillStyle = unit.side === "ally" ? "#d8d1b0" : "#c65b4d";
    ctx.fill();
    ctx.strokeStyle = game.state.battle.activeId === unit.id ? "#f3d27a" : "#111";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(unit.name).slice(0, 8), sideX, y + 30);
  });
}

function renderActionBar(unit) {
  const bar = el("div", "action-bar");
  if (!unit) return bar;
  const target = selectedTarget();
  const disabled = unit.side !== "ally" || game.state.battle.outcome;
  bar.innerHTML = `<div><strong>${escapeHtml(unit.name)}</strong><span>${unit.ap ?? 0} PA disponiveis</span></div>`;
  bar.append(
    actionButton("Atacar", "Atacar alvo selecionado", () => performAttack(unit, target), disabled || !target || target.side === unit.side || unit.ap < 1),
    actionButton("Recuar", "Mover para tras", () => game.move(unit.id, 1), disabled || unit.ap < 1),
    actionButton("Avancar", "Mover para frente", () => game.move(unit.id, -1), disabled || unit.ap < 1),
    actionButton("Guarda", "Reduzir dano recebido", () => {
      audio.play("armor_hit", { volume: 0.35 });
      return game.guard(unit.id);
    }, disabled || unit.ap < 1),
    actionButton("Inspirar", "William fortalece coragem e iniciativa", () => {
      audio.play("mission_scene", { volume: 0.4 });
      return game.inspire(unit.id, selectedAlly()?.id);
    }, disabled || unit.ap < 1 || !selectedAlly()),
    actionButton("Fogo", "Preparar flecha de fogo", () => {
      audio.play("fire", { volume: 0.5 });
      return game.useAesArrow(unit.id);
    }, disabled || unit.weapon !== "bow" || unit.ap < 1),
    actionButton("Esperar", "Encerrar turno", () => game.endTurn(), disabled)
  );
  return bar;
}

function performAttack(unit, target) {
  const result = game.attack(unit.id, target?.id);
  audio.playAttack(unit, result);
  if (result?.ok && game.state.battle?.outcome) {
    audio.play(game.state.battle.outcome === "victory" ? "victory" : "defeat", { volume: 0.8 });
  } else if (result?.ok && game.state.battle?.log?.[0]?.includes("medo")) {
    audio.play("fear", { volume: 0.5 });
  }
  return result;
}

function renderUnitCard(unit, title) {
  const card = el("div", "unit-card");
  if (!unit) {
    card.innerHTML = `<h2>${escapeHtml(title)}</h2><p>Nenhuma unidade.</p>`;
    return card;
  }
  const { weapon, armor } = game.equipment(unit);
  card.innerHTML = `
    <h2>${escapeHtml(title)}</h2>
    <div class="unit-title"><strong>${escapeHtml(unit.name)}</strong><span>${escapeHtml(unit.role)}</span></div>
    <span class="bar big"><i style="width:${pct(unit.hp, unit.maxHp)}"></i></span>
    <dl>
      <dt>HP</dt><dd>${unit.hp}/${unit.maxHp}</dd>
      <dt>Forca</dt><dd>${unit.strength}</dd>
      <dt>Agilidade</dt><dd>${unit.agility}</dd>
      <dt>Percepcao</dt><dd>${unit.perception}</dd>
      <dt>Coragem</dt><dd>${unit.courage}</dd>
      <dt>Lealdade</dt><dd>${unit.loyalty ?? "-"}</dd>
      <dt>Estado</dt><dd>${escapeHtml(FEAR_STATES[unit.fear ?? "steady"].label)}</dd>
      <dt>Arma</dt><dd>${escapeHtml(weapon.name)}</dd>
      <dt>Armadura</dt><dd>${escapeHtml(armor.name)}</dd>
      <dt>Iniciativa</dt><dd>${game.initiative(unit)}</dd>
    </dl>
  `;
  return card;
}

function renderInitiative() {
  const box = el("div", "initiative");
  box.innerHTML = `<h2>Iniciativa</h2>`;
  const live = game.living().sort((a, b) => game.initiative(b) - game.initiative(a));
  live.forEach((unit) => {
    const row = el("div", `initiative-row ${game.state.battle.activeId === unit.id ? "active" : ""}`);
    row.innerHTML = `<span>${escapeHtml(unit.name)}</span><strong>${game.initiative(unit)}</strong>`;
    box.append(row);
  });
  return box;
}

function renderLog() {
  const log = el("div", "log");
  log.innerHTML = `<h2>Registro</h2>${(game.state.battle?.log ?? []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}`;
  return log;
}

function renderPrincipality() {
  const p = game.state.principality;
  const panel = el("div", "principality");
  panel.innerHTML = `
    <section class="domain-map">
      <div class="keep"></div>
      <span class="village one"></span>
      <span class="village two"></span>
      <span class="road"></span>
    </section>
    <section class="domain-stats">
      <h1>Principado</h1>
      <div class="resource-grid">
        ${resource("Comida", p.food)}
        ${resource("Madeira", p.wood)}
        ${resource("Ferro", p.iron)}
        ${resource("Ouro", p.gold)}
        ${resource("Tropas", p.troops)}
        ${resource("Infra", p.infrastructure)}
      </div>
      <h2>Reputacao</h2>
      <div class="reputation">${Object.entries(p.reputation).map(([k, v]) => reputation(k, v)).join("")}</div>
    </section>
  `;
  const policies = el("section", "policies");
  policies.append(
    actionButton("Comprar comida", "Gasta ouro e melhora reputacao camponesa", () => game.spendOn("food"), p.gold < 8),
    actionButton("Reforcar defesa", "Gasta madeira e ferro para tropas", () => game.spendOn("defense"), p.wood < 8 || p.iron < 5),
    actionButton("Obras", "Gasta ouro e madeira para infraestrutura", () => game.spendOn("infrastructure"), p.gold < 10 || p.wood < 10)
  );
  panel.append(policies, renderJournal());
  return panel;
}

function resource(label, value) {
  return `<div class="resource"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`;
}

function reputation(label, value) {
  return `<div class="rep"><span>${escapeHtml(label)}</span><i><b style="width:${value}%"></b></i><strong>${value}</strong></div>`;
}

function renderCharacters() {
  const grid = el("div", "character-grid");
  game.state.heroes.forEach((hero) => grid.append(renderUnitCard(hero, hero.name)));
  return grid;
}

function renderCodex() {
  const grid = el("div", "codex-grid");
  game.state.codex.forEach((entry) => {
    const item = el("article", "codex-entry");
    item.innerHTML = `<h2>${escapeHtml(entry.title)}</h2><p>${escapeHtml(entry.text)}</p>`;
    grid.append(item);
  });
  const systems = el("article", "codex-entry wide");
  systems.innerHTML = `
    <h2>Sistemas implementados</h2>
    <p>BattleManager, TurnManager, FormationManager, CombatResolver, FearSystem, EquipmentSystem, MissionTimer, CombatLog, PrincipalitySystem e SaveSystem estao representados nesta versao jogavel.</p>
  `;
  grid.append(systems);
  return grid;
}

function renderInventory() {
  const wrap = el("section", "inventory-screen");
  const intro = el("div", "inventory-intro");
  intro.innerHTML = `<h1>Arsenal, lojas e ${GAME_CURRENCY.shortName}</h1><p>Compra, venda, equipamento e vinculo de cada item com a pedra especifica do sistema Aes.</p><strong class="currency-pill">${game.state.economy.balance} ${GAME_CURRENCY.symbol}</strong>`;
  wrap.append(intro, renderShopMarket(), renderOwnedInventory());

  const grid = el("div", "equipment-grid");
  EQUIPMENT_DESIGNS.forEach((item) => {
    const card = el("article", "equipment-card");
    card.style.setProperty("--accent", item.color);
    card.innerHTML = `
      <div class="equipment-icon ${item.icon}"></div>
      <p class="eyebrow">${escapeHtml(item.kind)}</p>
      <h2>${escapeHtml(item.name)}</h2>
      <strong>${escapeHtml(item.role)}</strong>
      <p>${escapeHtml(item.silhouette)}</p>
      <dl>
        <dt>Material</dt><dd>${escapeHtml(item.material)}</dd>
        <dt>Jogo</dt><dd>${escapeHtml(item.gameplay)}</dd>
      </dl>
    `;
    grid.append(card);
  });
  wrap.append(grid);
  return wrap;
}

function renderShopMarket() {
  const market = el("section", "shop-market");
  SHOP_AREAS.forEach((shop) => {
    const area = el("article", "shop-area");
    area.innerHTML = `<h2>${escapeHtml(shop.name)}</h2><p>${escapeHtml(shop.specialty)}</p>`;
    Object.values(ITEM_CATALOG).filter((item) => item.shop === shop.id).forEach((item) => area.append(renderShopItem(item)));
    market.append(area);
  });
  return market;
}

function renderShopItem(item) {
  const owned = game.state.inventory.owned.includes(item.id);
  const definition = game.itemDefinition(item.id);
  const row = el("div", `shop-item ${owned ? "owned" : ""}`);
  row.innerHTML = `
    <div>
      <strong>${escapeHtml(definition?.name ?? item.id)}</strong>
      <span>${escapeHtml(item.type)} / Pedra: ${escapeHtml(item.stone)}</span>
      <p>${escapeHtml(item.description)}</p>
    </div>
    <div class="shop-price"><b>${item.price} ${GAME_CURRENCY.symbol}</b><small>venda ${item.sellPrice}</small></div>
  `;
  row.append(actionButton(owned ? "Comprado" : "Comprar", "Comprar item com Coroas de Aes", () => game.buyItem(item.id), owned || game.state.economy.balance < item.price));
  return row;
}

function renderOwnedInventory() {
  const owned = el("section", "owned-inventory");
  owned.innerHTML = `<h2>Itens do jogador</h2>`;
  game.state.inventory.owned.forEach((itemId) => {
    const item = game.itemDefinition(itemId);
    if (!item) return;
    const isEquipped = Object.values(game.state.inventory.equipped ?? {}).some((slots) => Object.values(slots ?? {}).includes(item.id));
    const row = el("div", "owned-item");
    row.innerHTML = `<strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.type)} / ${escapeHtml(item.stone)}</span>`;
    const heroSelect = document.createElement("select");
    heroSelect.title = "Personagem";
    game.state.heroes.forEach((hero) => {
      const option = document.createElement("option");
      option.value = hero.id;
      option.textContent = hero.name;
      heroSelect.append(option);
    });
    row.append(
      heroSelect,
      actionButton("Equipar", "Equipar no personagem selecionado", () => game.equipItem(heroSelect.value, item.id)),
      actionButton("Vender", "Vender item nao equipado", () => game.sellItem(item.id), isEquipped)
    );
    owned.append(row);
  });
  return owned;
}

function renderScreensCatalog() {
  const wrap = el("section", "screens-catalog");
  wrap.innerHTML = `<h1>Telas do jogo</h1><p>Fluxo sequencial com templates proprios para manter cada etapa unica sem quebrar a continuidade da campanha.</p>`;
  const grid = el("div", "screen-card-grid");
  SCREEN_FLOW.forEach((screen, index) => {
    const card = el("article", `screen-card ${game.state.mode === screen.id ? "active" : ""}`);
    card.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><h2>${escapeHtml(screen.label)}</h2><strong>${escapeHtml(screen.template)}</strong><p>${escapeHtml(screen.purpose)}</p>`;
    grid.append(card);
  });
  wrap.append(grid);
  return wrap;
}

function renderHardwareSettings() {
  const detected = game.state.hardware;
  const info = detected?.info ?? {};
  const preset = game.state.graphics.preset;
  const audioState = game.state.audio ?? { enabled: true, masterVolume: 0.7 };
  const wrap = el("section", "hardware-screen");
  const summary = el("article", "hardware-summary");
  summary.innerHTML = `
    <p class="eyebrow">Diagnostico do dispositivo</p>
    <h1>${preset.label}</h1>
    <p>O jogo avalia o hardware do dispositivo e ajusta escala, FPS, efeitos, sombras, animacao e alvos touch automaticamente.</p>
    <div class="hardware-score"><strong>${detected?.score ?? 0}</strong><span>pontuacao</span></div>
    <div class="quality-list">${Object.entries(QUALITY_PRESETS).map(([id, item]) => `<button class="quality-chip ${game.state.graphics.quality === id ? "active" : ""}" data-quality="${id}" type="button">${item.label}</button>`).join("")}</div>
  `;
  summary.querySelectorAll(".quality-chip").forEach((button) => {
    button.addEventListener("click", () => {
      game.setGraphicsQuality(button.dataset.quality, false);
      render();
    });
  });
  summary.append(actionButton("Auto detectar", "Reavaliar hardware e aplicar qualidade automatica", () => game.detectAndApplyHardware()));

  const specs = el("article", "hardware-specs");
  specs.innerHTML = `
    <h2>Sistema detectado</h2>
    <dl>
      <dt>Plataforma</dt><dd>${info.platform ?? "-"}</dd>
      <dt>CPU logica</dt><dd>${info.cpuCores ?? "-"}</dd>
      <dt>Memoria</dt><dd>${info.deviceMemoryGb ? `${info.deviceMemoryGb} GB` : "Nao informada pelo navegador"}</dd>
      <dt>GPU</dt><dd>${info.gpuRenderer ?? "-"}</dd>
      <dt>WebGL</dt><dd>${info.webglVersion ?? "-"}</dd>
      <dt>Tela</dt><dd>${info.screenWidth ?? 0} x ${info.screenHeight ?? 0}</dd>
      <dt>Viewport</dt><dd>${info.viewportWidth ?? 0} x ${info.viewportHeight ?? 0}</dd>
      <dt>Pixel ratio</dt><dd>${info.pixelRatio ?? 1}</dd>
      <dt>Touch</dt><dd>${info.touch ? "Sim" : "Nao"}</dd>
      <dt>Movimento reduzido</dt><dd>${info.reducedMotion ? "Sim" : "Nao"}</dd>
    </dl>
  `;

  const applied = el("article", "hardware-applied");
  applied.innerHTML = `
    <h2>Configuracao aplicada</h2>
    <dl>
      <dt>FPS alvo</dt><dd>${preset.fps}</dd>
      <dt>Escala</dt><dd>${Math.round(preset.renderScale * 100)}%</dd>
      <dt>Textura</dt><dd>${preset.texture}</dd>
      <dt>Animacao</dt><dd>${preset.animation}</dd>
      <dt>Sombras</dt><dd>${preset.shadows ? "Ativas" : "Reduzidas"}</dd>
      <dt>Particulas</dt><dd>${preset.particles ? "Ativas" : "Reduzidas"}</dd>
      <dt>Efeitos UI</dt><dd>${preset.uiEffects ? "Ativos" : "Reduzidos"}</dd>
      <dt>Modo</dt><dd>${game.state.graphics.auto ? "Automatico" : "Manual"}</dd>
    </dl>
  `;

  const notes = el("article", "hardware-notes");
  notes.innerHTML = `<h2>Notas</h2>${(detected?.notes ?? []).map((note) => `<p>${note}</p>`).join("")}`;

  const audioPanel = el("article", "audio-settings");
  audioPanel.innerHTML = `
    <h2>Audio</h2>
    <div class="audio-controls">
      <button class="audio-toggle ${audioState.enabled ? "active" : ""}" type="button">${audioState.enabled ? "Som ligado" : "Som desligado"}</button>
      <label>Volume <input class="volume-slider" type="range" min="0" max="1" step="0.05" value="${audioState.masterVolume}"></label>
    </div>
    <h2>Mapa sonoro Pixabay</h2>
    <div class="sound-map">
      ${Object.entries(AUDIO_CATALOG).map(([key, item]) => `
        <div class="audio-row">
          <strong>${item.label}</strong>
          <span>${item.files.join(", ")}</span>
          <a href="${item.sources[0].url}" target="_blank" rel="noreferrer">${item.sources[0].title}</a>
        </div>
      `).join("")}
    </div>
  `;
  audioPanel.querySelector(".audio-toggle").addEventListener("click", () => {
    game.setAudioEnabled(!game.state.audio.enabled);
    audio.configure(game.state.audio);
    if (game.state.audio.enabled) audio.play("menu_open", { volume: 0.65 });
    render();
  });
  audioPanel.querySelector(".volume-slider").addEventListener("input", (event) => {
    game.setAudioVolume(event.currentTarget.value);
    audio.configure(game.state.audio);
    audio.play("ui_click", { volume: 0.45 });
  });

  wrap.append(summary, specs, applied, renderUserSettings(), audioPanel, renderGithubSyncPanel(), renderSecurityPanel(), notes);
  return wrap;
}

function renderGithubSyncPanel() {
  const sync = game.state.githubSync ?? {};
  const panel = el("article", "github-sync-panel");
  panel.innerHTML = `
    <h2>Autosave no GitHub</h2>
    <p>Obrigatorio no fluxo de save: ao criar conta, login, personagem e progresso, o jogo tenta enviar os sistemas para o GitHub. Use um token pessoal com permissao somente neste repositorio; o jogo nao traz token embutido.</p>
    <div class="settings-grid">
      <label>Usuario/organizacao <input name="owner" autocomplete="username" inputmode="text" autocapitalize="none" value="${escapeHtml(sync.owner ?? "")}" placeholder="lzvsrx"></label>
      <label>Repositorio <input name="repo" inputmode="text" autocapitalize="none" value="${escapeHtml(sync.repo ?? "")}" placeholder="aesdivinuscomplete"></label>
      <label>Branch <input name="branch" inputmode="text" autocapitalize="none" value="${escapeHtml(sync.branch ?? "main")}" placeholder="main"></label>
      <label>Caminho do save <input name="path" inputmode="text" autocapitalize="none" value="${escapeHtml(sync.path ?? "saves/aes-divinus-save.json")}" placeholder="saves/aes-divinus-save.json"></label>
      <label>Pasta dos sistemas <input name="systemPath" inputmode="text" autocapitalize="none" value="${escapeHtml(sync.systemPath ?? "saves/systems")}" placeholder="saves/systems"></label>
      <label>Salvar por sistemas <select name="structuredSaves"><option value="true" ${sync.structuredSaves !== false ? "selected" : ""}>Ligado</option><option value="false" ${sync.structuredSaves === false ? "selected" : ""}>Desligado</option></select></label>
      <label>Token pessoal <input name="token" type="password" autocomplete="new-password" value="${escapeHtml(sync.token ?? "")}" placeholder="ghp_..."></label>
    </div>
    <dl>
      <dt>Ultimo envio</dt><dd>${escapeHtml(sync.lastSyncAt ?? "Nunca")}</dd>
      <dt>Status</dt><dd>${escapeHtml(sync.lastError ?? game.lastGithubSync?.reason ?? "Pronto")}</dd>
    </dl>
  `;
  const fields = panel.querySelectorAll("input, select");
  fields.forEach((field) => {
    field.addEventListener("change", () => {
      const data = Object.fromEntries([...fields].map((item) => [item.name, item.value]));
      game.configureGithubSync({ ...data, enabled: true, structuredSaves: data.structuredSaves === "true" });
      render();
    });
  });
  panel.append(actionButton("Enviar save agora", "Sincronizar save atual com GitHub", () => game.save()));
  return panel;
}

function renderUserSettings() {
  const settings = game.state.settings ?? game.defaultSettings();
  const panel = el("article", "user-settings");
  panel.innerHTML = `
    <h2>Jogabilidade e acessibilidade</h2>
    <div class="settings-grid">
      ${rangeSetting("fontScale", "Fonte", settings.fontScale, 0.85, 1.45, 0.05, `${Math.round(settings.fontScale * 100)}%`)}
      ${rangeSetting("interfaceScale", "Interface", settings.interfaceScale, 0.9, 1.25, 0.05, `${Math.round(settings.interfaceScale * 100)}%`)}
      ${rangeSetting("combatSpeed", "Velocidade de combate", settings.combatSpeed, 0.5, 2, 0.25, `${settings.combatSpeed}x`)}
      ${selectSetting("screenWidth", "Tamanho de tela", settings.screenWidth, [["auto", "Automatico"], ["compact", "Compacto"], ["comfort", "Confortavel"], ["wide", "Amplo"]])}
      ${selectSetting("layoutDensity", "Densidade", settings.layoutDensity, [["compact", "Compacta"], ["normal", "Normal"], ["comfortable", "Espacada"]])}
      ${selectSetting("targetSize", "Tamanho dos botoes", settings.targetSize, [["auto", "Automatico"], ["large", "Grande"], ["extra", "Extra"]])}
      ${selectSetting("contrast", "Contraste", settings.contrast, [["normal", "Normal"], ["high", "Alto"]])}
      ${selectSetting("colorBlindMode", "Cores", settings.colorBlindMode, [["off", "Padrao"], ["deuteranopia", "Deuteranopia"], ["protanopia", "Protanopia"], ["tritanopia", "Tritanopia"]])}
      ${selectSetting("motion", "Movimento", settings.motion, [["auto", "Automatico"], ["reduced", "Reduzido"], ["full", "Completo"]])}
      ${selectSetting("textSpacing", "Espacamento de texto", settings.textSpacing, [["normal", "Normal"], ["wide", "Amplo"]])}
    </div>
    <div class="settings-toggles">
      ${toggleSetting("autosave", "Autosave", settings.autosave)}
      ${toggleSetting("confirmDanger", "Confirmar reset", settings.confirmDanger)}
      ${toggleSetting("privacyMode", "Modo privacidade", settings.privacyMode)}
    </div>
  `;
  panel.querySelectorAll("[data-setting]").forEach((control) => {
    control.addEventListener("input", () => {
      const value = control.type === "checkbox" ? control.checked : control.value;
      game.setUserSetting(control.dataset.setting, value);
      applyUserSettings();
      render();
    });
  });
  panel.append(actionButton("Restaurar configuracoes", "Voltar configuracoes padrao", () => game.resetUserSettings()));
  return panel;
}

function renderSecurityPanel() {
  const panel = el("article", "security-panel");
  panel.innerHTML = `
    <h2>Seguranca do save</h2>
    <dl>
      <dt>Banco</dt><dd>IndexedDB ${game.database?.available?.() ? "ativo" : "indisponivel"}</dd>
      <dt>Criptografia local</dt><dd>${globalThis.crypto?.subtle ? "AES-GCM disponivel" : "Fallback sem WebCrypto"}</dd>
      <dt>Integridade</dt><dd>Hash SHA-256 por snapshot e evento</dd>
      <dt>Privacidade</dt><dd>${game.state.settings?.privacyMode ? "Ativa" : "Normal"}</dd>
      <dt>Dados remotos</dt><dd>Email bruto, token GitHub e identificador do dispositivo sao redigidos antes do envio.</dd>
      <dt>Incidentes</dt><dd>Falhas devem preservar evidencias, conter o risco e seguir o plano de resposta cibernetica.</dd>
      <dt>Autoridades</dt><dd>ANPD, Policia Federal, CERT.br, SaferNet, EDPB/GPA, FIRST, Europol/INTERPOL e plataformas conforme pais e caso.</dd>
      <dt>Comunicacao oficial</dt><dd>Denuncias e notificacoes exigem avaliacao humana, juridica e tecnica antes do envio.</dd>
    </dl>
    <div class="security-links">
      <a href="./docs/PLANO_RESPOSTA_INCIDENTES_CIBERNETICOS.md" target="_blank" rel="noreferrer">Plano de incidentes</a>
      <a href="./docs/CONTATOS_AUTORIDADES_CIBERNETICAS_GLOBAIS.md" target="_blank" rel="noreferrer">Contatos oficiais</a>
      <a href="./PRIVACY_POLICY.md" target="_blank" rel="noreferrer">Privacidade</a>
      <a href="./TERMS_OF_USE.md" target="_blank" rel="noreferrer">Termos</a>
    </div>
  `;
  return panel;
}

function rangeSetting(key, label, value, min, max, step, display) {
  return `<label>${escapeHtml(label)} <span>${escapeHtml(display)}</span><input data-setting="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
}

function selectSetting(key, label, value, choices) {
  return `<label>${escapeHtml(label)} <select data-setting="${key}">${choices.map(([id, text]) => `<option value="${id}" ${value === id ? "selected" : ""}>${escapeHtml(text)}</option>`).join("")}</select></label>`;
}

function toggleSetting(key, label, checked) {
  return `<label class="toggle-setting"><input data-setting="${key}" type="checkbox" ${checked ? "checked" : ""}> ${escapeHtml(label)}</label>`;
}

function renderFlowRail(activeId) {
  const rail = el("aside", "flow-rail");
  rail.innerHTML = `<h2>Fluxo</h2>`;
  SCREEN_FLOW.slice(0, 6).forEach((screen, index) => {
    const row = el("div", `flow-step ${screen.id === activeId ? "active" : ""}`);
    row.innerHTML = `<span>${index + 1}</span><strong>${escapeHtml(screen.label)}</strong><small>${escapeHtml(screen.template)}</small>`;
    rail.append(row);
  });
  return rail;
}

function options(items, selected) {
  return items.map((item) => `<option ${item === selected ? "selected" : ""}>${escapeHtml(item)}</option>`).join("");
}

function renderJournal() {
  const journal = el("section", "journal");
  journal.innerHTML = `<h2>Diario</h2>${game.state.campaign.journal.slice(-6).reverse().map((line) => `<p>${escapeHtml(line)}</p>`).join("")}`;
  return journal;
}

function el(tag, className = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

window.addEventListener("keydown", (event) => {
  if (game.state.mode !== "combat") return;
  const unit = active();
  if (!unit || unit.side !== "ally") return;
  void audio.unlock();
  if (event.key === "1") performAttack(unit, selectedTarget());
  if (event.key === "2") game.guard(unit.id);
  if (event.key === "3") game.inspire(unit.id, selectedAlly()?.id);
  if (event.key === " ") game.endTurn();
  render();
});

render();
