import { AesDivinusGame, CHARACTER_OPTIONS, EQUIPMENT_DESIGNS, FEAR_STATES, MISSIONS, POSITION_TRAITS, SCREEN_FLOW, WEAPONS } from "./game.js";

const app = document.querySelector("#app");
const game = new AesDivinusGame();
let saveStatus = "Banco pronto";
await game.load();

const tabs = [
  ["mission", "Missao"],
  ["principality", "Principado"],
  ["characters", "Personagens"],
  ["inventory", "Arsenal"],
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

function actionButton(label, title, handler, disabled = false) {
  const button = document.createElement("button");
  button.className = "action-button";
  button.type = "button";
  button.textContent = label;
  button.title = title;
  button.disabled = disabled;
  button.addEventListener("click", () => {
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
  app.innerHTML = "";
  app.append(renderShell());
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
    actionButton("Novo", "Reiniciar banco da campanha", () => game.reset())
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
    <label>Nome <input name="name" autocomplete="name" placeholder="William" value="${game.state.account?.name ?? ""}"></label>
    <label>Email <input name="email" type="email" autocomplete="email" placeholder="voce@email.com" value="${game.state.account?.email ?? ""}"></label>
    <label>Senha <input name="password" type="password" autocomplete="current-password" minlength="6" placeholder="minimo 6 caracteres"></label>
    <p class="form-error" aria-live="polite"></p>
  `;
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
      <label>Nome <input name="name" placeholder="William" value="${current.name ?? "William"}"></label>
      <label>Tratamento <select name="pronoun">${options(["Livre", "Ele", "Ela", "Neutro"], current.pronoun)}</select></label>
      <label>Origem <select name="origin">${CHARACTER_OPTIONS.origins.map((item) => `<option value="${item.id}" ${current.origin === item.id ? "selected" : ""}>${item.label} - ${item.bonus}</option>`).join("")}</select></label>
      <label>Corpo <select name="body">${options(CHARACTER_OPTIONS.bodies, current.body)}</select></label>
      <label>Rosto <select name="face">${options(CHARACTER_OPTIONS.faces, current.face)}</select></label>
      <label>Cabelo <select name="hair">${options(CHARACTER_OPTIONS.hair, current.hair)}</select></label>
      <label>Barba <select name="beard">${options(CHARACTER_OPTIONS.beards, current.beard)}</select></label>
      <label>Paleta <select name="palette">${CHARACTER_OPTIONS.palettes.map((item) => `<option value="${item.id}" ${current.palette === item.id ? "selected" : ""}>${item.label}</option>`).join("")}</select></label>
      <label>Arma inicial <select name="weapon">
        <option value="iron_sword">Espada de ferro</option>
        <option value="spear">Lanca de ferro</option>
        <option value="bow">Arco</option>
      </select></label>
    </div>
    <p class="form-error" aria-live="polite"></p>
  `;
  const preview = el("aside", "character-preview");
  preview.innerHTML = `
    <div class="avatar-forge"><span></span><i></i><b></b></div>
    <h2>Identidade visual</h2>
    <p>Template de modelagem modular: corpo, rosto, cabelo, barba, pele, roupa base, armadura, capa, arma e acessorios separados para troca em runtime.</p>
  `;
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

function renderTitleScreen() {
  const screen = el("section", "screen title-screen");
  const hero = el("div", "title-content");
  hero.innerHTML = `
    <img class="title-logo" src="./assets/aes-divinus-logo.png" alt="Aes Divinus">
    <img class="title-studio" src="./assets/lzasantosworldsgames-logo.png" alt="LZASANTOSWORLDSGAMES">
    <h1>Aes Divinus</h1>
    <p>${game.state.playerCharacter?.name ?? "William"} carrega a coroa antes de merecer o reino.</p>
  `;
  const menu = el("div", "title-menu");
  menu.append(
    actionButton("Continuar", "Ir para a mesa de missoes", () => game.goToMode("briefing")),
    actionButton("Iniciar prologo", "Comecar a primeira cena da Floresta de Sangue", () => game.startStoryScene("blood_forest")),
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
    <p>${scene?.text ?? game.selectedMission.objective}</p>
    <dl>
      <dt>Camera</dt><dd>${scene?.camera ?? "Plano tatico."}</dd>
      <dt>Escolha</dt><dd>${scene?.choice ?? "Avancar"}</dd>
      <dt>Efeito</dt><dd>${scene?.effect ?? "A missao continua."}</dd>
    </dl>
  `;
  frame.append(actionButton("Avancar", "Ir para a proxima cena ou iniciar missao", () => game.advanceScene()));
  screen.append(frame, renderFlowRail("mission_scene"));
  return screen;
}

function renderCamp() {
  const wrap = el("section", "camp-layout");
  if (game.state.activeTab === "mission") wrap.append(renderMissionPanel());
  if (game.state.activeTab === "principality") wrap.append(renderPrincipality());
  if (game.state.activeTab === "characters") wrap.append(renderCharacters());
  if (game.state.activeTab === "inventory") wrap.append(renderInventory());
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
    item.innerHTML = `<strong>${mission.title}</strong><span>${mission.act} / ${mission.type}</span>`;
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
    <p class="eyebrow">${mission.act}</p>
    <h1>${mission.title}</h1>
    <p>${mission.objective}</p>
    <div class="objective-list">${mission.optional.map((item) => `<span>${item}</span>`).join("")}</div>
  `;
  detail.append(actionButton(mission.managementOnly ? "Abrir cena de conselho" : "Abrir cenas da missao", "Comecar fluxo narrativo da missao", () => game.startStoryScene(mission.id)));
  detail.append(actionButton("Iniciar direto", "Pular cenas e iniciar sistema principal da missao", () => game.startSelectedMission()));
  detail.append(renderJournal());
  panel.append(list, detail);
  return panel;
}

function renderCombat() {
  const battle = game.state.battle;
  const wrap = el("section", "combat-layout");
  const mission = game.selectedMission;
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
    modal.innerHTML = `<strong>${battle.outcome === "victory" ? "Vitoria" : "Derrota"}</strong><span>${battle.log[0] ?? ""}</span>`;
    modal.append(actionButton("Voltar ao principado", "Encerrar resultado", () => {
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
    <div><strong>${mission.title}</strong><span>${mission.objective}</span></div>
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
      slot.innerHTML = `<span class="slot-label">${POSITION_TRAITS[i].label}</span>`;
    }
    formation.append(slot);
  }
  return formation;
}

function unitToken(unit) {
  const fear = FEAR_STATES[unit.fear ?? "steady"].label;
  return `
    <span class="unit-figure ${unit.side}"></span>
    <strong>${unit.name}</strong>
    <small>${unit.role}</small>
    <span class="bar"><i style="width:${pct(unit.hp, unit.maxHp)}"></i></span>
    <em>${unit.hp}/${unit.maxHp} HP / ${fear}</em>
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
    ctx.fillText(unit.name.slice(0, 8), sideX, y + 30);
  });
}

function renderActionBar(unit) {
  const bar = el("div", "action-bar");
  if (!unit) return bar;
  const target = selectedTarget();
  const disabled = unit.side !== "ally" || game.state.battle.outcome;
  bar.innerHTML = `<div><strong>${unit.name}</strong><span>${unit.ap ?? 0} PA disponiveis</span></div>`;
  bar.append(
    actionButton("Atacar", "Atacar alvo selecionado", () => game.attack(unit.id, target?.id), disabled || !target || target.side === unit.side || unit.ap < 1),
    actionButton("Recuar", "Mover para tras", () => game.move(unit.id, 1), disabled || unit.ap < 1),
    actionButton("Avancar", "Mover para frente", () => game.move(unit.id, -1), disabled || unit.ap < 1),
    actionButton("Guarda", "Reduzir dano recebido", () => game.guard(unit.id), disabled || unit.ap < 1),
    actionButton("Inspirar", "William fortalece coragem e iniciativa", () => game.inspire(unit.id, selectedAlly()?.id), disabled || unit.ap < 1 || !selectedAlly()),
    actionButton("Fogo", "Preparar flecha de fogo", () => game.useAesArrow(unit.id), disabled || unit.weapon !== "bow" || unit.ap < 1),
    actionButton("Esperar", "Encerrar turno", () => game.endTurn(), disabled)
  );
  return bar;
}

function renderUnitCard(unit, title) {
  const card = el("div", "unit-card");
  if (!unit) {
    card.innerHTML = `<h2>${title}</h2><p>Nenhuma unidade.</p>`;
    return card;
  }
  const { weapon, armor } = game.equipment(unit);
  card.innerHTML = `
    <h2>${title}</h2>
    <div class="unit-title"><strong>${unit.name}</strong><span>${unit.role}</span></div>
    <span class="bar big"><i style="width:${pct(unit.hp, unit.maxHp)}"></i></span>
    <dl>
      <dt>HP</dt><dd>${unit.hp}/${unit.maxHp}</dd>
      <dt>Forca</dt><dd>${unit.strength}</dd>
      <dt>Agilidade</dt><dd>${unit.agility}</dd>
      <dt>Percepcao</dt><dd>${unit.perception}</dd>
      <dt>Coragem</dt><dd>${unit.courage}</dd>
      <dt>Lealdade</dt><dd>${unit.loyalty ?? "-"}</dd>
      <dt>Estado</dt><dd>${FEAR_STATES[unit.fear ?? "steady"].label}</dd>
      <dt>Arma</dt><dd>${weapon.name}</dd>
      <dt>Armadura</dt><dd>${armor.name}</dd>
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
    row.innerHTML = `<span>${unit.name}</span><strong>${game.initiative(unit)}</strong>`;
    box.append(row);
  });
  return box;
}

function renderLog() {
  const log = el("div", "log");
  log.innerHTML = `<h2>Registro</h2>${(game.state.battle?.log ?? []).map((line) => `<p>${line}</p>`).join("")}`;
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
  return `<div class="resource"><strong>${value}</strong><span>${label}</span></div>`;
}

function reputation(label, value) {
  return `<div class="rep"><span>${label}</span><i><b style="width:${value}%"></b></i><strong>${value}</strong></div>`;
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
    item.innerHTML = `<h2>${entry.title}</h2><p>${entry.text}</p>`;
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
  intro.innerHTML = `<h1>Arsenal e ferramentas</h1><p>Designs prontos para orientar modelagem 3D, icones, balanceamento e fabricacao dentro do principado.</p>`;
  const grid = el("div", "equipment-grid");
  EQUIPMENT_DESIGNS.forEach((item) => {
    const card = el("article", "equipment-card");
    card.style.setProperty("--accent", item.color);
    card.innerHTML = `
      <div class="equipment-icon ${item.icon}"></div>
      <p class="eyebrow">${item.kind}</p>
      <h2>${item.name}</h2>
      <strong>${item.role}</strong>
      <p>${item.silhouette}</p>
      <dl>
        <dt>Material</dt><dd>${item.material}</dd>
        <dt>Jogo</dt><dd>${item.gameplay}</dd>
      </dl>
    `;
    grid.append(card);
  });
  wrap.append(intro, grid);
  return wrap;
}

function renderScreensCatalog() {
  const wrap = el("section", "screens-catalog");
  wrap.innerHTML = `<h1>Telas do jogo</h1><p>Fluxo sequencial com templates proprios para manter cada etapa unica sem quebrar a continuidade da campanha.</p>`;
  const grid = el("div", "screen-card-grid");
  SCREEN_FLOW.forEach((screen, index) => {
    const card = el("article", `screen-card ${game.state.mode === screen.id ? "active" : ""}`);
    card.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><h2>${screen.label}</h2><strong>${screen.template}</strong><p>${screen.purpose}</p>`;
    grid.append(card);
  });
  wrap.append(grid);
  return wrap;
}

function renderFlowRail(activeId) {
  const rail = el("aside", "flow-rail");
  rail.innerHTML = `<h2>Fluxo</h2>`;
  SCREEN_FLOW.slice(0, 6).forEach((screen, index) => {
    const row = el("div", `flow-step ${screen.id === activeId ? "active" : ""}`);
    row.innerHTML = `<span>${index + 1}</span><strong>${screen.label}</strong><small>${screen.template}</small>`;
    rail.append(row);
  });
  return rail;
}

function options(items, selected) {
  return items.map((item) => `<option ${item === selected ? "selected" : ""}>${item}</option>`).join("");
}

function renderJournal() {
  const journal = el("section", "journal");
  journal.innerHTML = `<h2>Diario</h2>${game.state.campaign.journal.slice(-6).reverse().map((line) => `<p>${line}</p>`).join("")}`;
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
  if (event.key === "1") game.attack(unit.id, selectedTarget()?.id);
  if (event.key === "2") game.guard(unit.id);
  if (event.key === "3") game.inspire(unit.id, selectedAlly()?.id);
  if (event.key === " ") game.endTurn();
  render();
});

render();
