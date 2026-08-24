import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(".");
const outDir = path.join(root, "assets", "audio");
const sampleRate = 44100;
const bitRate = 96;
const lamejs = loadLame();

const files = [
  "ui-click-01.mp3", "ui-click-02.mp3", "ui-click-03.mp3",
  "menu-open-01.mp3", "menu-open-02.mp3",
  "title-ambience-01.mp3", "title-ambience-02.mp3",
  "mission-scene-01.mp3", "mission-scene-02.mp3",
  "forest-ambience-01.mp3", "forest-ambience-02.mp3",
  "combat-start-01.mp3", "combat-start-02.mp3",
  "sword-attack-01.mp3", "sword-attack-02.mp3", "sword-attack-03.mp3",
  "armor-hit-01.mp3", "armor-hit-02.mp3",
  "bow-attack-01.mp3", "arrow-hit-01.mp3",
  "fire-01.mp3", "fire-02.mp3",
  "fear-01.mp3", "fear-02.mp3", "horror-sting-01.mp3",
  "victory-01.mp3", "victory-02.mp3",
  "defeat-01.mp3", "game-over-01.mp3"
];

fs.mkdirSync(outDir, { recursive: true });

for (const [index, file] of files.entries()) {
  const samples = makeSound(file, index + 1);
  const mp3 = encodeMp3(samples);
  fs.writeFileSync(path.join(outDir, file), mp3);
  console.log(`${file} ${mp3.length} bytes`);
}

function makeSound(file, seed) {
  if (file.startsWith("title-ambience")) return ambience(16, seed, [55, 82, 110], 0.22);
  if (file.startsWith("forest-ambience")) return forest(14, seed);
  if (file.startsWith("mission-scene")) return missionCue(seed);
  if (file.startsWith("ui-click")) return click(seed);
  if (file.startsWith("menu-open")) return menu(seed);
  if (file.startsWith("combat-start")) return combatStart(seed);
  if (file.startsWith("sword-attack")) return sword(seed);
  if (file.startsWith("armor-hit")) return armor(seed);
  if (file.startsWith("bow-attack") || file.startsWith("arrow-hit")) return bow(seed);
  if (file.startsWith("fire")) return fire(8, seed);
  if (file.startsWith("fear") || file.startsWith("horror-sting")) return fear(seed);
  if (file.startsWith("victory")) return victory(seed);
  if (file.startsWith("defeat") || file.startsWith("game-over")) return defeat(seed);
  return click(seed);
}

function empty(duration) {
  return new Float32Array(Math.ceil(duration * sampleRate));
}

function click(seed) {
  const data = empty(0.18);
  addTone(data, 0.0, 0.06, 760 + seed * 20, 1280 + seed * 35, 0.55, "triangle");
  addTone(data, 0.035, 0.08, 1520, 910, 0.24, "sine");
  return data;
}

function menu(seed) {
  const data = empty(0.46);
  addTone(data, 0.0, 0.16, 392, 523, 0.28, "sine");
  addTone(data, 0.08, 0.22, 659 + seed * 3, 988, 0.32, "triangle");
  addTone(data, 0.2, 0.18, 1318, 987, 0.18, "sine");
  return data;
}

function missionCue(seed) {
  const data = ambience(2.2, seed, [82, 123], 0.12);
  addTone(data, 0.2, 0.55, 196, 146, 0.22, "saw");
  addTone(data, 0.9, 0.52, 247, 185, 0.18, "triangle");
  addPercussion(data, 1.55, 95, 0.6);
  return data;
}

function combatStart(seed) {
  const data = empty(1.4);
  addPercussion(data, 0.05, 72, 0.8);
  addPercussion(data, 0.32, 86, 0.5);
  addTone(data, 0.55, 0.5, 130 + seed, 54, 0.45, "saw");
  addNoise(data, 0.5, 0.45, 0.25, seed);
  return data;
}

function sword(seed) {
  const data = empty(0.45);
  addSweepNoise(data, 0.02, 0.18, 0.45, seed);
  addTone(data, 0.11, 0.16, 1480, 520, 0.32, "saw");
  addTone(data, 0.2, 0.16, 1860, 1210, 0.2, "triangle");
  return data;
}

function armor(seed) {
  const data = empty(0.55);
  addPercussion(data, 0.02, 210 + seed * 3, 0.65);
  addTone(data, 0.05, 0.35, 1550, 720, 0.36, "triangle");
  addTone(data, 0.07, 0.28, 2470, 1380, 0.18, "sine");
  return data;
}

function bow(seed) {
  const data = empty(0.48);
  addTone(data, 0.01, 0.12, 780 + seed * 10, 150, 0.26, "sine");
  addSweepNoise(data, 0.04, 0.22, 0.32, seed + 12);
  addTone(data, 0.25, 0.12, 240, 180, 0.18, "triangle");
  return data;
}

function fire(duration, seed) {
  const data = empty(duration);
  addNoise(data, 0, duration, 0.18, seed);
  for (let t = 0.05; t < duration; t += 0.13 + seeded(seed + Math.floor(t * 100)) * 0.11) {
    addPercussion(data, t, 120 + seeded(seed + t) * 180, 0.12);
  }
  addTone(data, 0, duration, 72, 58, 0.08, "saw");
  return data;
}

