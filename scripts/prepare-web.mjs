import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "dist-web");

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(src, entry.name);
    const targetPath = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(sourcePath, targetPath);
    else await fs.copyFile(sourcePath, targetPath);
  }
}

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.copyFile(path.join(root, "index.html"), path.join(out, "index.html"));
await copyDir(path.join(root, "src"), path.join(out, "src"));
await copyDir(path.join(root, "assets"), path.join(out, "assets"));

console.log("dist-web pronto.");
