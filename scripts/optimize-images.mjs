import sharp from "sharp";
import { readdir, readFile, rename, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const imageDirectory = fileURLToPath(new URL("../public/assets/products/", import.meta.url));
const files = (await readdir(imageDirectory)).filter((name) => !name.startsWith("._") && /\.(png|webp)$/i.test(name));
let cursor = 0;
let beforeBytes = 0;
let afterBytes = 0;

async function optimize(name) {
  const input = join(imageDirectory, name);
  const output = join(imageDirectory, `.optimized-${name}`);
  const extension = extname(name).toLowerCase();
  const original = await readFile(input);
  beforeBytes += original.length;
  let pipeline = sharp(original)
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true });
  pipeline = extension === ".png"
    ? pipeline.png({ compressionLevel: 9, effort: 8 })
    : pipeline.webp({ quality: 82, alphaQuality: 92, effort: 5, smartSubsample: true });
  await pipeline.toFile(output);
  await rename(output, input);
  afterBytes += (await stat(input)).size;
}

async function worker() {
  while (cursor < files.length) {
    const index = cursor++;
    await optimize(files[index]);
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
const saved = beforeBytes ? Math.round((1 - afterBytes / beforeBytes) * 100) : 0;
console.log(`Optimized ${files.length} product images: ${(beforeBytes / 1_000_000).toFixed(1)} MB → ${(afterBytes / 1_000_000).toFixed(1)} MB (${saved}% smaller).`);
