// core/sdkLoader.ts

const SDK_URLS: Record<string, { type: 'script' | 'style'; url: string }> = {
    // Core UI & Markdown
    anime: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js' },
    marked: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js' },
    katex: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js' },
    katex_css: { type: 'style', url: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css' },
    mermaid: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/mermaid@9.1.3/dist/mermaid.min.js' },
    
    // Math & Symbolic
    mathjs: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.7.0/math.js' },
    numericjs: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js' },
    
    // Documents
    pdfjs: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js' },
    jspdf: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' },
    jszip: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js' },

    // Geometry & Graphics
    polygonClipping: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/polygon-clipping@0.15.3/dist/polygon-clipping.min.js' },
    p5: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js' },
    three: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' },

    // Code Tools
    typescript: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/typescript/4.7.4/typescript.min.js' },
    prettier: { type: 'script', url: 'https://unpkg.com/prettier@2.8.8/standalone.js' },
    prettierPlugins: { type: 'script', url: 'https://unpkg.com/prettier@2.8.8/parser-typescript.js' },

    // Data & ML
    sqljs: { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.js' },
    arrow: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/apache-arrow@latest' },
    onnx: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js' },
    
    // Visualization
    vegaEmbed: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/vega-embed@6' },
    
    // Gaming & Geospatial
    phaser: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js' },
    leaflet: { type: 'script', url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js' },

    // Computer Vision
    opencv: { type: 'script', url: 'https://docs.opencv.org/4.x/opencv.js' },
    mediapipe: { type: 'script', url: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js' },
};

const sdkStatus: Record<string, 'idle' | 'loading' | 'loaded' | 'error'> = {};
const sdkPromises: Record<string, Promise<void>> = {};

const statusListeners = new Set<(statuses: Record<string, 'idle' | 'loading' | 'loaded' | 'error'>) => void>();

// Initialize statuses
Object.keys(SDK_URLS).forEach(id => {
    sdkStatus[id] = 'idle';
});

const notifyListeners = () => {
    statusListeners.forEach(listener => listener(sdkStatus));
};

export const getSdkStatus = () => sdkStatus;

export const subscribeToSdkStatus = (callback: (statuses: Record<string, 'idle' | 'loading' | 'loaded' | 'error'>) => void) => {
    statusListeners.add(callback);
};

export const unsubscribeFromSdkStatus = (callback: (statuses: Record<string, 'idle' | 'loading' | 'loaded' | 'error'>) => void) => {
    statusListeners.delete(callback);
};

export const loadSdk = (sdkId: string): Promise<void> => {
    if (sdkPromises[sdkId]) {
        return sdkPromises[sdkId];
    }

    const sdkInfo = SDK_URLS[sdkId];
    if (!sdkInfo) {
        sdkStatus[sdkId] = 'error';
        notifyListeners();
        return Promise.reject(new Error(`SDK with id '${sdkId}' not found.`));
    }

    sdkPromises[sdkId] = new Promise((resolve, reject) => {
        sdkStatus[sdkId] = 'loading';
        notifyListeners();

        if (sdkInfo.type === 'script') {
            const script = document.createElement('script');
            script.src = sdkInfo.url;
            script.async = true;
            script.onload = () => {
                sdkStatus[sdkId] = 'loaded';
                if (sdkId === 'pdfjs') {
                    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                }
                notifyListeners();
                resolve();
            };
            script.onerror = () => {
                sdkStatus[sdkId] = 'error';
                notifyListeners();
                reject(new Error(`Failed to load script: ${sdkInfo.url}`));
            };
            document.head.appendChild(script);
        } else if (sdkInfo.type === 'style') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = sdkInfo.url;
            link.onload = () => {
                sdkStatus[sdkId] = 'loaded';
                notifyListeners();
                resolve();
            };
            link.onerror = () => {
                sdkStatus[sdkId] = 'error';
                notifyListeners();
                reject(new Error(`Failed to load stylesheet: ${sdkInfo.url}`));
            };
            document.head.appendChild(link);
        }
    });

    return sdkPromises[sdkId];
};