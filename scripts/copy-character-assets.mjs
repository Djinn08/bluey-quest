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

async function stripBlackBackground(inputPath, outputPath) {
  const image = sharp(winPath(inputPath)).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 40 && g < 40 && b < 40) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outputPath);
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
  ["blueydollarbuck-74dd1e86", "blueydollarbuck.png", iconsDir],
  ["muffinFlamingoQueen", "muffin-flamingo-ride.png"],
];

for (const [fragment, name, dir = outDir] of copies) {
  const src = findAsset(fragment);
  const dest = path.join(dir, name);
  if (name.endsWith(".png") && dir === outDir) {
    await stripBlackBackground(src, dest);
    console.log(`Processed ${name}`);
  } else if (name === "blueydollarbuck.png") {
    await stripBlackBackground(src, dest);
    console.log(`Processed icon source ${name}`);
  } else {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${name}`);
  }
}

const muffinSrc = path.join(outDir, "muffin-default.png");
await sharp(muffinSrc).webp({ quality: 90 }).toFile(path.join(outDir, "muffin-default.webp"));
console.log("Generated muffin-default.webp");
