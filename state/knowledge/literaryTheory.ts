// state/knowledge/literaryTheory.ts
import { KnowledgeFact } from '../../types';

export const literaryTheoryKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Literary Theory', predicate: 'is the', object: 'systematic study of the nature of literature and of the methods for literary analysis', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Formalism', predicate: 'is a school of literary criticism that focuses on the', object: 'structural purposes of a particular text', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Post-structuralism', predicate: 'is a theoretical approach that argues that', object: 'to understand an object, it is necessary to study both the object itself and the systems of knowledge that produced the object', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Narrative Structure', predicate: 'is the', object: 'structural framework that underlies the order and manner in which a story is presented', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Symbolism', predicate: 'is the use of', object: 'symbols to signify ideas and qualities by giving them symbolic meanings that are different from their literal sense', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];