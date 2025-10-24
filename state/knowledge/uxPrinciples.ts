// state/knowledge/uxPrinciples.ts
import { KnowledgeFact } from '../../types';

export const uxPrinciplesKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Usability', predicate: 'is the', object: 'ease of use and learnability of a human-made object', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Jakob\'s Law', predicate: 'states that', object: 'users spend most of their time on other sites, so they prefer your site to work the same way as all the others they already know', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Hick\'s Law', predicate: 'states that', object: 'the time it takes to make a decision increases with the number and complexity of choices', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Fitts\'s Law', predicate: 'states that', object: 'the time to acquire a target is a function of the distance to and size of the target', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Accessibility', predicate: 'is the practice of making products usable by', object: 'people with the widest possible range of abilities', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'User-facing documentation', predicate: 'should be', object: 'clear, concise, and written from the user\'s perspective', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];