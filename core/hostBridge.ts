// core/hostBridge.ts

/**
 * The Host Bridge provides a standardized interface for Aura to communicate
 * with the host Code Assistant environment. It abstracts away the direct
 * calls to `window.codeAssistant` and provides graceful fallbacks.
 */

// The global `window.codeAssistant` interface is now defined in `types.ts` to avoid conflicts.

const isHostConnected = (): boolean => {
    return typeof window.codeAssistant !== 'undefined' &&
           typeof window.codeAssistant.readFile === 'function' &&
           typeof window.codeAssistant.writeFile === 'function';
};

const readHostFile = async (path: string): Promise<string> => {
    if (!isHostConnected()) {
        throw new Error("Host Bridge is not connected.");
    }
    try {
        return await window.codeAssistant!.readFile(path);
    } catch (error) {
        console.error(`Host Bridge: Failed to read file '${path}'`, error);
        throw error;
    }
};

const writeHostFile = async (path: string, content: string): Promise<void> => {
    if (!isHostConnected()) {
        throw new Error("Host Bridge is not connected.");
    }
    try {
        await window.codeAssistant!.writeFile(path, content);
    } catch (error) {
        console.error(`Host Bridge: Failed to write file '${path}'`, error);
        throw error;
    }
};

export const HostBridge = {
    isHostConnected,
    readHostFile,
    writeHostFile,
};
