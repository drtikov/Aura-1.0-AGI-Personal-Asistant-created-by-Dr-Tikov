// state/knowledge/mathjs.ts
import { KnowledgeFact } from '../../types';

export const mathjsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'math.js', predicate: 'is a', object: 'JavaScript library for symbolic and numerical mathematics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'symbolic_math tool', predicate: 'is powered by', object: 'math.js', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'symbolic_math tool', predicate: 'can perform', object: 'simplification of algebraic expressions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'symbolic_math tool', predicate: 'can perform', object: 'solving equations for a variable', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'symbolic_math tool', predicate: 'can perform', object: 'differentiation of expressions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'symbolic_math tool', predicate: 'can perform', object: 'integration of expressions (in some cases)', confidence: 0.8, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'To solve an equation', predicate: 'one must provide the equation in the format', object: '"expression = 0"', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'math.js', predicate: 'can output results in', object: 'LaTeX format for rendering', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
