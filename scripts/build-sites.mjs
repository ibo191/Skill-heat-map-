import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");
const distDir = join(root, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(join(distDir, "public"), { recursive: true });
await mkdir(join(distDir, "server"), { recursive: true });
await mkdir(join(distDir, ".openai"), { recursive: true });

await cp(outDir, join(distDir, "public"), { recursive: true });
await cp(join(root, ".openai", "hosting.json"), join(distDir, ".openai", "hosting.json"));

await writeFile(
  join(distDir, "server", "index.js"),
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`
);
