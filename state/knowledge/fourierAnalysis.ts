// state/knowledge/fourierAnalysis.ts
import { KnowledgeFact } from '../../types';

export const fourierAnalysisKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Fourier Analysis', predicate: 'is the study of how general functions may be represented or approximated by', object: 'sums of simpler trigonometric functions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Fourier Series', predicate: 'decomposes a', object: 'periodic function into a sum of simple oscillating functions (sines and cosines)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Fourier Transform', predicate: 'decomposes a function of time into the', object: 'frequencies that make it up', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Fourier Transform', predicate: 'is used for', object: 'non-periodic functions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Fast Fourier Transform (FFT)', predicate: 'is an algorithm that computes the', object: 'Discrete Fourier Transform (DFT)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The uncertainty principle in Fourier analysis', predicate: 'states that a function cannot be both', object: 'concentrated in time and concentrated in frequency', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Fourier analysis', predicate: 'has applications in', object: 'signal processing, image analysis, and quantum mechanics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The frequency domain', predicate: 'represents a signal in terms of its', object: 'frequency components', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Inverse Fourier Transform', predicate: 'synthesizes a function from its', object: 'frequency representation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
