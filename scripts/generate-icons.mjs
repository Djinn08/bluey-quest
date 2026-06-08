import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, "public/icons/blueydollarbuck.png");
const outDir = path.join(root, "public/icons");

const sizes = [48, 72, 96, 144, 192, 512];

for (const size of sizes) {
  const out = path.join(outDir, `icon-${size}.png`);
  await sharp(source)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log(`Generated ${out}`);
}

await sharp(source)
  .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(root, "src/app/icon.png"));

console.log("Generated src/app/icon.png");
console.log("Done.");
