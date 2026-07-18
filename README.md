# AI Codegen as a Compile step

## Motivation (Problem statement)

Today, the use of AI coding agents to generate substantial portions of a project is catching on quite rapidly in the industry. 

With that, the following sentiment is also on the rise among us, software engineers: As people who honed the craft during the pre-AI days, the use of coding agents feels like an awkward dance between lucidity (when you are writing code by hand) and insanity (when you are letting the AI take the reins). My personal experience is that this has both cognitive and emotional impact (not pleasant).

Talking about delegating work to something else, let's contrast the use of AI coding agents with using a third party library. Even during pre-AI days, using libraries was quite common. While that is also a form of delegation of work, clearly it doesn't feel the same way. I reason this is because: When using a library we are working with a **well understood abstraction**; where as, when using a coding agent, we are not working with **no abstraction what so ever**.

I contend that **we need both separation and abstraction when it comes to AI generated code**.

I am proposing here a way of arranging the codebase in such a way that AI generated parts are kept clearly isolated from the rest of the project.

## Solution sketch

With the problem statement described, here are some high level requirements that could be helpful to sketch out the contours of a solution:

1. Separation: Make it possible to clearly separate AI generated code from the rest of the project at least at the file level
2. Interopability: Provide as much flexibility as possible when it comes to human written code invoking AI generated code and vice versa
3. Preserve the inputs: Preserve the specification that produced the AI generated code as a first class artifact in the codebase
4. AI generation as a compile step: Human editing the AI generated part of the project should never be needed. Instead, steering the AI generation should involve editing the specification and invoking a build/compile step (an LLM or coding agent should be involved only at this step).
5. Efficiency: Allow incremental changes to the AI generated part of the codebase - that is, use of AI tokens should be efficient and involve only (re)generation of the parts that really need to change.

## This Demo

A system that uses [Bun's](https://bun.com/) [Bundler api](https://bun.com/docs/bundler) to implement the system illustrated by the diagram below:

![System overview](./docs/idea.excalidraw.png)

The system looks for files of the pattern `*.ai.*` and submits those files to AI for "completion" before adding them to the bundle. The prompt used is along the lines of:

```
you should provide the complete implementation of <path/to/file>
```

### Pre-requisites

You need [Bun](https://bun.com/).

```
curl -fsSL https://bun.com/install | bash
```

You need the pi.dev coding agent available as `pi` in the shell. See [pi's documentation](https://pi.dev/).

To do this, setup a Nodejs environment and globally install pi:

Example:

```
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Next, you need to ensure `pi` is properly connected to an AI provider.

For example you could setup a valid `OPENAI_API_KEY` variable in the environment.

To test that pi works:

```
pi -p "say hello"
```

This should run without error.

### Usage

To install dependencies:

```bash
bun install
```

Assuming your environment already has the necessary token setup to access the AI API (see pre-requisites above).

```bash
bun compile
```

This command will trigger a bundling that involes the `pi` agent and will put the built output in `./build`

Finally, to execute the generated bundle:

```bash
bun start
```

Optionally, during the development process you may also do a typecheck by the TypeScript compiler using:

```
bun typecheck
```

Note: this typecheck's the original sources (i.e. before AI completes the missing parts).
