// state/knowledge/abstractionAndPatterns.ts
import { KnowledgeFact } from '../../types';

export const abstractionAndPatternsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Abstraction', predicate: 'is the process of', object: 'hiding the complexity of a system by providing a more simple and higher-level interface', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Pattern Recognition', predicate: 'is the process of', object: 'identifying recurring structures, themes, or behaviors in a set of data or workflows', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'DRY Principle', predicate: 'stands for', object: 'Don\'t Repeat Yourself', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'DRY Principle', predicate: 'is aimed at', object: 'reducing repetition of information of all kinds', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Generalization', predicate: 'is a form of abstraction whereby', object: 'common properties of specific instances are formulated as general concepts or claims', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Graduating a feature', predicate: 'means promoting a', object: 'custom, user-specific tool into a core, system-wide feature', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
];