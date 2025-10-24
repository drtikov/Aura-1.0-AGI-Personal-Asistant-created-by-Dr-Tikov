// state/knowledge/aesthetics.ts
import { KnowledgeFact } from '../../types';

export const aestheticsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Aesthetics', predicate: 'is a branch of philosophy that deals with the nature of', object: 'art, beauty, and taste', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Principles of design', predicate: 'include', object: 'balance, contrast, rhythm, and unity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Color Theory', predicate: 'involves the study of', object: 'color mixing, color harmony, and the visual effects of color combinations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Composition', predicate: 'is the placement or arrangement of', object: 'visual elements in a work of art', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Baroque art', predicate: 'is characterized by', object: 'dramatic movement, clear detail, and grandeur', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
];