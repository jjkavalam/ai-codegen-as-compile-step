import parse from "./parse-cli.ai.ts";
import { CliCommands } from "./types/cli.ts";
import { add, remove } from "./commands.ai.ts";

async function main() {
    const cli = await parse();
   
    switch (cli.command) {
        case CliCommands.Add: {
            const { title, contents } = cli.args;
            await add(title, contents);
            break;
        }
        case CliCommands.Remove: {
            const { title } = cli.args;
            await remove(title);
            break;
        }
        default:
            throw "Unimplemented";
    }

    console.log("Done");
}

main().catch(console.error);