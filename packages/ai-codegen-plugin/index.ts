import { relative } from "node:path";
import type { BunPlugin } from "bun";
import { CodeGen } from "./codegen.ts";

interface PluginArgs {
    generatedDir: string;
    filter: RegExp;
}

export default function plugin(args: Partial<PluginArgs> = {}): BunPlugin {

    const { 
        generatedDir = "ai-gen", 
        filter = /\.ai\./
    } = args;

    const codeGen = new CodeGen(generatedDir);

    return {
        name: "ai-codegen",
        async setup(build) {

            build.onLoad({ filter, namespace: "file" }, async (args) => {
                const relpath = relative(process.cwd(), args.path);
                return await codeGen.handle(relpath);
            });

            build.onEnd(async (result) => {
                await codeGen.onEnd();
                console.log(`Build success: ${result.success}`);
            })

        },
    };
}

