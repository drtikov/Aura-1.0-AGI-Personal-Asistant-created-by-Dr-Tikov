// core/apa_manager.ts
import { InternalState } from '../types.ts';

type GunaReasonResult = { key: string; options?: any };

class APAManager {
    private worker: Worker;
    private pendingRequests: Map<string, (result: GunaReasonResult) => void> = new Map();

    constructor() {
        // FIX: The URL constructor with import.meta.url can be brittle in some environments.
        // The simpler string path is more robust for creating a module worker.
        this.worker = new Worker('./apa.worker.ts', { type: 'module' });

        this.worker.onmessage = (event: MessageEvent<{ id: string; type: string; payload: GunaReasonResult }>) => {
            const { id, payload } = event.data;
            const resolve = this.pendingRequests.get(id);
            if (resolve) {
                resolve(payload);
                this.pendingRequests.delete(id);
            }
        };

        this.worker.onerror = (error) => {
            console.error("APA Worker Error:", error);
            // Optionally, you could reject all pending promises here.
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
