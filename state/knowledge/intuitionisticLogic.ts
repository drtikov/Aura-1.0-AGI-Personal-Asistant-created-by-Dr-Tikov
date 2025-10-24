// state/knowledge/intuitionisticLogic.ts
import { KnowledgeFact } from '../../types';

export const intuitionisticLogicKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Intuitionistic logic', predicate: 'is a form of', object: 'constructive logic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Intuitionistic logic', predicate: 'rejects the general validity of the', object: 'law of the excluded middle (P ∨ ¬P)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Intuitionistic logic', predicate: 'rejects the general validity of', object: 'double negation elimination (¬¬P → P)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'A proof of "P ∨ Q" in intuitionistic logic', predicate: 'requires a', object: 'proof of P or a proof of Q', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'A proof of "∃x. P(x)" in intuitionistic logic', predicate: 'requires the', object: 'construction of a specific term t and a proof of P(t)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Brouwer-Heyting-Kolmogorov (BHK) interpretation', predicate: 'provides the', object: 'proof-theoretic semantics for intuitionistic logic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Double-negation translation', predicate: 'is a method to', object: 'embed classical logic into intuitionistic logic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'L. E. J. Brouwer', predicate: 'is the founder of', object: 'intuitionism', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Arend Heyting', predicate: 'formalized', object: 'intuitionistic logic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Kripke semantics', predicate: 'provides a', object: 'model theory for intuitionistic logic using possible worlds', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
