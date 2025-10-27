// core/apa_manager.ts
import { InternalState } from '../types.ts';

type GunaReasonResult = { key: string; options?: any };

class APAManager {
    private worker: Worker;
    private pendingRequests: Map<string, (result: GunaReasonResult) => void> = new Map();

    constructor() {
        // FIX: The path should be relative to the root HTML file, not the current module.
        this.worker = new Worker('/core/apa.worker.ts', { type: 'module' });

        this.worker.onmessage = (event: MessageEvent<{ id: string; type: string; payload: GunaReasonResult }>) => {
            const { id, payload } = event.data;
            const resolve = this.pendingRequests.get(id);
            if (resolve) {
                resolve(payload);
                this.pendingRequests.delete(id);
            }
        };

        this.worker.onerror = (error) => {
            console.error("APA Worker Error:", error.message, `at ${error.filename}:${error.lineno}`);
        };
    }

    public calculateGunaReason(internalState: InternalState): Promise<GunaReasonResult> {
        return new Promise((resolve) => {
            const id = self.crypto.randomUUID();
            this.pendingRequests.set(id, resolve);
            this.worker.postMessage({ id, type: 'CALCULATE_GUNA_REASON', payload: internalState });
        });
    }
}

export const apaManager = new APAManager();