// state/knowledge/astronomy.ts
import { KnowledgeFact } from '../../types';

export const astronomyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Astronomy', predicate: 'is a natural science that studies', object: 'celestial objects and phenomena', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'The Big Bang Theory', predicate: 'is the leading cosmological model for the', object: 'observable universe from the earliest known periods through its subsequent large-scale evolution', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'A Star', predicate: 'is an astronomical object consisting of a luminous spheroid of plasma held together by its', object: 'own gravity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'A Galaxy', predicate: 'is a', object: 'gravitationally bound system of stars, stellar remnants, interstellar gas, dust, and dark matter', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'A Black Hole', predicate: 'is a region of spacetime where', object: 'gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'The Milky Way', predicate: 'is the galaxy that contains our', object: 'Solar System', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];