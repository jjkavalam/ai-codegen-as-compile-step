import { readdirSync } from "node:fs";

/**
 * List all files in the current working directory that has a .ts extension.
 * If DIR environment variable is set; look there instead.
 */
export function listTsFiles(): string[] {
    const dir = process.env.DIR ?? process.cwd();

    return readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
        .map((entry) => entry.name);
}
