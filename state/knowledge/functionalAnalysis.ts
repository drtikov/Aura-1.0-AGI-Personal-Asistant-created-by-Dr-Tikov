// state/knowledge/functionalAnalysis.ts
import { KnowledgeFact } from '../../types';

export const functionalAnalysisKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Functional Analysis', predicate: 'is a branch of mathematics concerned with the study of', object: 'vector spaces endowed with some kind of limit-related structure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Hilbert Space', predicate: 'is a', object: 'vector space with an inner product that is a complete metric space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Banach Space', predicate: 'is a', object: 'complete normed vector space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Sobolev Space', predicate: 'is a vector space of functions equipped with a norm that is a combination of', object: 'Lp-norms of the function and its derivatives', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Sobolev Spaces', predicate: 'are important for the study of', object: 'partial differential equations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
];