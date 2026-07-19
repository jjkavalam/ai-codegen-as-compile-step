// integration with AI coding agent

import { $ } from "bun";

interface AgentArgs {
    relpath: string; 
    sessionId: string;  
    existing?: string;
}

// BUG: https://github.com/earendil-works/pi/issues/6825
// This system prompt is not actually applied
const systemPrompt = `
You are an expert coding assistant operating inside pi, a coding agent harness. 
You help users by reading files and generating code.

Available tools:
- read: Read file contents

Guidelines:
- Be concise in your responses
- Show file paths clearly when working with files
`;

export async function runAiAgentFileCompletion({ relpath, sessionId, existing }: AgentArgs) {

    const prompt = `you should provide the complete implementation of ${relpath}.  

In working out the implementation, first read the existing state of the file which should give you
the outline that you need to strictly follow. You may also read any other files directly referenced by it (if really necessary).

Do not modify the file itself instead just output the final contents (do not produce any other output).

${!existing ? '' : 
`Note that, you had created a completion of this file last time around; but for a different input. 
However, i am still providing it as a reference below so that you can reuse that content whereever possible;
changing only those parts that do not apply anymore.
<existing_content>
${existing}
</existing_content>
`
}

`;

    try {

        return await $`pi \
        --system-prompt ${systemPrompt} \
        --session-id ${sessionId} \
        --tools read --no-skills \
        -p ${prompt}`.text();

    } catch(err) {
        if (err instanceof $.ShellError) {
            throw new Error(`pi.dev failed: ${err.stderr}`)
        }
        throw new Error(`pi.dev failed`, { cause: err })
    }
}