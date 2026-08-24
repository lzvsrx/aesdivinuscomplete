import { sanitizeText } from "./security.js";

const TRANSIENT_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

export function defaultGithubSyncSettings() {
  return {
    enabled: true,
    owner: "lzvsrx",
    repo: "aesdivinuscomplete",
    branch: "main",
    path: "saves/aes-divinus-save.json",
    systemPath: "saves/systems",
    structuredSaves: true,
    token: "",
    lastSyncAt: null,
    lastError: null
  };
}

function cleanConfig(config = {}) {
  const defaults = defaultGithubSyncSettings();
  return {
    ...defaults,
    ...config,
    owner: sanitizeText(config.owner ?? defaults.owner, 80).replace(/[^A-Za-z0-9_.-]/g, ""),
    repo: sanitizeText(config.repo ?? defaults.repo, 100).replace(/[^A-Za-z0-9_.-]/g, ""),
    branch: sanitizeText(config.branch ?? defaults.branch, 80).replace(/[^A-Za-z0-9_./-]/g, "") || defaults.branch,
    path: normalizeRepoPath(config.path ?? defaults.path, defaults.path),
    systemPath: normalizeRepoPath(config.systemPath ?? defaults.systemPath, defaults.systemPath).replace(/\/+$/g, "") || defaults.systemPath,
    structuredSaves: config.structuredSaves !== false && config.structuredSaves !== "false",
    token: String(config.token ?? "").trim()
  };
}

function normalizeRepoPath(value, fallback) {
  const cleaned = sanitizeText(value, 180)
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
  const parts = cleaned.split("/").filter(Boolean);
  if (!parts.length || parts.some((part) => part === "." || part === "..")) return fallback;
  return parts.map((part) => part.replace(/[^A-Za-z0-9_. -]/g, "")).filter(Boolean).join("/") || fallback;
}

function toBase64Utf8(value) {
  const json = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (typeof btoa === "function") {
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
  return Buffer.from(json, "utf8").toString("base64");
}

async function putGithubFile({ path, content, message, config, fetchApi }) {
  const safeConfig = cleanConfig(config);
  const cleanPath = normalizeRepoPath(path, safeConfig.path);
  const url = `https://api.github.com/repos/${safeConfig.owner}/${safeConfig.repo}/contents/${encodeURIComponent(cleanPath).replaceAll("%2F", "/")}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${safeConfig.token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };

  let sha = null;
  const current = await fetchWithRetry(fetchApi, `${url}?ref=${encodeURIComponent(safeConfig.branch)}`, { headers });
  if (current.ok) {
    const body = await current.json();
    sha = body.sha ?? null;
  } else if (current.status !== 404) {
    return { ok: false, reason: `GitHub respondeu ${current.status} ao ler save remoto.` };
  }

  const response = await fetchWithRetry(fetchApi, url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message,
      branch: safeConfig.branch,
      content: toBase64Utf8(content),
      sha
    })
  });

  if (!response.ok) return { ok: false, reason: `GitHub respondeu ${response.status} ao enviar save.` };
  const result = await response.json();
  return { ok: true, commitSha: result.commit?.sha ?? null, path: cleanPath };
}

async function fetchWithRetry(fetchApi, url, init, attempts = 2) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchApi(url, init);
      if (!TRANSIENT_STATUS.has(response.status) || attempt === attempts) return response;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
  }
  throw lastError ?? new Error("Falha de rede ao acessar GitHub.");
}

export function buildSystemSaveFiles(state, config = {}) {
  const safeConfig = cleanConfig(config);
  const base = safeConfig.systemPath;
  const common = {
    savedAt: new Date().toISOString(),
    game: "Aes Divinus",
    version: 1
  };
  return [
    { path: safeConfig.path, label: "snapshot completo", content: { ...common, system: "full_state", state } },
    { path: `${base}/account.json`, label: "conta", content: { ...common, system: "account", account: state.account, rememberedProfiles: state.rememberedProfiles, session: state.session } },
    { path: `${base}/character.json`, label: "personagem", content: { ...common, system: "player_character", playerCharacter: state.playerCharacter } },
    { path: `${base}/campaign.json`, label: "campanha", content: { ...common, system: "campaign", selectedMissionId: state.selectedMissionId, currentSceneIndex: state.currentSceneIndex, campaign: state.campaign } },
    { path: `${base}/principality.json`, label: "principado", content: { ...common, system: "principality", principality: state.principality } },
    { path: `${base}/inventory-economy.json`, label: "inventario e economia", content: { ...common, system: "inventory_economy", inventory: state.inventory, economy: state.economy } },
    { path: `${base}/combat.json`, label: "combate", content: { ...common, system: "combat", battle: state.battle, heroes: state.heroes } },
    { path: `${base}/settings.json`, label: "configuracoes", content: { ...common, system: "settings", settings: state.settings, graphics: state.graphics, hardware: state.hardware, audio: state.audio } },
    { path: `${base}/journal-codex.json`, label: "diario e codex", content: { ...common, system: "journal_codex", journal: state.campaign?.journal ?? [], codex: state.codex } }
  ];
}

export async function pushSaveToGithub(state, config, { fetchApi = globalThis.fetch } = {}) {
  const safeConfig = cleanConfig(config);
  if (!safeConfig.enabled) return { ok: false, skipped: true, reason: "Sincronizacao GitHub desligada." };
  if (!fetchApi) return { ok: false, reason: "Fetch indisponivel neste dispositivo." };
  if (!safeConfig.owner || !safeConfig.repo || !safeConfig.token) {
    return { ok: false, reason: "Configure usuario, repositorio e token do GitHub." };
  }

  const files = safeConfig.structuredSaves ? buildSystemSaveFiles(state, safeConfig) : buildSystemSaveFiles(state, safeConfig).slice(0, 1);
  const results = [];
  for (const file of files) {
    const result = await putGithubFile({
      path: file.path,
      content: file.content,
      message: `Autosave Aes Divinus - ${file.label}`,
      config: safeConfig,
      fetchApi
    });
    results.push(result);
    if (!result.ok) return { ok: false, reason: result.reason, files: results };
  }
  return { ok: true, files: results, path: safeConfig.path };
}

export { cleanConfig as normalizeGithubSyncSettings };
