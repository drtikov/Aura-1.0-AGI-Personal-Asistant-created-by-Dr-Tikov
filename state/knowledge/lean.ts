// state/knowledge/lean.ts
import { KnowledgeFact } from '../../types';

export const leanKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Lean', predicate: 'is a', object: 'formal proof assistant', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Mathlib', predicate: 'is a', object: 'large library of formalized mathematics for Lean', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'formal_proof_assistant tool', predicate: 'simulates an interface to', object: 'Lean/Mathlib', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'formal_proof_assistant tool', predicate: 'can be used to', object: 'verify the correctness of a mathematical proof', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'formal_proof_assistant tool', predicate: 'can be used to', object: 'suggest the next logical step in a proof', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Formal Proof', predicate: 'requires', object: 'absolute logical rigor and adherence to axioms', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
