import { sanitizeText } from "./security.js";

export function defaultGithubSyncSettings() {
  return {
    enabled: false,
    owner: "",
    repo: "",
    branch: "main",
    path: "saves/aes-divinus-save.json",
    token: "",
    lastSyncAt: null,
    lastError: null
  };
}

function cleanConfig(config = {}) {
  return {
    ...defaultGithubSyncSettings(),
    ...config,
    owner: sanitizeText(config.owner ?? "", 80).replace(/[^A-Za-z0-9_.-]/g, ""),
    repo: sanitizeText(config.repo ?? "", 100).replace(/[^A-Za-z0-9_.-]/g, ""),
    branch: sanitizeText(config.branch ?? "main", 80).replace(/[^A-Za-z0-9_./-]/g, "") || "main",
    path: sanitizeText(config.path ?? "saves/aes-divinus-save.json", 160).replace(/^\/+/, "") || "saves/aes-divinus-save.json",
    token: String(config.token ?? "").trim()
  };
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

export async function pushSaveToGithub(state, config, { fetchApi = globalThis.fetch } = {}) {
  const safeConfig = cleanConfig(config);
  if (!safeConfig.enabled) return { ok: false, skipped: true, reason: "Sincronizacao GitHub desligada." };
  if (!fetchApi) return { ok: false, reason: "Fetch indisponivel neste dispositivo." };
  if (!safeConfig.owner || !safeConfig.repo || !safeConfig.token) {
    return { ok: false, reason: "Configure usuario, repositorio e token do GitHub." };
  }

  const url = `https://api.github.com/repos/${safeConfig.owner}/${safeConfig.repo}/contents/${encodeURIComponent(safeConfig.path).replaceAll("%2F", "/")}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${safeConfig.token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };

  let sha = null;
  const current = await fetchApi(`${url}?ref=${encodeURIComponent(safeConfig.branch)}`, { headers });
  if (current.ok) {
    const body = await current.json();
    sha = body.sha ?? null;
  } else if (current.status !== 404) {
    return { ok: false, reason: `GitHub respondeu ${current.status} ao ler save remoto.` };
  }

  const payload = {
    savedAt: new Date().toISOString(),
    game: "Aes Divinus",
    version: 1,
    state
  };
  const response = await fetchApi(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: "Autosave Aes Divinus",
      branch: safeConfig.branch,
      content: toBase64Utf8(payload),
      sha
    })
  });

  if (!response.ok) return { ok: false, reason: `GitHub respondeu ${response.status} ao enviar save.` };
  const result = await response.json();
  return { ok: true, commitSha: result.commit?.sha ?? null, path: safeConfig.path };
}

export { cleanConfig as normalizeGithubSyncSettings };
