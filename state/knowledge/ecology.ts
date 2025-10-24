// state/knowledge/ecology.ts
import { KnowledgeFact } from '../../types';

export const ecologyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Ecology', predicate: 'is the branch of biology that deals with the relations of', object: 'organisms to one another and to their physical surroundings', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Ecosystem', predicate: 'is a', object: 'biological community of interacting organisms and their physical environment', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Food Web', predicate: 'is a system of', object: 'interlocking and interdependent food chains', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Symbiosis', predicate: 'is any type of a close and long-term biological interaction between', object: 'two different biological organisms', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Trophic Level', predicate: 'is the position an organism occupies in a', object: 'food web', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Biodiversity', predicate: 'is the', object: 'variety of life in the world or in a particular habitat or ecosystem', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];