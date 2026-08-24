import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Godot Linux release packaging covers major distro families", async () => {
  const script = await readFile(new URL("../scripts/package-godot-linux.ps1", import.meta.url), "utf8");
  const docs = await readFile(new URL("../docs/LINUX_DISTROS_GODOT.md", import.meta.url), "utf8");

  for (const family of [
    "Universal",
    "Debian-Ubuntu-Mint",
    "Fedora-RHEL-openSUSE",
    "Arch-Manjaro",
    "SteamDeck"
  ]) {
    assert.ok(script.includes(family), `${family} missing from Linux package script`);
    assert.ok(docs.includes(family), `${family} missing from Linux distro docs`);
  }

  assert.ok(script.includes("run-aes-divinus.sh"));
  assert.ok(script.includes("install-desktop-entry.sh"));
  assert.ok(script.includes("AES_DIVINUS_RENDERER"));
  assert.ok(script.includes("AES_DIVINUS_LOW_POWER"));
});
