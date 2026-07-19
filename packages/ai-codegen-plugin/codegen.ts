import hash from "./hash.ts";
import { runAiAgentFileCompletion } from "./agent.ts";
import { GeneratedStore } from "./generated.ts";
import logger from "./logger.ts";

export class CodeGen {
    private generatedStore: GeneratedStore;
    private _sessionId: string | undefined;

    constructor(generatedDir: string) {
        this.generatedStore = new GeneratedStore(generatedDir);
    }

    async sessionId(): Promise<string> {

        if (!this._sessionId) {
            const sessionId = `compile-${Date.now()}`;
            await logger.logSessionStart(sessionId);
            this._sessionId = sessionId;
        }

        return this._sessionId;
    }

    async handle(relpath: string) {
      await logger.logStart(relpath);

      const existing = await this.generatedStore.findByPath(relpath);

      if (existing) {
        const thisInputHash = await hash(relpath);
        if (thisInputHash === existing.inputHash) {
          await logger.logNoCompileNeeded();
          return {
            contents: existing.generatedContents
          }
        }
      }

      await logger.logAIGenStarted();
      // need to (re)generate; provide existing as a reference (if it exists)
      const sessionId = await this.sessionId();

      const newGeneratedContents = await runAiAgentFileCompletion({ relpath, sessionId, existing: existing?.generatedContents });

      // now write this to the generated directory; as well as update the manifest
      await this.generatedStore.update(relpath, newGeneratedContents);

      await logger.logAIGenComplete();

      return {
        contents: newGeneratedContents,
      };
    }
}



