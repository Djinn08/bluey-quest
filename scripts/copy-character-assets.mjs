/**
 * Character asset install — byte-for-byte copy only.
 * No resizing, recompression, format conversion, or transparency processing.
 *
 * Place source files in public/characters/_incoming/ then run: npm run assets
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const incomingDir = path.join(root, "public/characters/_incoming");
const outDir = path.join(root, "public/characters");

/** @type {[string, string][]} */
const REGISTRY_MAP = [
  ["bluey-with-bingo-friends-png-2.png", "bluey-family.png"],
  ["bluey-with-bingo-friends-png-2.png", "bluey-default.png"],
  ["x363m6uj88291.png", "bluey-heart.png"],
  ["WB1008.png", "bluey-shock.png"],
  ["BINGO-2.png", "bingo-default.png"],
  ["happy_bingo___bluey_png_by_crossoverking16_dfpatu1-fullview.png", "bingo-happy.png"],
  ["l7f5dtw687id1.png", "bingo-balloon.png"],
  ["MUFFIN.png", "muffin-default.png"],
  ["Muffin-Bluey-Colorful-Cartoon-Style-PNG-thumb.png", "muffin-buginspector.png"],
  ["GLADYS-FIX.png", "flamingo-queen.png"],
];

function copyExact(src, dest) {
  fs.copyFileSync(src, dest);
  const a = fs.readFileSync(src);
  const b = fs.readFileSync(dest);
  if (a.length !== b.length || !a.equals(b)) {
    throw new Error(`Byte mismatch after copy: ${path.basename(dest)}`);
  }
}

if (!fs.existsSync(incomingDir)) {
  console.log("No _incoming folder — registry files should already live in public/characters/");
  console.log("Expected:", REGISTRY_MAP.map(([, d]) => d).join(", "));
  process.exit(0);
}

for (const [srcName, destName] of REGISTRY_MAP) {
  const src = path.join(incomingDir, srcName);
  const dest = path.join(outDir, destName);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing incoming asset: ${srcName}`);
  }
  copyExact(src, dest);
  console.log(`Installed ${destName}`);
}

console.log("All assets installed (byte-identical, no processing).");
