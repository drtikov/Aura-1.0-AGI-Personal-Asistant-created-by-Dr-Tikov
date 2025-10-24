// state/knowledge/ergodicTheory.ts
import { KnowledgeFact } from '../../types';

export const ergodicTheoryKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Ergodic theory', predicate: 'is a branch of mathematics that studies', object: 'dynamical systems with an invariant measure and related problems', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'A dynamical system', predicate: 'is ergodic if', object: 'time averages for almost all initial points are the same and equal to the space average', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Invariant measure', predicate: 'is a measure that is preserved by the', object: 'dynamics of the system', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Birkhoff\'s ergodic theorem', predicate: 'states that for an ergodic system, the', object: 'time average of a function along a trajectory equals the space average', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Poincaré recurrence theorem', predicate: 'states that certain systems will, after a sufficiently long time,', object: 'return to a state arbitrarily close to their initial state', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Ergodic hypothesis', predicate: 'in physics states that, over long periods of time, the time spent by a system in a region of phase space is', object: 'proportional to the volume of this region', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Ergodicity', predicate: 'provides a foundation for', object: 'statistical mechanics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'A mixing system', predicate: 'is a strong form of an', object: 'ergodic system', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Mixing', predicate: 'implies that any set of states', object: 'becomes uniformly distributed throughout the space over time', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
