class Logger {
    private currRelPath?: string;
    constructor() {
    }
    async logSessionStart(sessionId: string) {
        console.log("pi.dev session name:", sessionId);
        console.log(`To inspect session later use: pi --session ${sessionId} `)
    }
    async logStart(relpath: string) {
        this.currRelPath = relpath;
        return this.write(`Compiling ${relpath}`);
    }
    async logNoCompileNeeded() {
        return this.write(` ... Use cached\n`);
    }
    async logAIGenStarted() {
        return this.write(` ... Invoke LLM ...`);
    }
    async logAIGenComplete() {
        return this.write(` Done\n`);
    }

    private async write(msg: string) {
        await Bun.write(Bun.stdout, msg);
    }
}

export default new Logger();