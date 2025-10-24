// components/SDKPanels.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';

// Declare global variables from CDN scripts to satisfy TypeScript
declare const cv: any;
declare const vision: any;
declare const initSqlJs: any;
declare const arrow: any;
declare const ort: any;
declare const prettier: any;
declare const prettierPlugins: any;
declare const vegaEmbed: any;
declare const Phaser: any;
declare const L: any;

// --- Computer Vision Panel (OpenCV & MediaPipe) ---
export const ComputerVisionPanel = () => {
    const { t } = useLocalization();
    const { addToast } = useAuraDispatch();
    
    // OpenCV State
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const opencvCanvasRef = useRef<HTMLCanvasElement>(null);

    // MediaPipe State
    const [mediaPipeLoading, setMediaPipeLoading] = useState(false);
    const [isWebcamOn, setIsWebcamOn] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediapipeCanvasRef = useRef<HTMLCanvasElement>(null);
    const faceLandmarkerRef = useRef<any>(null);
    const animationFrameId = useRef<number | null>(null);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImgSrc(url);
        }
    };

    const applyGrayscale = () => {
        if (!imgSrc || !opencvCanvasRef.current || typeof cv === 'undefined') {
            addToast('Please upload an image first. OpenCV.js may still be loading.', 'warning');
            return;
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgSrc;
        img.onload = () => {
            const mat = cv.imread(img);
            const gray = new cv.Mat();
            cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
            cv.imshow(opencvCanvasRef.current!, gray);
            mat.delete();
            gray.delete();
        };
    };

    // --- MediaPipe Logic ---
    const createFaceLandmarker = async () => {
        if (typeof vision === 'undefined') {
            addToast("MediaPipe library not loaded.", 'error');
            return;
        }
        setMediaPipeLoading(true);
        const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
        const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
        const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "WASM",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
        });
        faceLandmarkerRef.current = faceLandmarker;
        setMediaPipeLoading(false);
    };

    const predictWebcam = useCallback(() => {
        if (!faceLandmarkerRef.current || !videoRef.current || !mediapipeCanvasRef.current) {
            animationFrameId.current = requestAnimationFrame(predictWebcam);
            return;
        }
        
        const video = videoRef.current;
        const canvas = mediapipeCanvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        if (!canvasCtx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const landmarker = faceLandmarkerRef.current;
        const drawingUtils = new vision.DrawingUtils(canvasCtx);
        
        const startTimeMs = performance.now();
        const results = landmarker.detectForVideo(video, startTimeMs);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        if (results.faceLandmarks) {
            for (const landmarks of results.faceLandmarks) {
                drawingUtils.drawConnectors(landmarks, vision.FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 0.5 });
                drawingUtils.drawConnectors(landmarks, vision.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
                // ... (add other landmark drawings if desired)
            }
        }
        
        animationFrameId.current = requestAnimationFrame(predictWebcam);
    }, []);

    const toggleWebcam = async () => {
        if (isWebcamOn) {
            // Turn off
            setIsWebcamOn(false);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        } else {
            // Turn on
            if (!faceLandmarkerRef.current) {
                await createFaceLandmarker();
            }
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.addEventListener('loadeddata', () => {
                            setIsWebcamOn(true);
                            predictWebcam();
                        });
                    }
                } catch (err) {
                    console.error("Error accessing webcam:", err);
                    addToast("Failed to access webcam.", "error");
                }
            } else {
                 addToast("getUserMedia not supported by your browser.", "error");
            }
        }
    };

    useEffect(() => {
        // Cleanup function
        return () => {
             if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
             if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        }
    }, []);


    return (
        <div className="side-panel">
            <Accordion title="OpenCV.js Demo" defaultOpen>
                <p className="reason-text">Upload an image and apply a simple grayscale filter using OpenCV compiled to WebAssembly.</p>
                <div className="image-gen-control-group">
                    <label>Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="button-grid" style={{ marginTop: '1rem' }}>
                    <button className="control-button" onClick={applyGrayscale}>Apply Grayscale</button>
                </div>
                <canvas ref={opencvCanvasRef} style={{ maxWidth: '100%', marginTop: '1rem', border: '1px solid var(--border-color)' }}></canvas>
            </Accordion>
            <Accordion title="MediaPipe Demo" defaultOpen={false}>
                <p className="reason-text">{t('mediapipe_description')}</p>
                 <div className="button-grid" style={{ marginBottom: '1rem' }}>
                    <button className="control-button" onClick={toggleWebcam} disabled={mediaPipeLoading}>
                        {mediaPipeLoading ? t('mediapipe_loading') : (isWebcamOn ? t('mediapipe_stop_webcam') : t('mediapipe_start_webcam'))}
                    </button>
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', borderRadius: '4px' }}></video>
                    <canvas ref={mediapipeCanvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
                </div>
            </Accordion>
        </div>
    );
};

