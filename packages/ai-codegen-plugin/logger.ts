class Logger {
    private sessionId?: string;
    constructor() {
    }
    async logSessionStart(sessionId: string) {
        // we just save this for now;
        // will log it at the end
        this.sessionId = sessionId;
    }
    async logStart(relpath: string) {
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
    async logSessionEnd() {
        if (!this.sessionId) return;
        console.log();
        console.log("pi.dev session name:", this.sessionId);
        console.log(`   To inspect session: pi --session ${this.sessionId} `)
        console.log(`   After opening the session in pi, you can run "/export" command to get an html report`);
        console.log(`   (Note that the system prompt shown in the report is misleading,`);
        console.log(`    See ai-codegen-plugin/agent.ts for actual system prompt.)`);
        console.log();
    }

    private async write(msg: string) {
        await Bun.write(Bun.stdout, msg);
    }
}

export default new Logger();