function fear(seed) {
  const data = ambience(3.4, seed, [41, 57, 73], 0.18);
  addTone(data, 0.4, 1.1, 880, 300, 0.22, "sine");
  addTone(data, 1.2, 1.2, 63, 38, 0.32, "saw");
  addPercussion(data, 2.3, 55, 0.7);
  return data;
}

function victory(seed) {
  const data = empty(2.2);
  const notes = [392, 523, 659, 784, 1046];
  notes.forEach((note, index) => addTone(data, index * 0.28, 0.42, note + seed, note * 1.02, 0.32, "triangle"));
  addPercussion(data, 1.45, 110, 0.5);
  return data;
}

function defeat(seed) {
  const data = empty(2.1);
  addTone(data, 0, 1.6, 330, 82, 0.34, "sine");
  addTone(data, 0.55, 1.2, 165, 48, 0.25, "saw");
  addNoise(data, 0.2, 1.5, 0.06, seed);
  return data;
}

function forest(duration, seed) {
  const data = ambience(duration, seed, [95, 143], 0.12);
  addNoise(data, 0, duration, 0.07, seed);
  for (let t = 0.3; t < duration; t += 0.85) {
    addTone(data, t, 0.12, 1300 + seeded(seed + t) * 500, 900, 0.035, "sine");
  }
  return data;
}

function ambience(duration, seed, freqs, volume) {
  const data = empty(duration);
  freqs.forEach((freq, index) => {
    addTone(data, 0, duration, freq + seed * (index + 1), freq * 0.92, volume / freqs.length, index % 2 ? "sine" : "saw");
  });
  addNoise(data, 0, duration, volume * 0.18, seed);
  return data;
}

function addTone(data, start, duration, startFreq, endFreq, volume, wave = "sine") {
  const startIndex = Math.max(0, Math.floor(start * sampleRate));
  const length = Math.min(data.length - startIndex, Math.floor(duration * sampleRate));
  let phase = 0;
  for (let i = 0; i < length; i += 1) {
    const p = i / Math.max(1, length - 1);
    const freq = startFreq * Math.pow(endFreq / startFreq, p);
    phase += (Math.PI * 2 * freq) / sampleRate;
    const env = Math.sin(Math.PI * p);
    const raw = wave === "saw" ? 2 * ((phase / (Math.PI * 2)) % 1) - 1 : wave === "triangle" ? 2 * Math.asin(Math.sin(phase)) / Math.PI : Math.sin(phase);
    data[startIndex + i] += raw * env * volume;
  }
}

function addPercussion(data, start, freq, volume) {
  const startIndex = Math.floor(start * sampleRate);
  const length = Math.min(data.length - startIndex, Math.floor(0.45 * sampleRate));
  let phase = 0;
  for (let i = 0; i < length; i += 1) {
    const p = i / Math.max(1, length - 1);
    phase += (Math.PI * 2 * (freq * (1 - p * 0.82))) / sampleRate;
    data[startIndex + i] += Math.sin(phase) * Math.exp(-p * 10) * volume;
  }
}

function addNoise(data, start, duration, volume, seed) {
  const startIndex = Math.floor(start * sampleRate);
  const length = Math.min(data.length - startIndex, Math.floor(duration * sampleRate));
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const p = i / Math.max(1, length - 1);
    last = last * 0.92 + (seeded(seed + i) * 2 - 1) * 0.08;
    data[startIndex + i] += last * Math.sin(Math.PI * p) * volume;
  }
}

function addSweepNoise(data, start, duration, volume, seed) {
  const startIndex = Math.floor(start * sampleRate);
  const length = Math.min(data.length - startIndex, Math.floor(duration * sampleRate));
  for (let i = 0; i < length; i += 1) {
    const p = i / Math.max(1, length - 1);
    const env = Math.sin(Math.PI * p);
    data[startIndex + i] += (seeded(seed + i) * 2 - 1) * env * volume * (1 - p * 0.4);
  }
}

function seeded(value) {
  const x = Math.sin(Number(value) * 999.913) * 43758.5453;
  return x - Math.floor(x);
}

function encodeMp3(floatSamples) {
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, bitRate);
  const mp3 = [];
  const block = 1152;
  for (let i = 0; i < floatSamples.length; i += block) {
    const slice = floatSamples.subarray(i, i + block);
    const pcm = new Int16Array(slice.length);
    for (let j = 0; j < slice.length; j += 1) {
      const sample = Math.max(-0.96, Math.min(0.96, slice[j]));
      pcm[j] = sample < 0 ? sample * 32768 : sample * 32767;
    }
    const encoded = encoder.encodeBuffer(pcm);
    if (encoded.length) mp3.push(Buffer.from(encoded));
  }
  const flushed = encoder.flush();
  if (flushed.length) mp3.push(Buffer.from(flushed));
  return Buffer.concat(mp3);
}

function loadLame() {
  const bundle = fs.readFileSync(path.join(root, "node_modules", "lamejs", "lame.all.js"), "utf8");
  const sandbox = { Int8Array, Int16Array, Int32Array, Float32Array, Float64Array, Uint8Array, ArrayBuffer, DataView, Math };
  vm.runInNewContext(`${bundle}; this.encoder = lamejs;`, sandbox);
  return sandbox.encoder;
}