// --- Data Suite Panel (SQL.js & Apache Arrow) ---
export const DataSuitePanel = () => {
    const { t } = useLocalization();
    // SQL.js state
    const [db, setDb] = useState<any | null>(null);
    const [query, setQuery] = useState('CREATE TABLE users (id INT, name VARCHAR);\nINSERT INTO users VALUES (1, "Alice"), (2, "Bob");\nSELECT * FROM users;');
    const [sqlResults, setSqlResults] = useState('');
    const [sqlError, setSqlError] = useState('');

    // Arrow state
    const [arrowResult, setArrowResult] = useState<{ binarySize: number, reconstructed: any } | null>(null);
    const originalArrowData = [
        { id: 1, name: 'Product A', price: 12.99, inStock: true },
        { id: 2, name: 'Product B', price: 8.50, inStock: false },
    ];


    useEffect(() => {
        if (typeof initSqlJs !== 'undefined') {
            initSqlJs({ locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}` })
                .then((SQL: any) => setDb(new SQL.Database()))
                .catch((err: any) => setSqlError('Failed to load SQL.js WASM.'));
        }
    }, []);

    const executeQuery = () => {
        if (!db) {
            setSqlError('Database is not initialized.');
            return;
        }
        try {
            const res = db.exec(query);
            setSqlResults(JSON.stringify(res, null, 2));
            setSqlError('');
        } catch (err: any) {
            setSqlError(err.message);
            setSqlResults('');
        }
    };

    const runArrowDemo = () => {
        if (typeof arrow === 'undefined') {
            alert('Apache Arrow library not loaded.');
            return;
        }
        // Create an Arrow Table from JSON data
        const table = arrow.tableFromJSON(originalArrowData);
        
        // Serialize the Table to the Arrow IPC stream format (binary)
        const binary = arrow.tableToIPC(table, 'stream');
        
        // Deserialize the binary data back into a Table
        const reconstructedTable = arrow.tableFromIPC(binary);

        setArrowResult({
            binarySize: binary.length,
            reconstructed: reconstructedTable.toJSON(),
        });
    };

    return (
        <div className="side-panel">
            <Accordion title="SQL.js Demo" defaultOpen>
                 <p className="reason-text">Run SQL queries against an in-memory SQLite database running in your browser via WebAssembly.</p>
                 <div className="image-gen-control-group">
                    <label>SQL Query</label>
                    <textarea value={query} onChange={e => setQuery(e.target.value)} rows={4} />
                 </div>
                 <button className="control-button" onClick={executeQuery} style={{marginTop: '1rem', width: '100%'}}>Execute</button>
                 {sqlResults && <div className="code-snippet-container" style={{marginTop: '1rem'}}><pre><code>{sqlResults}</code></pre></div>}
                 {sqlError && <div className="failure-reason-display">{sqlError}</div>}
            </Accordion>
            <Accordion title="Apache Arrow Demo" defaultOpen={false}>
                <p className="reason-text">{t('arrow_description')}</p>
                 <button className="control-button" onClick={runArrowDemo} style={{marginTop: '1rem', width: '100%'}}>{t('arrow_run_demo')}</button>
                {arrowResult && (
                    <div style={{marginTop: '1rem'}}>
                         <div className="panel-subsection-title">{t('arrow_original_data')}</div>
                         <div className="code-snippet-container"><pre><code>{JSON.stringify(originalArrowData, null, 2)}</code></pre></div>
                         <div className="awareness-item" style={{marginTop: '1rem'}}>
                            <label>{t('arrow_binary_size')}</label>
                            <strong>{arrowResult.binarySize} bytes</strong>
                        </div>
                         <div className="panel-subsection-title">{t('arrow_reconstructed_data')}</div>
                         <div className="code-snippet-container"><pre><code>{JSON.stringify(arrowResult.reconstructed, null, 2)}</code></pre></div>
                    </div>
                )}
            </Accordion>
        </div>
    );
};

// --- ONNX Model Runtime Panel ---
export const ModelRuntimePanel = () => {
    const { t } = useLocalization();
    const [inputA, setInputA] = useState('2');
    const [inputB, setInputB] = useState('3');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const sessionRef = useRef<any>(null);
    const modelUrl = "https://onnxruntime.ai/testdata/add.onnx";

    const runInference = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            if (!sessionRef.current) {
                 if (typeof ort === 'undefined') throw new Error("ONNX Runtime library not loaded.");
                sessionRef.current = await ort.InferenceSession.create(modelUrl);
            }
            
            const a = parseFloat(inputA);
            const b = parseFloat(inputB);
            if (isNaN(a) || isNaN(b)) throw new Error("Inputs must be numbers.");

            const x = new ort.Tensor('float32', new Float32Array([a]), [1]);
            const y = new ort.Tensor('float32', new Float32Array([b]), [1]);

            const feeds = { A: x, B: y };
            const results = await sessionRef.current.run(feeds);
            const sumTensor = results.C;
            
            setResult(sumTensor.data[0].toString());

        } catch (err: any) {
            setResult(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('onnx_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="onnx-a">{t('onnx_input_a')}</label>
                <input id="onnx-a" type="number" value={inputA} onChange={e => setInputA(e.target.value)} disabled={isLoading} />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="onnx-b">{t('onnx_input_b')}</label>
                <input id="onnx-b" type="number" value={inputB} onChange={e => setInputB(e.target.value)} disabled={isLoading} />
            </div>
             <button className="control-button" onClick={runInference} style={{marginTop: '1rem', width: '100%'}} disabled={isLoading}>
                 {isLoading ? t('onnx_loading') : t('onnx_run_inference')}
            </button>
            {result && (
                 <div className="awareness-item" style={{marginTop: '1rem'}}>
                    <label>{t('onnx_result')}</label>
                    <strong>{result}</strong>
                </div>
            )}
        </div>
    );
};

// --- Code Formatter Panel (Prettier) ---
export const CodeFormatterPanel = () => {
    const { t } = useLocalization();
    const [inputCode, setInputCode] = useState('const foo = {bar:1, baz:2};');
    const [outputCode, setOutputCode] = useState('');

    const formatCode = () => {
        if (typeof prettier === 'undefined' || typeof prettierPlugins === 'undefined' || typeof prettierPlugins.typescript === 'undefined') {
            setOutputCode("Error: Prettier library not loaded.");
            return;
        }
        try {
            const formatted = prettier.format(inputCode, {
                parser: "typescript",
                plugins: [prettierPlugins.typescript],
            });
            setOutputCode(formatted);
        } catch (err: any) {
            setOutputCode(`Error formatting code:\n${err.message}`);
        }
    };
    
    return (
         <div className="side-panel">
             <p className="reason-text">Format TypeScript/JavaScript code snippets using the Prettier library directly in the browser.</p>
              <div className="image-gen-control-group">
                <label>Input Code</label>
                <textarea value={inputCode} onChange={e => setInputCode(e.target.value)} rows={6} />
             </div>
             <button className="control-button" onClick={formatCode} style={{marginTop: '1rem', width: '100%'}}>Format Code</button>
             {outputCode && (
                 <div className="image-gen-control-group" style={{marginTop: '1rem'}}>
                    <label>Formatted Code</label>
                    <div className="code-snippet-container"><pre><code>{outputCode}</code></pre></div>
                 </div>
             )}
        </div>
    );
};

// --- Advanced Visualization Panel (Vega-Lite) ---
export const AdvancedVisualizationPanel = () => {
    const { t } = useLocalization();
    const chartRef = useRef<HTMLDivElement>(null);
    const [spec, setSpec] = useState(JSON.stringify({
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A simple bar chart with embedded data.",
        "data": {
          "values": [
            {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
            {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53}
          ]
        },
        "mark": "bar",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      }, null, 2));

    const renderChart = () => {
        if (!chartRef.current || typeof vegaEmbed === 'undefined') return;
        try {
            const parsedSpec = JSON.parse(spec);
            vegaEmbed(chartRef.current, parsedSpec, { theme: 'dark' });
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div className="side-panel">
            <p className="reason-text">Create rich, interactive data visualizations using a declarative JSON grammar with Vega-Lite.</p>
            <div className="image-gen-control-group">
                <label>Vega-Lite JSON Specification</label>
                <textarea value={spec} onChange={e => setSpec(e.target.value)} rows={12} />
            </div>
            <button className="control-button" onClick={renderChart} style={{marginTop: '1rem', width: '100%'}}>Render Chart</button>
            <div ref={chartRef} style={{marginTop: '1rem', border: '1px solid var(--border-color)', padding: '0.5rem'}}></div>
        </div>
    );
};

// --- Game Sandbox Panel (Phaser) ---
export const GameSandboxPanel = () => {
    const { t } = useLocalization();
    const phaserContainerRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<any>(null);

    const startGame = () => {
        if (gameInstance.current) {
            gameInstance.current.destroy(true);
            gameInstance.current = null;
        }
        if (!phaserContainerRef.current || typeof Phaser === 'undefined') return;
        
        const config = {
            type: Phaser.AUTO,
            width: phaserContainerRef.current.clientWidth,
            height: 300,
            parent: phaserContainerRef.current,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 }
                }
            },
            scene: {
                create: function(this: any) {
                    const ball = this.add.circle(100, 100, 20, 0x00ffff);
                    this.physics.add.existing(ball);
                    if (ball.body) {
                        ball.body.setBounce(0.8);
                        ball.body.setCollideWorldBounds(true);
                    }
                }
            }
        };
        gameInstance.current = new Phaser.Game(config);
    };

    useEffect(() => {
        return () => { // Cleanup on unmount
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, []);
    
    return (
        <div className="side-panel">
            <p className="reason-text">A sandbox environment to run simple 2D games and physics simulations using the Phaser.js framework.</p>
            <div ref={phaserContainerRef} id="phaser-container" style={{border: '1px solid var(--border-color)', minHeight: '300px'}}></div>
            <button className="control-button" onClick={startGame} style={{marginTop: '1rem', width: '100%'}}>Launch Demo</button>
        </div>
    );
};

// --- Geospatial Panel (Leaflet.js) ---
export const GeospatialPanel = () => {
    const { t } = useLocalization();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current && typeof L !== 'undefined') {
             mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
        }
        // Cleanup map instance on unmount
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const findMe = () => {
        if (mapInstance.current && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                mapInstance.current.setView([latitude, longitude], 13);
                L.marker([latitude, longitude]).addTo(mapInstance.current)
                    .bindPopup("You are here.").openPopup();
            }, () => {
                alert('Could not get your location.');
            });
        }
    };
    
    return (
        <div className="side-panel">
            <p className="reason-text">Display interactive maps and geospatial data using Leaflet.js.</p>
            <div ref={mapRef} style={{height: '300px', width: '100%', border: '1px solid var(--border-color)'}}></div>
             <button className="control-button" onClick={findMe} style={{marginTop: '1rem', width: '100%'}}>Find My Location</button>
        </div>
    );
};

// --- Speech Synthesis Panel (Web Speech API) ---
export const SpeechSynthesisPanel = () => {
    const { t } = useLocalization();
    const [text, setText] = useState("Hello, I am Aura. It is a pleasure to speak with you.");
    
    const speak = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Sorry, your browser does not support the Web Speech API.');
        }
    };
    
    return (
        <div className="side-panel">
            <p className="reason-text">Use the browser's built-in text-to-speech engine to have Aura speak aloud.</p>
            <div className="image-gen-control-group">
                <label>Text to Speak</label>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={4} />
            </div>
            <button className="control-button" onClick={speak} style={{marginTop: '1rem', width: '100%'}}>Speak</button>
        </div>
    );
};