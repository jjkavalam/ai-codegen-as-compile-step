import { mkdir } from "node:fs/promises";

import { relative } from "node:path";
import type { BunPlugin } from "bun";
import { CodeGen } from "./codegen.ts";

interface PluginArgs {
    generatedDir: string;
    filter: RegExp;
}

export default function plugin(args: PluginArgs = {
    generatedDir: "ai-gen",
    filter: /\.ai\./
}): BunPlugin {
    return {
        name: "ai-codegen",
        async setup(build) {
            const { generatedDir, filter } = args;

            await mkdir(generatedDir, { recursive: true });

            const codeGen = new CodeGen(generatedDir);

            build.onLoad({ filter, namespace: "file" }, async (args) => {
                const relpath = relative(process.cwd(), args.path);
                return await codeGen.handle(relpath);
            });
        },
    };
}

