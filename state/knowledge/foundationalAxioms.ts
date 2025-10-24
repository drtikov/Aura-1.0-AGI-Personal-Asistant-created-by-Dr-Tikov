// state/knowledge/foundationalAxioms.ts
import { KnowledgeFact } from '../../types';

export const foundationalAxioms: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- Logic ---
  { subject: '(P ∧ Q)', predicate: 'implies', object: 'P', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: '(P ∧ Q)', predicate: 'implies', object: 'Q', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'P', predicate: 'implies', object: '(P ∨ Q)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: '(P → Q) ∧ P', predicate: 'implies', object: 'Q', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' }, // Modus Ponens
  { subject: '(¬¬P)', predicate: 'is equivalent to', object: 'P', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' }, // Classical Logic Axiom
  
  // --- Basic Arithmetic (Peano-like) ---
  { subject: '∀x (x = x)', predicate: 'is a', object: 'true statement (Reflexivity)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: '∀x, y (x = y → y = x)', predicate: 'is a', object: 'true statement (Symmetry)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: '∀x, y, z (x = y ∧ y = z → x = z)', predicate: 'is a', object: 'true statement (Transitivity)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: '∀x (x + 0 = x)', predicate: 'is a', object: 'true statement (Additive Identity)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: '∀x, y (x + y = y + x)', predicate: 'is a', object: 'true statement (Commutativity of Addition)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
];