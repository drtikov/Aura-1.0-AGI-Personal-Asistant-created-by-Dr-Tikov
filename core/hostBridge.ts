// core/hostBridge.ts

// This file defines the Host Bridge, an interface for Aura to communicate
// with a parent "Code Assistant" environment, if it's running inside one.

// Define the shape of the API that the host environment is expected to provide.
declare global {
  interface Window {
    codeAssistant?: {
      /**
       * Writes content to a specified file in the user's live project workspace.
       * @param filePath The relative path to the file from the project root.
       * @param content The new content to write to the file.
       * @returns A promise that resolves when the file is written, or rejects with an error.
       */
      writeFile: (filePath: string, content: string) => Promise<void>;
      
      /**
       * Recursively lists all files and directories under a given path.
       */
      listFiles: (path: string) => Promise<string[]>;

      /**
       * Executes a shell command within the host project's context.
       */
      runCommand: (command: string, args?: string[]) => Promise<{ stdout: string; stderr: string; exitCode: number }>;

      /**
       * Requests the host IDE to open a specific file in the editor.
       */
      openFile: (path: string) => Promise<void>;
    };
  }
}

/**
 * The HostBridge provides a safe, abstracted way to interact with the host
 * IDE environment. It checks for the existence of the `window.codeAssistant` API
 * before attempting to use it.
 */
export const HostBridge = {
  /**
   * Checks if Aura is running within a compatible host environment with writeFile support.
   * @returns `true` if the host API is available, `false` otherwise.
   */
  isHostConnected: (): boolean => {
    return typeof window.codeAssistant !== 'undefined' && typeof window.codeAssistant.writeFile === 'function';
  },

  /**
   * Checks if the host environment supports the full V2 API.
   * @returns `true` if all V2 functions are available.
   */
  isV2Connected: (): boolean => {
    return (
      typeof window.codeAssistant !== 'undefined' &&
      typeof window.codeAssistant.writeFile === 'function' &&
      typeof window.codeAssistant.listFiles === 'function' &&
      typeof window.codeAssistant.runCommand === 'function' &&
      typeof window.codeAssistant.openFile === 'function'
    );
  },

  /**
   * Writes content to a file in the host project's file system.
   * @param filePath The relative path to the file.
   * @param content The content to write.
   * @returns A promise that resolves on success or rejects on failure.
   */
  writeFile: (filePath: string, content: string): Promise<void> => {
    if (typeof window.codeAssistant?.writeFile === 'function') {
      return window.codeAssistant.writeFile(filePath, content);
    } else {
      console.warn(`HostBridge: 'writeFile' is not available. Simulating write for ${filePath}.`);
      return Promise.resolve();
    }
  },
  
  /**
   * Recursively lists all files and directories under a given path in the host project.
   * @param path The root path to start listing from.
   * @returns A promise that resolves to an array of full file paths.
   */
  listFiles: (path: string): Promise<string[]> => {
    if (typeof window.codeAssistant?.listFiles === 'function') {
      return window.codeAssistant.listFiles(path);
    } else {
       console.warn(`HostBridge: 'listFiles' is not available. Returning empty array for ${path}.`);
      return Promise.resolve([]);
    }
  },

  /**
   * Executes a shell command within the host project's context.
   * @param command The command to run.
   * @param args Optional array of string arguments for the command.
   * @returns A promise that resolves to an object containing the command's output.
   */
  runCommand: (command: string, args?: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> => {
    if (typeof window.codeAssistant?.runCommand === 'function') {
      return window.codeAssistant.runCommand(command, args);
    } else {
      const fullCommand = `${command} ${ (args || []).join(' ')}`;
      console.warn(`HostBridge: 'runCommand' is not available. Simulating successful run for '${fullCommand}'.`);
      return Promise.resolve({ stdout: `Simulated success for: ${fullCommand}`, stderr: '', exitCode: 0 });
    }
  },

  /**
   * Requests the host IDE to open a specific file in the editor.
   * @param path The full path of the file to open.
   * @returns A promise that resolves when the action is completed.
   */
  openFile: (path: string): Promise<void> => {
    if (typeof window.codeAssistant?.openFile === 'function') {
      return window.codeAssistant.openFile(path);
    } else {
      console.warn(`HostBridge: 'openFile' is not available. Simulating open for ${path}.`);
      return Promise.resolve();
    }
  },
};