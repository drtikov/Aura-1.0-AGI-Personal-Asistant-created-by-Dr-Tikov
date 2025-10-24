// state/knowledge/numericjs.ts
import { KnowledgeFact } from '../../types';

export const numericjsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'numeric.js', predicate: 'is a', object: 'JavaScript library for high-performance numerical analysis', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'numerical_computation tool', predicate: 'is powered by', object: 'numeric.js', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'numerical_computation tool', predicate: 'is optimized for', object: 'linear algebra operations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'numerical_computation tool', predicate: 'can perform', object: 'matrix multiplication (dot product)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'numerical_computation tool', predicate: 'can perform', object: 'solving systems of linear equations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Matrices', predicate: 'are represented as', object: 'arrays of arrays of numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
