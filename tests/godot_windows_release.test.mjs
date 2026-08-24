import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Godot Windows release package includes playable and compatibility launchers", async () => {
  const script = await readFile(new URL("../scripts/package-godot-windows.ps1", import.meta.url), "utf8");
  const docs = await readFile(new URL("../docs/WINDOWS_GODOT_TESTS.md", import.meta.url), "utf8");

  for (const expected of [
    "Jogar-Aes-Divinus.bat",
    "Jogar-Aes-Divinus-Compatibilidade.bat",
    "Testar-Aes-Divinus-Windows.bat",
    "README-WINDOWS.txt",
    "--rendering-driver opengl3"
  ]) {
    assert.ok(script.includes(expected), `${expected} missing from Windows package script`);
  }

  assert.ok(docs.includes("gl_compatibility"));
  assert.ok(docs.includes("res://scenes/main.tscn"));
});
