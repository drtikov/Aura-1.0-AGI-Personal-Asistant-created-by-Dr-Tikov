// state/knowledge/jestVitest.ts
import { KnowledgeFact } from '../../types';

export const jestVitestKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Jest', predicate: 'is a', object: 'JavaScript testing framework', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Vitest', predicate: 'is a', object: 'Vite-native unit test framework compatible with Jest API', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`describe` block', predicate: 'is used to', object: 'group related tests together', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`it` or `test` block', predicate: 'is used to', object: 'define an individual test case', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`expect` function', predicate: 'is used with a matcher function to', object: 'assert that a value meets certain conditions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`toBe`', predicate: 'is a matcher that checks for', object: 'exact equality (===)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`toHaveBeenCalled`', predicate: 'is a matcher that checks if a', object: 'mock function was called', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`jest.fn()` or `vi.fn()`', predicate: 'is used to create a', object: 'mock function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
