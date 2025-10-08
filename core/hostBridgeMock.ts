// core/hostBridgeMock.ts

// This file creates a mock of the 'window.codeAssistant' object for use in a standard web browser.
// It simulates the file system and command execution functionalities that a real
// host environment (like a dedicated code assistant) would provide.

import { HAL } from './hal';

const setupHostBridgeMock = () => {
    // Only create the mock if the real object doesn't exist.
    if (window.codeAssistant) {
        console.log("Real Host Bridge detected. Mock will not be installed.");
        return;
    }

    console.log("Installing Mock Host Bridge (window.codeAssistant). File write operations will trigger downloads.");

    window.codeAssistant = {
        /**
         * Simulates writing a file by triggering a download.
         * The user can then manually save the file to their project.
         */
        writeFile: async (path: string, content: string): Promise<void> => {
            console.log(`[Host Bridge Mock] writeFile called for path: ${path}`);
            return new Promise((resolve) => {
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = HAL.FileSystem.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // Use the file path to suggest a name, falling back to a default.
                a.download = path.split('/').pop() || 'file.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                HAL.FileSystem.revokeObjectURL(url);
                resolve();
            });
        },

        /**
         * Simulates reading a file. This is a placeholder as we cannot access the user's file system.
         * It throws an error to encourage fallback to the VFS.
         */
        readFile: async (path: string): Promise<string> => {
            console.warn(`[Host Bridge Mock] readFile for "${path}" is not possible from a browser. An error will be thrown to allow VFS fallback.`);
            throw new Error("Mock Host Bridge cannot read from the live file system.");
        },

        /**
         * Simulates listing files. This is a placeholder as we cannot access the user's file system.
         * It throws an error.
         */
        listFiles: async (): Promise<string[]> => {
             console.warn(`[Host Bridge Mock] listFiles is not possible from a browser. An error will be thrown.`);
             throw new Error("Mock Host Bridge cannot list files from the live file system.");
        },
        
        /**
         * Simulates running a command. Returns a mock success message.
         */
        runCommand: async (command: string): Promise<any> => {
            console.log(`[Host Bridge Mock] runCommand called with: "${command}"`);
            const mockOutput = `Simulated execution of command: "${command}"\nStatus: OK`;
            return Promise.resolve({
                stdout: mockOutput,
                stderr: '',
                exitCode: 0,
            });
        },
    };
};

// Immediately execute the setup function when this module is loaded.
setupHostBridgeMock();

// Export something to make it a module and allow type checking.
export const mockHostBridge = true;
