import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const assetsDir =
  "C:/Users/eagle/.cursor/projects/c-Users-eagle-Projects/assets";
const outDir = path.join(root, "public/characters");
const iconsDir = path.join(root, "public/icons");

function winPath(p) {
  const resolved = path.resolve(p);
  return process.platform === "win32" && !resolved.startsWith("\\\\?\\")
    ? `\\\\?\\${resolved}`
    : resolved;
}

function findAsset(fragment) {
  const files = fs.readdirSync(assetsDir);
  const match = files.find((f) => f.includes(fragment));
  if (!match) throw new Error(`Asset not found for fragment: ${fragment}`);
  return winPath(path.join(assetsDir, match));
}

/** Copy source bytes unchanged — preserves alpha, pupils, outlines */
function copyAsset(fragment, destName, dir = outDir) {
  const src = findAsset(fragment);
  const dest = path.join(dir, destName);
  fs.copyFileSync(src, dest);
  console.log(`Copied ${destName}`);
}

const copies = [
  ["Cartoon-Bluey-PNG-File", "bluey-default.png"],
  ["x363m6uj88291", "bluey-heart.png"],
  ["WB1008", "bluey-shock.png"],
  ["BINGO-2", "bingo-default.png"],
  ["happy_bingo", "bingo-happy.png"],
  ["l7f5dtw687id1", "bingo-balloon.png"],
  ["Muffin_1", "muffin-default.png"],
  ["Muffin-Bluey-Colorful-Cartoon-Style-PNG-thumb", "muffin-buginspector.png"],
  ["GLADYS-FIX", "flamingo-queen.png"],
  ["muffinFlamingoQueen", "muffin-flamingo-ride.png"],
  ["bluey-with-bingo-friends-png-2", "bluey-bingo-hero.png"],
  ["blueydollarbuck-74dd1e86", "blueydollarbuck.png", iconsDir],
];

for (const [fragment, name, dir = outDir] of copies) {
  copyAsset(fragment, name, dir);
}

const muffinPng = path.join(outDir, "muffin-default.png");
await sharp(winPath(muffinPng))
  .webp({ lossless: true })
  .toFile(path.join(outDir, "muffin-default.webp"));
console.log("Generated muffin-default.webp (lossless)");
