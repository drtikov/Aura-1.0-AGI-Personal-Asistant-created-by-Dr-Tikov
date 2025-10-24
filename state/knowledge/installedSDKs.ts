// state/knowledge/installedSDKs.ts
import { KnowledgeFact } from '../../types';

export const installedSDKsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // D3.js
  { subject: 'D3.js', predicate: 'has purpose', object: 'A JavaScript library for manipulating documents based on data.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'D3.js', predicate: 'is used for', object: 'Creating custom, dynamic, and interactive data visualizations.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'D3.js', predicate: 'provides function', object: 'd3.select()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // TensorFlow.js
  { subject: 'TensorFlow.js', predicate: 'has purpose', object: 'A library for machine learning in JavaScript.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'TensorFlow.js', predicate: 'is used for', object: 'Building, training, and running ML models in the browser.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'TensorFlow.js', predicate: 'provides function', object: 'tf.model()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // COCO-SSD
  { subject: 'COCO-SSD Model', predicate: 'has purpose', object: 'A pre-trained object detection model for TensorFlow.js.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'COCO-SSD Model', predicate: 'is used for', object: 'Detecting common objects in images or video streams.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'COCO-SSD Model', predicate: 'provides function', object: 'cocoSsd.load()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Tone.js
  { subject: 'Tone.js', predicate: 'has purpose', object: 'A Web Audio framework for creating interactive music.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Tone.js', predicate: 'is used for', object: 'Scheduling and playing synthesized sounds and managing audio effects.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Tone.js', predicate: 'provides function', object: 'Tone.Synth()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Mermaid.js
  { subject: 'Mermaid.js', predicate: 'has purpose', object: 'A JavaScript-based diagramming and charting tool.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Mermaid.js', predicate: 'is used for', object: 'Generating diagrams from text in a Markdown-like syntax.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Mermaid.js', predicate: 'provides function', object: 'mermaid.render()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Tesseract.js
  { subject: 'Tesseract.js', predicate: 'has purpose', object: 'A JavaScript library for Optical Character Recognition (OCR).', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Tesseract.js', predicate: 'is used for', object: 'Extracting text from images.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Tesseract.js', predicate: 'provides function', object: 'Tesseract.createWorker()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Math.js
  { subject: 'Math.js', predicate: 'has purpose', object: 'An extensive math library for JavaScript.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Math.js', predicate: 'is used for', object: 'Parsing expressions and symbolic computation.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Math.js', predicate: 'provides function', object: 'math.simplify()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Numeric.js
  { subject: 'Numeric.js', predicate: 'has purpose', object: 'A library for numerical analysis and linear algebra.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Numeric.js', predicate: 'is used for', object: 'High-performance matrix and vector operations.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Numeric.js', predicate: 'provides function', object: 'numeric.dot()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  
  // TypeScript Compiler
  { subject: 'TypeScript Compiler', predicate: 'has purpose', object: 'The official TypeScript compiler (tsc) available as a script.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'TypeScript Compiler', predicate: 'is used for', object: 'Transpiling and type-checking TypeScript code within the browser.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'TypeScript Compiler', predicate: 'provides function', object: 'ts.createProgram()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Three.js
  { subject: 'Three.js', predicate: 'has purpose', object: 'A library for creating and displaying animated 3D graphics.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Three.js', predicate: 'is used for', object: 'Creating 3D scenes with WebGL.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Three.js', predicate: 'provides function', object: 'new THREE.Scene()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // polygon-clipping
  { subject: 'polygon-clipping', predicate: 'has purpose', object: 'A library for applying boolean operations on polygons.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'polygon-clipping', predicate: 'is used for', object: 'Calculating the union, intersection, or difference of 2D polygons.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'polygon-clipping', predicate: 'provides function', object: 'polygonClipping.union()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // p5.js
  { subject: 'p5.js', predicate: 'has purpose', object: 'A JavaScript library for creative coding.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'p5.js', predicate: 'is used for', object: 'Creating interactive graphics and animations on an HTML canvas.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'p5.js', predicate: 'provides function', object: 'createCanvas()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Rapier3D
  { subject: 'Rapier3D', predicate: 'has purpose', object: 'A 3D physics engine for JavaScript and WASM.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Rapier3D', predicate: 'is used for', object: 'Simulating rigid body dynamics and collision detection.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Rapier3D', predicate: 'provides function', object: 'new RAPIER.World()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  
  // jscodeshift
  { subject: 'jscodeshift', predicate: 'has purpose', object: 'A toolkit for running codemods over multiple JavaScript files.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'jscodeshift', predicate: 'is used for', object: 'Programmatically refactoring codebases by manipulating the AST.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'jscodeshift', predicate: 'provides function', object: 'j()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  
  // ESLint
  { subject: 'ESLint Linter', predicate: 'has purpose', object: 'A pluggable linter tool for identifying patterns in JavaScript.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'ESLint Linter', predicate: 'is used for', object: 'Statically analyzing code to find problems and enforce standards.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'ESLint Linter', predicate: 'provides function', object: 'linter.verify()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  
  // Natural
  { subject: 'Natural', predicate: 'has purpose', object: 'A general natural language processing library.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Natural', predicate: 'is used for', object: 'Client-side NLP tasks like tokenization, stemming, and classification.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Natural', predicate: 'provides function', object: 'new natural.WordTokenizer()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // OpenCV.js
  { subject: 'OpenCV.js', predicate: 'has purpose', object: 'A library of programming functions mainly aimed at real-time computer vision.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'OpenCV.js', predicate: 'is used for', object: 'Processing and analyzing images and video.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'OpenCV.js', predicate: 'provides function', object: 'cv.imread()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // MediaPipe
  { subject: 'MediaPipe', predicate: 'has purpose', object: 'A framework for building multimodal applied machine learning pipelines.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'MediaPipe', predicate: 'is used for', object: 'Real-time perception tasks like face and hand tracking.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'MediaPipe', predicate: 'provides function', object: 'vision.FaceLandmarker.createFromOptions()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // SQL.js
  { subject: 'SQL.js', predicate: 'has purpose', object: 'A library to run SQLite on the web.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'SQL.js', predicate: 'is used for', object: 'Creating and querying a relational database in the browser.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'SQL.js', predicate: 'provides function', object: 'new SQL.Database()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Apache Arrow
  { subject: 'Apache Arrow', predicate: 'has purpose', object: 'A cross-language development platform for in-memory data.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Apache Arrow', predicate: 'is used for', object: 'High-performance, columnar data processing.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Apache Arrow', predicate: 'provides function', object: 'arrow.tableFromIPC()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // ONNX Runtime
  { subject: 'ONNX Runtime', predicate: 'has purpose', object: 'A performance-focused engine for Open Neural Network Exchange (ONNX) models.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'ONNX Runtime', predicate: 'is used for', object: 'Running inference with ML models from different frameworks.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'ONNX Runtime', predicate: 'provides function', object: 'ort.InferenceSession.create()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Prettier
  { subject: 'Prettier', predicate: 'has purpose', object: 'An opinionated code formatter.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Prettier', predicate: 'is used for', object: 'Automatically formatting code to a consistent style.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Prettier', predicate: 'provides function', object: 'prettier.format()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Vega-Lite
  { subject: 'Vega-Lite', predicate: 'has purpose', object: 'A high-level grammar of interactive graphics.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Vega-Lite', predicate: 'is used for', object: 'Creating complex data visualizations from a JSON specification.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Vega-Lite', predicate: 'provides function', object: 'vegaEmbed()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Phaser
  { subject: 'Phaser', predicate: 'has purpose', object: 'A fast, free, and fun open source HTML5 game framework.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Phaser', predicate: 'is used for', object: 'Building 2D games for the web.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Phaser', predicate: 'provides function', object: 'new Phaser.Game()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Leaflet.js
  { subject: 'Leaflet.js', predicate: 'has purpose', object: 'An open-source JavaScript library for mobile-friendly interactive maps.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Leaflet.js', predicate: 'is used for', object: 'Displaying tiled maps and geospatial data.', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Leaflet.js', predicate: 'provides function', object: 'L.map()', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
];
