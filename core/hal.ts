// core/hal.ts

import { GoogleGenAI, GenerateContentResponse, Modality, Type, FunctionDeclaration } from "@google/genai";
import { AuraState, TscError } from '../types.ts';
import { MathJS } from './hal_mathjs.ts';
import { NumericJS } from './hal_numericjs.ts';
import { Lean } from './hal_lean.ts';

// This tells TypeScript that these objects will be available globally from the CDN scripts.
declare const ts: any;
declare const THREE: any;
declare const polygonClipping: any;
declare const p5: any;
declare const d3: any;
declare const Tone: any;
declare const Papa: any;
declare const Tesseract: any;
declare const pdfLib: any;
declare const cocoSsd: any;


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

// --- HAL (Hardware Abstraction Layer) Object ---
export const HAL = {
    Memristor: {
        saveState: async (state: AuraState): Promise<void> => {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put(state, STATE_KEY);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },
        loadState: async (): Promise<AuraState | null> => {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(STATE_KEY);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        },
        clearDB: async (): Promise<void> => {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    },
    Gemini: {
        editImage: async (base64ImageData: string, mimeType: string, prompt: string): Promise<string | null> => {
            const ai = getAI();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64ImageData, mimeType: mimeType } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
        
            const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
            if (imagePart && imagePart.inlineData) {
                const mime = imagePart.inlineData.mimeType;
                const data = imagePart.inlineData.data;
                return `data:${mime};base64,${data}`;
            }
            return null;
        },
        fetchVideoData: async (downloadLink: string): Promise<Blob> => {
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                throw new Error(`Failed to download video: ${response.statusText}`);
            }
            return response.blob();
        },
    },
    Tools: {
        typescript_check_types: async (vfs: { [filePath: string]: string }, filePaths: string[]): Promise<TscError[]> => {
            if (typeof ts === 'undefined') {
                throw new Error("TypeScript compiler is not loaded.");
            }
            const options = {
                noEmit: true,
                target: ts.ScriptTarget.ESNext,
                module: ts.ModuleKind.ESNext,
                jsx: ts.JsxEmit.React,
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
            };
            const host = {
                getSourceFile: (fileName: string) => {
                    const content = vfs[fileName];
                    return content ? ts.createSourceFile(fileName, content, options.target) : undefined;
                },
                writeFile: () => {},
                getDefaultLibFileName: () => "lib.d.ts",
                useCaseSensitiveFileNames: () => true,
                getCanonicalFileName: (fileName: string) => fileName,
                getCurrentDirectory: () => "",
                getNewLine: () => "\\n",
                fileExists: (fileName: string) => vfs[fileName] !== undefined,
                readFile: (fileName: string) => vfs[fileName],
            };

            const program = ts.createProgram(filePaths, options, host);
            const emitResult = program.emit();
            const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

            return allDiagnostics.map((diagnostic: any) => {
                const { line, character } = diagnostic.file ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start) : { line: 0, character: 0 };
                return {
                    file: diagnostic.file?.fileName || 'unknown',
                    line: line + 1,
                    character: character + 1,
                    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\\n'),
                };
            });
        },
    },
    Geometry: {
        runBooleanOp: async (polyA: number[][], polyB: number[][], operation: 'union' | 'intersection' | 'difference' | 'xor') => {
            if (typeof polygonClipping === 'undefined') {
                throw new Error("polygon-clipping library is not loaded.");
            }
            return polygonClipping[operation]([polyA], [polyB]);
        },
        runMeshAnalysis: async (meshType: 'box' | 'sphere', parameters: any) => {
            if (typeof THREE === 'undefined') {
                throw new Error("Three.js library is not loaded.");
            }
            let geometry;
            if (meshType === 'box') {
                geometry = new THREE.BoxGeometry(parameters.width || 1, parameters.height || 1, parameters.depth || 1);
            } else if (meshType === 'sphere') {
                geometry = new THREE.SphereGeometry(parameters.radius || 1);
            } else {
                throw new Error(`Unsupported mesh type: ${meshType}`);
            }
            geometry.computeBoundingBox();
            return { boundingBox: geometry.boundingBox };
        },
    },
    UI: {
        confirm: (message: string): boolean => window.confirm(message),
    },
    System: {
        reload: (): void => window.location.reload(),
    },
    Clipboard: {
        writeText: (text: string): Promise<void> => navigator.clipboard.writeText(text),
    },
    FileSystem: {
        createObjectURL: (file: File): string => URL.createObjectURL(file),
        revokeObjectURL: (url: string): void => URL.revokeObjectURL(url),
    },
    MathJS,
    NumericJS,
    Lean,
};
