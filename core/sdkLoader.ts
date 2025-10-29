// core/sdkLoader.ts

interface SdkConfig {
    url: string | string[]; // Can be a single URL or an array for dependencies/multiple files
    globalName: string;
    type?: 'script' | 'style';
}

const sdkRegistry: Record<string, SdkConfig> = {
    anime: { url: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js', globalName: 'anime' },
    jszip: { url: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', globalName: 'JSZip' },
    d3: { url: 'https://cdn.jsdelivr.net/npm/d3@7', globalName: 'd3' },
    tfjs: { url: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js', globalName: 'tf' },
    cocoSsd: { url: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@latest/dist/coco-ssd.min.js', globalName: 'cocoSsd' },
    tone: { url: 'https://unpkg.com/tone@14.7.77/build/Tone.js', globalName: 'Tone' },
    mermaid: { url: 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js', globalName: 'mermaid' },
    papaparse: { url: 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js', globalName: 'Papa' },
    tesseract: { url: 'https://unpkg.com/tesseract.js@v5.0.0/dist/tesseract.min.js', globalName: 'Tesseract' },
    mathjs: { url: 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.1/math.js', globalName: 'math' },
    pdfjs: { url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js', globalName: 'pdfjsLib' },
    numericjs: { url: 'https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js', globalName: 'numeric' },
    typescript: { url: 'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.4.5/typescript.min.js', globalName: 'ts' },
    three: { url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.161.0/three.min.js', globalName: 'THREE' },
    polygonClipping: { url: 'https://cdn.jsdelivr.net/npm/polygon-clipping@0.15.3/dist/polygon-clipping.min.js', globalName: 'polygonClipping' },
    p5: { url: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js', globalName: 'p5' },
    rapier: { url: 'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.11.2/dist/rapier.js', globalName: 'RAPIER' },
    jscodeshift: { url: 'https://unpkg.com/jscodeshift@0.15.1/dist/jscodeshift.js', globalName: 'jscodeshift' },
    eslint: { url: 'https://unpkg.com/eslint@8.57.0/lib/linter/linter.js', globalName: 'Linter' },
    natural: { url: 'https://unpkg.com/natural@6.10.4/dist/natural.min.js', globalName: 'natural' },
    opencv: { url: 'https://docs.opencv.org/4.9.0/opencv.js', globalName: 'cv' },
    mediapipe: { url: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.js', globalName: 'vision' },
    sqljs: { url: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js', globalName: 'initSqlJs' },
    arrow: { url: 'https://unpkg.com/apache-arrow@15.0.0/Arrow.es2015.min.js', globalName: 'arrow' },
    onnx: { url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js', globalName: 'ort' },
    prettier: { url: ['https://unpkg.com/prettier@2.8.8/standalone.js', 'https://unpkg.com/prettier@2.8.8/parser-typescript.js'], globalName: 'prettierPlugins' },
    vega: { url: ['https://cdn.jsdelivr.net/npm/vega@5', 'https://cdn.jsdelivr.net/npm/vega-lite@5', 'https://cdn.jsdelivr.net/npm/vega-embed@6'], globalName: 'vegaEmbed' },
    phaser: { url: 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js', globalName: 'Phaser' },
    leaflet_css: { url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', globalName: 'L', type: 'style' },
    leaflet: { url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', globalName: 'L' },
    katex_css: { url: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css', globalName: 'katex', type: 'style' },
    katex: { url: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js', globalName: 'katex' },
    marked: { url: 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js', globalName: 'marked' },
    jspdf: { url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', globalName: 'jspdf' },
};

type SdkStatus = 'idle' | 'loading' | 'loaded' | 'error';
const sdkStatus: Record<string, SdkStatus> = Object.keys(sdkRegistry).reduce((acc, key) => {
    acc[key] = 'idle';
    return acc;
}, {} as Record<string, SdkStatus>);

const pendingPromises: Record<string, ((value?: any) => void)[]> = {};
type StatusListener = (statuses: Record<string, SdkStatus>) => void;
const listeners: StatusListener[] = [];

function notifyListeners() {
    listeners.forEach(listener => listener(sdkStatus));
}

export function getSdkStatus() {
    return { ...sdkStatus };
}

export function subscribeToSdkStatus(callback: StatusListener) {
    listeners.push(callback);
}

export function unsubscribeFromSdkStatus(callback: StatusListener) {
    const index = listeners.indexOf(callback);
    if (index > -1) {
        listeners.splice(index, 1);
    }
}


function loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
            script.remove();
            resolve();
        };
        script.onerror = () => {
            script.remove();
            reject(new Error(`Failed to load script: ${url}`));
        };
        document.head.appendChild(script);
    });
}

function loadStyle(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load style: ${url}`));
        document.head.appendChild(link);
    });
}

export async function loadSdk(sdkId: string): Promise<void> {
    if (sdkStatus[sdkId] === 'loaded') {
        return Promise.resolve();
    }

    if (sdkStatus[sdkId] === 'loading') {
        return new Promise(resolve => {
            if (!pendingPromises[sdkId]) {
                pendingPromises[sdkId] = [];
            }
            pendingPromises[sdkId].push(resolve);
        });
    }

    const config = sdkRegistry[sdkId];
    if (!config) {
        return Promise.reject(new Error(`SDK with id '${sdkId}' not found in registry.`));
    }
    
    // Handle leaflet's CSS dependency
    if (sdkId === 'leaflet') {
       await loadSdk('leaflet_css').catch(console.error);
    }

    sdkStatus[sdkId] = 'loading';
    notifyListeners();
    pendingPromises[sdkId] = [];

    try {
        const urls = Array.isArray(config.url) ? config.url : [config.url];
        for (const url of urls) {
            if (config.type === 'style') {
                await loadStyle(url);
            } else {
                await loadScript(url);
            }
        }

        // Special initialization logic for certain libraries
        if (sdkId === 'pdfjs' && typeof (window as any).pdfjsLib !== 'undefined') {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        }
        if (sdkId === 'mermaid' && typeof (window as any).mermaid !== 'undefined') {
            (window as any).mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        }
        
        // Check for global variable if it's a script
        if (config.type !== 'style' && typeof (window as any)[config.globalName] === 'undefined') {
            // A special case for leaflet, where CSS and JS expose the same global, so we don't error if only CSS is loaded
            if (sdkId !== 'leaflet_css') {
                 throw new Error(`SDK '${sdkId}' loaded, but global '${config.globalName}' not found.`);
            }
        }
        
        sdkStatus[sdkId] = 'loaded';
        notifyListeners();
        pendingPromises[sdkId].forEach(resolve => resolve());

    } catch (error) {
        sdkStatus[sdkId] = 'error';
        notifyListeners();
        pendingPromises[sdkId].forEach(resolve => (resolve as any)(error));
        console.error(error);
        return Promise.reject(error);
    } finally {
        delete pendingPromises[sdkId];
    }
}