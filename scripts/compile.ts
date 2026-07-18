import { join, relative } from "node:path";
import type { BunPlugin } from "bun";
import { mkdir } from "node:fs/promises";
import hash from "./hash.ts";
import { runAiAgentFileCompletion } from "./agent.ts";
import { GeneratedRepository } from "./generated.ts";
import logger from "./logger.ts";

const sessionId = `compile-${Date.now()}`;
console.log("pi.dev session name:", sessionId);
console.log(`To inspect session later use:
  pi --session ${sessionId}
`)

const generatedDir = join(process.cwd(), "ai-gen");

await mkdir(generatedDir, { recursive: true });

const generatedRepo = new GeneratedRepository(generatedDir);
await generatedRepo.loadManifest();

const aiGenPlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    build.onLoad({ filter: /\.ai\./, namespace: "file" }, async (args) => {

      const relpath = relative(process.cwd(), args.path);
      
      await logger.logStart(relpath);

      const existing = await generatedRepo.findByPath(relpath);

      if (existing) {
        const thisInputHash = await hash(relpath);
        if (thisInputHash === existing.inputHash) {
          await logger.logNoCompileNeeded();
          return {
            contents: existing.generatedContents
          }
        }
      }

      await logger.logAIGenStarted();
      // need to (re)generate; provide existing as a reference (if it exists)
      const newGeneratedContents = await runAiAgentFileCompletion({ relpath, sessionId, existing: existing?.generatedContents });

      // now write this to the generated directory; as well as update the manifest
      await generatedRepo.update(relpath, newGeneratedContents);

      await logger.logAIGenComplete();

      return {
        contents: newGeneratedContents,
      };
    });
  },
};

await Bun.build({
  entrypoints: ["./"],
  outdir: "./build",
  target: "bun",
  plugins: [aiGenPlugin],
});
