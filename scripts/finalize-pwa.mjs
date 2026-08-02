import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist");

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(target) : [target];
  }));
  return nested.flat();
}

export function toPublicAssetPath(file) {
  return `/${path.relative(outputRoot, file).split(path.sep).join("/")}`;
}

export async function finalizePwaBuild() {
  const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
  const assetRoot = path.join(outputRoot, "assets");
  const assets = (await listFiles(assetRoot)).map(toPublicAssetPath).sort();
  const fingerprint = createHash("sha256").update(assets.join("\n")).digest("hex").slice(0, 12);
  const workerPath = path.join(outputRoot, "sw.js");
  const source = await readFile(workerPath, "utf8");
  const finalized = source
    .replace(/const CACHE_VERSION = "[^"]+";/, `const CACHE_VERSION = "budgetforge-shell-${packageJson.version}-${fingerprint}";`)
    .replace("const BUILD_ASSETS = [];", `const BUILD_ASSETS = ${JSON.stringify(assets)};`);
  await writeFile(workerPath, finalized, "utf8");
  return { assets, fingerprint };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await finalizePwaBuild();
  process.stdout.write(`Prepared BudgetForge PWA cache with ${result.assets.length} production assets.\n`);
}
