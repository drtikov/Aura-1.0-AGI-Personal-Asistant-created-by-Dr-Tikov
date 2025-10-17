// core/hal.ts

import { GoogleGenAI, GenerateContentResponse, Modality, Type, FunctionDeclaration } from "@google/genai";
// FIX: Import missing AuraState type.
import { AuraState } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
    if (ai) return ai;
    if (process.env.API_KEY) {
        try {
            ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            return ai;
        } catch (error) {
            console.error("HAL: Failed to initialize GoogleGenAI:", error);
            throw new Error("Failed to initialize Gemini API. Check API Key.");
        }
    }
    console.error("HAL: API_KEY environment variable not set.");
    throw new Error("API_KEY environment variable not set.");
};

// --- Memristor (IndexedDB) Module ---
const DB_NAME = 'AuraMemristorDB';
const DB_VERSION = 1;
const STORE_NAME = 'AuraStateStore';
const STATE_KEY = 'latest_aura_state';
let db: IDBDatabase | null = null;

const getDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => {
            console.error("HAL.Memristor: IndexedDB error:", request.error);
            reject("IndexedDB error");
        };
        request.onsuccess = () => { db = request.result; resolve(db); };
        request.onupgradeneeded = () => {
            const dbInstance = request.result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME);
            }
        };
    });
};

const Memristor = {
    saveState: (state: AuraState): Promise<void> => {
        return new Promise((resolve, reject) => {
            getDB().then(dbInstance => {
                const tx = dbInstance.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const request = store.put(state, STATE_KEY);
                request.onsuccess = () => resolve();
                request.onerror = () => {
                    console.error("HAL.Memristor: Save failed:", request.error);
                    reject("Save failed");
                };
            }).catch(reject);
        });
    },
    loadState: (): Promise<AuraState | null> => {
        return new Promise((resolve) => {
            getDB().then(dbInstance => {
                try {
                    const tx = dbInstance.transaction([STORE_NAME], 'readonly');
                    const store = tx.objectStore(STORE_NAME);
                    const request = store.get(STATE_KEY);
                    request.onsuccess = () => resolve(request.result || null);
                    request.onerror = () => {
                        console.error("HAL.Memristor: Load failed:", request.error);
                        resolve(null);
                    };
                } catch (error) {
                    console.error("HAL.Memristor: Error during transaction", error);
                    resolve(null);
                }
            }).catch(() => resolve(null));
        });
    },
    clearDB: (): Promise<void> => {
        return new Promise((resolve, reject) => {
            getDB().then(dbInstance => {
                const tx = dbInstance.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => {
                    console.error("HAL.Memristor: Clear failed:", request.error);
                    reject("Clear failed");
                };
            }).catch(reject);
        });
    }
};

// --- Gemini API Module ---
const Gemini = {
    generateContent: async (
        contents: any, 
        systemInstruction: string,
        tools?: {functionDeclarations: FunctionDeclaration[]}[]
    ): Promise<GenerateContentResponse> => {
        const ai = getAI();
        
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction,
                ...(tools && tools.length > 0 && { tools: tools })
            }
        });
    },
    generateContentWithSchema: async (prompt: string, schema: any): Promise<GenerateContentResponse> => {
        const ai = getAI();
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
    },
    generateImages: async (prompt: string, config: any): Promise<any> => {
        const ai = getAI();
        return await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config,
        });
    },
    editImage: async (base64ImageData: string, mimeType: string, prompt: string): Promise<any> => {
        const ai = getAI();
        return await ai.models.generateContent({
            // FIX: Updated model name to 'gemini-2.5-flash-image' as per API guidelines.
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType } },
                    { text: prompt },
                ],
            },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });
    },
    generateVideos: async (prompt: string): Promise<any> => {
        const ai = getAI();
        return await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt,
            config: { numberOfVideos: 1 }
        });
    },
    getVideosOperation: async (operation: any): Promise<any> => {
        const ai = getAI();
        return await ai.operations.getVideosOperation({ operation });
    },
    fetchVideoData: async (downloadLink: string): Promise<Blob> => {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        return await response.blob();
    },
};

// --- Browser API Modules ---
const Clipboard = {
    writeText: (text: string): Promise<void> => navigator.clipboard.writeText(text),
};

const FileSystem = {
    createObjectURL: (blob: Blob | MediaSource): string => URL.createObjectURL(blob),
    revokeObjectURL: (url: string): void => URL.revokeObjectURL(url),
    readFileAsBase64: (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },
};

const UI = {
    confirm: (message: string): boolean => window.confirm(message),
};

const System = {
    reload: (): void => window.location.reload(),
};

const Microphone = {
    start: (): Promise<any> => {
        // Placeholder for future implementation
        console.warn("HAL.Microphone.start() is not implemented.");
        return Promise.reject("Not implemented");
    },
};


// --- HAL Export ---
export const HAL = {
    Gemini,
    Memristor,
    Clipboard,
    FileSystem,
    UI,
    System,
    Microphone,
};