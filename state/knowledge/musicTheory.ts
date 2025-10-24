// state/knowledge/musicTheory.ts
import { KnowledgeFact } from '../../types';

export const musicTheoryKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Music Theory', predicate: 'is the study of the', object: 'practices and possibilities of music', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Harmony', predicate: 'is the process by which the composition of individual sounds, or superpositions of sounds, is', object: 'analyzed by hearing', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Counterpoint', predicate: 'is the relationship between', object: 'two or more musical lines which are harmonically interdependent yet independent in rhythm and contour', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Sonata form', predicate: 'is a musical structure consisting of three main sections:', object: 'an exposition, a development, and a recapitulation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'J.S. Bach', predicate: 'was a master of', object: 'counterpoint and harmony', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];