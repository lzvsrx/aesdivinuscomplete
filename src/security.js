const DEVICE_KEY_STORAGE = "aes-divinus-device-key-v1";
const TEXT_LIMIT = 600;

export function sanitizeText(value, maxLength = TEXT_LIMIT) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

export function sanitizeEmail(value) {
  return sanitizeText(value, 160).toLowerCase();
}

export function sanitizePayload(payload) {
  if (payload == null || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) return payload.slice(0, 40).map(sanitizePayload);
  return Object.fromEntries(
    Object.entries(payload).slice(0, 80).map(([key, value]) => {
      if (/password|senha|token|secret|certificate|profile/i.test(key)) return [key, "[redacted]"];
      if (typeof value === "string") return [key, sanitizeText(value, 300)];
      if (value && typeof value === "object") return [key, sanitizePayload(value)];
      return [key, value];
    })
  );
}

export function redactSensitiveState(state) {
  const copy = structuredClone(state);
  if (copy.account) copy.account = sanitizePayload(copy.account);
  if (copy.playerCharacter) copy.playerCharacter = sanitizePayload(copy.playerCharacter);
  return copy;
}

export async function createSecureEnvelope(data, { cryptoApi = globalThis.crypto, storage = globalThis.localStorage } = {}) {
  if (!cryptoApi?.subtle || !storage) return null;
  const rawKey = await getOrCreateDeviceKey({ cryptoApi, storage });
  const key = await importAesKey(rawKey, cryptoApi);
  const iv = cryptoApi.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await cryptoApi.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    algorithm: "AES-GCM",
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(cipher)),
    updatedAt: new Date().toISOString()
  };
}

export async function openSecureEnvelope(envelope, { cryptoApi = globalThis.crypto, storage = globalThis.localStorage } = {}) {
  if (!envelope?.data || !cryptoApi?.subtle || !storage) return null;
  const rawKey = storage.getItem(DEVICE_KEY_STORAGE);
  if (!rawKey) return null;
  const key = await importAesKey(rawKey, cryptoApi);
  const iv = base64ToBytes(envelope.iv);
  const cipher = base64ToBytes(envelope.data);
  const plain = await cryptoApi.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
  return JSON.parse(new TextDecoder().decode(plain));
}

export async function digestRecord(data, { cryptoApi = globalThis.crypto } = {}) {
  const encoded = new TextEncoder().encode(stableStringify(data));
  if (!cryptoApi?.subtle) return fallbackDigest(encoded);
  const digest = await cryptoApi.subtle.digest("SHA-256", encoded);
  return bytesToHex(new Uint8Array(digest));
}

async function getOrCreateDeviceKey({ cryptoApi, storage }) {
  const existing = storage.getItem(DEVICE_KEY_STORAGE);
  if (existing) return existing;
  const key = new Uint8Array(32);
  cryptoApi.getRandomValues(key);
  const encoded = bytesToBase64(key);
  storage.setItem(DEVICE_KEY_STORAGE, encoded);
  return encoded;
}

async function importAesKey(base64, cryptoApi) {
  return cryptoApi.subtle.importKey("raw", base64ToBytes(base64), "AES-GCM", false, ["encrypt", "decrypt"]);
}

function stableStringify(value) {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function fallbackDigest(bytes) {
  let hash = 2166136261;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
