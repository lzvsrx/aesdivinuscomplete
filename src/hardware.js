export const QUALITY_PRESETS = {
  very_low: {
    label: "Muito baixo",
    fps: 30,
    renderScale: 0.72,
    particles: false,
    shadows: false,
    animation: "reduzida",
    texture: "baixa",
    uiEffects: false
  },
  low: {
    label: "Baixo",
    fps: 30,
    renderScale: 0.85,
    particles: false,
    shadows: false,
    animation: "normal",
    texture: "media",
    uiEffects: false
  },
  medium: {
    label: "Medio",
    fps: 60,
    renderScale: 1,
    particles: true,
    shadows: false,
    animation: "normal",
    texture: "alta",
    uiEffects: true
  },
  high: {
    label: "Alto",
    fps: 60,
    renderScale: 1,
    particles: true,
    shadows: true,
    animation: "alta",
    texture: "alta",
    uiEffects: true
  },
  ultra: {
    label: "Ultra",
    fps: 60,
    renderScale: 1,
    particles: true,
    shadows: true,
    animation: "alta",
    texture: "ultra",
    uiEffects: true
  }
};

export function detectHardware(env = globalThis) {
  const nav = env.navigator ?? {};
  const screen = env.screen ?? {};
  const win = env.window ?? env;
  const canvas = env.document?.createElement?.("canvas") ?? null;
  const gl = canvas?.getContext?.("webgl2") ?? canvas?.getContext?.("webgl") ?? null;
  const debugInfo = gl?.getExtension?.("WEBGL_debug_renderer_info") ?? null;
  const gpuRenderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Indisponivel";
  const gpuVendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "Indisponivel";

  const info = {
    platform: nav.platform ?? "desconhecido",
    userAgent: nav.userAgent ?? "desconhecido",
    language: nav.language ?? "desconhecido",
    cpuCores: nav.hardwareConcurrency ?? 2,
    deviceMemoryGb: nav.deviceMemory ?? null,
    maxTouchPoints: nav.maxTouchPoints ?? 0,
    touch: (nav.maxTouchPoints ?? 0) > 0,
    online: nav.onLine ?? true,
    screenWidth: screen.width ?? win.innerWidth ?? 0,
    screenHeight: screen.height ?? win.innerHeight ?? 0,
    viewportWidth: win.innerWidth ?? screen.width ?? 0,
    viewportHeight: win.innerHeight ?? screen.height ?? 0,
    pixelRatio: win.devicePixelRatio ?? 1,
    webgl: Boolean(gl),
    webglVersion: gl ? (canvas.getContext("webgl2") ? "WebGL 2" : "WebGL 1") : "Nenhum",
    gpuVendor,
    gpuRenderer,
    reducedMotion: Boolean(win.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches),
    detectedAt: new Date().toISOString()
  };

  const score = scoreHardware(info);
  const presetId = chooseQualityPreset(info, score);
  return {
    info,
    score,
    presetId,
    preset: QUALITY_PRESETS[presetId],
    notes: buildHardwareNotes(info, score, presetId)
  };
}

export function scoreHardware(info) {
  let score = 0;
  score += Math.min(32, (info.cpuCores ?? 2) * 5);
  if (info.deviceMemoryGb == null) score += 12;
  else score += Math.min(32, info.deviceMemoryGb * 6);
  if (info.webglVersion === "WebGL 2") score += 20;
  else if (info.webgl) score += 10;
  if (info.pixelRatio > 2.2) score -= 8;
  if (Math.max(info.screenWidth, info.screenHeight) >= 2500) score -= 4;
  if (info.touch && Math.min(info.screenWidth, info.screenHeight) < 800) score -= 8;
  if (info.reducedMotion) score -= 8;
  return Math.max(0, Math.round(score));
}

export function chooseQualityPreset(info, score = scoreHardware(info)) {
  if (!info.webgl) return "very_low";
  if (score < 28) return "very_low";
  if (score < 48) return "low";
  if (score < 68) return "medium";
  if (score < 88) return "high";
  return "ultra";
}

export function buildHardwareNotes(info, score, presetId) {
  const notes = [];
  if (!info.webgl) notes.push("WebGL indisponivel: efeitos visuais reduzidos.");
  if (info.deviceMemoryGb && info.deviceMemoryGb <= 4) notes.push("Memoria baixa: texturas e efeitos reduzidos.");
  if (info.cpuCores <= 4) notes.push("Poucos nucleos de CPU: animacoes e IA devem ser conservadoras.");
  if (info.pixelRatio > 2.2) notes.push("Tela de alta densidade: escala de renderizacao ajustada para desempenho.");
  if (info.touch) notes.push("Entrada touch detectada: alvos de toque maiores e UI espacada.");
  if (info.reducedMotion) notes.push("Preferencia por movimento reduzido detectada.");
  notes.push(`Pontuacao ${score}; perfil aplicado: ${QUALITY_PRESETS[presetId].label}.`);
  return notes;
}

