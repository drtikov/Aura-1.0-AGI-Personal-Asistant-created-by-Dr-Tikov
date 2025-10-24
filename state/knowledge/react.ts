// state/knowledge/react.ts
import { KnowledgeFact } from '../../types';

export const reactKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'React', predicate: 'is a', object: 'JavaScript library for building user interfaces', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Component', predicate: 'is a core concept in', object: 'React', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'JSX', predicate: 'is a', object: 'syntax extension for JavaScript used with React', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'useState', predicate: 'is a', object: 'React Hook that lets you add state to functional components', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'useEffect', predicate: 'is a', object: 'React Hook for performing side effects in functional components', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Props', predicate: 'are used to', object: 'pass data from a parent component to a child component', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Virtual DOM', predicate: 'is used by React for', object: 'efficiently updating the UI', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
