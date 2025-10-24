// state/knowledge/computerScience.ts
import { KnowledgeFact } from '../../types';

export const computerScienceKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Computer Science', predicate: 'is the study of', object: 'computation, automation, and information', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Algorithm', predicate: 'is a', object: 'finite sequence of well-defined, computer-implementable instructions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Data Structure', predicate: 'is a', object: 'data organization, management, and storage format that enables efficient access and modification', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Big O notation', predicate: 'is a mathematical notation that describes the', object: 'limiting behavior of a function when the argument tends towards a particular value or infinity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Turing Machine', predicate: 'is a mathematical model of computation that defines an', object: 'abstract machine, which manipulates symbols on a strip of tape according to a table of rules', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'P versus NP problem', predicate: 'is a major unsolved problem in', object: 'computer science', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];