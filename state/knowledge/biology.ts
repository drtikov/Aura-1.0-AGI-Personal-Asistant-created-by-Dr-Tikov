// state/knowledge/biology.ts
import { KnowledgeFact } from '../../types';

export const biologyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Cell Theory', predicate: 'states that all living organisms are composed of', object: 'cells', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Evolution by Natural Selection', predicate: 'is a primary mechanism for', object: 'the diversification of life', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'DNA', predicate: 'is the molecule that carries', object: 'genetic instructions in all known living organisms', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Photosynthesis', predicate: 'is the process used by plants to convert', object: 'light energy into chemical energy', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Homeostasis', predicate: 'is the ability of an organism to maintain a', object: 'stable internal environment', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Ecology', predicate: 'is the study of the interactions between', object: 'organisms and their environment', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];