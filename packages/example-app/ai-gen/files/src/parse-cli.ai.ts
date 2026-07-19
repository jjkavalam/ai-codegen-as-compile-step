import { z } from "zod";
import type { AddArgs, CliCommands, RemoveArgs } from "./types/cli";
import { CliCommands as Commands } from "./types/cli";

type Cli = 
    | { command: CliCommands.Add, args: AddArgs }
    | { command: CliCommands.Remove, args: RemoveArgs }

// parse the CLI flags passed in and return
// or fail with error if unknown command or otherwise parse fails
// use zod for validation
// ensure; you are show usage information clearly if validation fails.
// organise code neatly using helper functions.
export default async function parse(): Promise<Cli> {
    const commandSchema = z.enum([Commands.Add, Commands.Remove]);

    const addArgsSchema = z.object({
        title: z.string().min(1),
        contents: z.string().min(1),
    }).strict();

    const removeArgsSchema = z.object({
        title: z.string().min(1),
    }).strict();

    function usage(): string {
        const executable = process.argv[1]?.split(/[\\/]/).pop() ?? "app";

        return [
            "Usage:",
            `  ${executable} add --title <title> --contents <contents>`,
            `  ${executable} remove --title <title>`,
            "",
            "Commands:",
            "  add       Add an item. Requires --title and --contents.",
            "  remove    Remove an item. Requires --title.",
        ].join("\n");
    }

    function fail(message: string): never {
        throw new Error(`${message}\n\n${usage()}`);
    }

    function formatZodError(error: z.ZodError): string {
        return error.issues
            .map((issue) => {
                const path = issue.path.join(".");

                return path.length > 0
                    ? `${path}: ${issue.message}`
                    : issue.message;
            })
            .join("\n");
    }

    function parseFlags(flags: string[]): Record<string, string> {
        const parsed: Record<string, string> = {};

        for (let i = 0; i < flags.length; i++) {
            const token = flags[i];

            if (!token.startsWith("--")) {
                fail(`Unexpected argument: ${token}`);
            }

            const withoutPrefix = token.slice(2);
            const separatorIndex = withoutPrefix.indexOf("=");

            let key: string;
            let value: string;

            if (separatorIndex >= 0) {
                key = withoutPrefix.slice(0, separatorIndex);
                value = withoutPrefix.slice(separatorIndex + 1);
            } else {
                key = withoutPrefix;
                const next = flags[i + 1];

                if (next === undefined || next.startsWith("--")) {
                    fail(`Missing value for flag: --${key}`);
                }

                value = next;
                i++;
            }

            if (key.length === 0) {
                fail(`Invalid flag: ${token}`);
            }

            if (key in parsed) {
                fail(`Duplicate flag: --${key}`);
            }

            parsed[key] = value;
        }

        return parsed;
    }

    function parseCommand(rawCommand: string | undefined): CliCommands {
        const result = commandSchema.safeParse(rawCommand);

        if (!result.success) {
            fail(rawCommand === undefined
                ? "Missing command."
                : `Unknown command: ${rawCommand}`);
        }

        return result.data;
    }

    function parseArgs<T>(schema: z.ZodType<T>, flags: Record<string, string>): T {
        const result = schema.safeParse(flags);

        if (!result.success) {
            fail(`Invalid arguments:\n${formatZodError(result.error)}`);
        }

        return result.data;
    }

    const [rawCommand, ...rawFlags] = process.argv.slice(2);
    const command = parseCommand(rawCommand);
    const flags = parseFlags(rawFlags);

    switch (command) {
        case Commands.Add:
            return {
                command: Commands.Add,
                args: parseArgs(addArgsSchema, flags),
            };
        case Commands.Remove:
            return {
                command: Commands.Remove,
                args: parseArgs(removeArgsSchema, flags),
            };
    }
}
