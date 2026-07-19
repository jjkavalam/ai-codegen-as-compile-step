import { z } from "zod";
import type { AddArgs, CliCommands, RemoveArgs } from "./types/cli";

type Cli = 
    | { command: CliCommands.Add, args: AddArgs }
    | { command: CliCommands.Remove, args: RemoveArgs }

// parse the CLI flags passed in and return
// or fail with error if unknown command or otherwise parse fails
// use zod for validation
// ensure; you are show usage information clearly if validation fails.
// organise code neatly using helper functions.
export default async function parse(): Promise<Cli> {
    throw "TODO";
}