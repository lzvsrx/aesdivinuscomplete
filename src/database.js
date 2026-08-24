import { createSecureEnvelope, digestRecord, openSecureEnvelope, redactSensitiveState, sanitizePayload, sanitizeText } from "./security.js";

export const DB_NAME = "aes-divinus-db";
export const DB_VERSION = 3;
export const ACTIVE_SAVE_ID = "active";
export const LEGACY_SAVE_KEY = "aes-divinus-save-v1";

function clone(value) {
  return structuredClone(value);
}

export class IndexedDbGameDatabase {
  constructor({ indexedDB = globalThis.indexedDB, legacyStorage = globalThis.localStorage, cryptoApi = globalThis.crypto } = {}) {
    this.indexedDB = indexedDB;
    this.legacyStorage = legacyStorage;
    this.cryptoApi = cryptoApi;
    this.dbPromise = null;
  }

  available() {
    return Boolean(this.indexedDB);
  }

  async open() {
    if (!this.available()) throw new Error("IndexedDB indisponivel neste navegador.");
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = this.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        for (const store of ["saves", "accounts", "playerCharacters", "campaigns", "heroes", "principalities", "battles", "events", "security"]) {
          if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: "id" });
        }
        const eventStore = request.transaction.objectStore("events");
        if (!eventStore.indexNames.contains("byTime")) eventStore.createIndex("byTime", "createdAt");
        if (!eventStore.indexNames.contains("byType")) eventStore.createIndex("byType", "type");
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async load() {
    const db = await this.open();
    const save = await this.get(db, "saves", ACTIVE_SAVE_ID);
    if (save?.secure) {
      const opened = await openSecureEnvelope(save.secure, { cryptoApi: this.cryptoApi, storage: this.legacyStorage });
      if (opened) return clone(opened);
    }
    if (save?.state) return clone(save.state);

    const migrated = this.loadLegacySave();
    if (migrated) {
      await this.save(migrated, { type: "migration", message: "Save antigo migrado do localStorage para IndexedDB." });
      return migrated;
    }
    return null;
  }

  loadLegacySave() {
    if (!this.legacyStorage) return null;
    const raw = this.legacyStorage.getItem(LEGACY_SAVE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async save(state, event = {}) {
    const db = await this.open();
    const snapshot = clone(state);
    const safeSnapshot = redactSensitiveState(snapshot);
    const now = new Date().toISOString();
    const secure = await createSecureEnvelope(snapshot, { cryptoApi: this.cryptoApi, storage: this.legacyStorage });
    const stateHash = await digestRecord(snapshot, { cryptoApi: this.cryptoApi });
    const eventRecord = {
      id: `${now}-${Math.random().toString(36).slice(2)}`,
      type: sanitizeText(event.type ?? "autosave", 60),
      message: sanitizeText(event.message ?? "Estado salvo.", 240),
      createdAt: now,
      day: snapshot.campaign?.day ?? 1,
      mode: snapshot.mode,
      missionId: snapshot.selectedMissionId,
      battleRound: snapshot.battle?.round ?? null,
      payload: sanitizePayload(clone(event.payload ?? {}))
    };
    eventRecord.digest = await digestRecord(eventRecord, { cryptoApi: this.cryptoApi });

    await this.writeTransaction(db, ["saves", "accounts", "playerCharacters", "campaigns", "heroes", "principalities", "battles", "events", "security"], (stores) => {
      stores.saves.put({
        id: ACTIVE_SAVE_ID,
        version: DB_VERSION,
        updatedAt: now,
        state: secure ? null : safeSnapshot,
        secure,
        integrity: {
          algorithm: "SHA-256",
          hash: stateHash
        }
      });
      stores.accounts.put({ id: ACTIVE_SAVE_ID, updatedAt: now, account: safeSnapshot.account });
      stores.playerCharacters.put({ id: ACTIVE_SAVE_ID, updatedAt: now, playerCharacter: safeSnapshot.playerCharacter });
      stores.campaigns.put({ id: ACTIVE_SAVE_ID, updatedAt: now, campaign: safeSnapshot.campaign });
      stores.heroes.put({ id: ACTIVE_SAVE_ID, updatedAt: now, heroes: safeSnapshot.heroes });
      stores.principalities.put({ id: ACTIVE_SAVE_ID, updatedAt: now, principality: safeSnapshot.principality });
      stores.battles.put({ id: ACTIVE_SAVE_ID, updatedAt: now, battle: safeSnapshot.battle });
      stores.security.put({
        id: ACTIVE_SAVE_ID,
        updatedAt: now,
        encrypted: Boolean(secure),
        integrity: {
          algorithm: "SHA-256",
          hash: stateHash
        }
      });
      stores.events.put(eventRecord);
    });

    return true;
  }

  async reset(state) {
    const db = await this.open();
    await this.writeTransaction(db, ["saves", "accounts", "playerCharacters", "campaigns", "heroes", "principalities", "battles", "events", "security"], (stores) => {
      stores.saves.clear();
      stores.accounts.clear();
      stores.playerCharacters.clear();
      stores.campaigns.clear();
      stores.heroes.clear();
      stores.principalities.clear();
      stores.battles.clear();
      stores.events.clear();
      stores.security.clear();
    });
    return this.save(state, { type: "reset", message: "Novo jogo criado e banco reiniciado." });
  }

  async countEvents() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction("events", "readonly").objectStore("events").count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  get(db, storeName, id) {
    return new Promise((resolve, reject) => {
      const request = db.transaction(storeName, "readonly").objectStore(storeName).get(id);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  writeTransaction(db, storeNames, writer) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeNames, "readwrite");
      const stores = Object.fromEntries(storeNames.map((name) => [name, transaction.objectStore(name)]));
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
      writer(stores);
    });
  }
}

export class MemoryGameDatabase {
  constructor(initialState = null) {
    this.state = initialState ? clone(initialState) : null;
    this.events = [];
  }

  async load() {
    return this.state ? clone(this.state) : null;
  }

  async save(state, event = {}) {
    this.state = clone(state);
    this.events.push({
      id: String(this.events.length + 1),
      type: event.type ?? "autosave",
      message: event.message ?? "Estado salvo.",
      payload: clone(event.payload ?? {})
    });
    return true;
  }

  async reset(state) {
    this.events = [];
    return this.save(state, { type: "reset", message: "Novo jogo criado." });
  }

  async countEvents() {
    return this.events.length;
  }
}
