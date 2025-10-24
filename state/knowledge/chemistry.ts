// state/knowledge/chemistry.ts
import { KnowledgeFact } from '../../types';

export const chemistryKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Atom', predicate: 'is the basic unit of a', object: 'chemical element', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Chemical Bond', predicate: 'is a lasting attraction between', object: 'atoms, ions or molecules', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'The Periodic Table', predicate: 'is a tabular arrangement of', object: 'the chemical elements, ordered by their atomic number', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Chemical Reaction', predicate: 'is a process that leads to the', object: 'chemical transformation of one set of chemical substances to another', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Law of Conservation of Mass', predicate: 'states that mass in an isolated system is', object: 'neither created nor destroyed by chemical reactions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Mole', predicate: 'is a unit of amount of substance containing approximately', object: '6.022 x 10^23 elementary entities', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];