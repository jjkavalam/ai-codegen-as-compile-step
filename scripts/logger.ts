class Logger {
    private currRelPath?: string;
    constructor() {
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