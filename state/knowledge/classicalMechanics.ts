// state/knowledge/classicalMechanics.ts
import { KnowledgeFact } from '../../types';

export const classicalMechanicsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Classical Mechanics', predicate: 'is a physical theory describing the motion of', object: 'macroscopic objects', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Newton\'s First Law of Motion', predicate: 'states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an', object: 'unbalanced force', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Newton\'s Second Law of Motion', predicate: 'states that the acceleration of an object is directly proportional to the net force and inversely proportional to its mass', object: '(F=ma)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Newton\'s Third Law of Motion', predicate: 'states that for every action, there is an', object: 'equal and opposite reaction', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Conservation of momentum', predicate: 'states that the total momentum of a closed system', object: 'remains constant', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Conservation of energy', predicate: 'states that the total energy of an isolated system', object: 'remains constant', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Lagrangian mechanics', predicate: 'is a reformulation of', object: 'classical mechanics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The Lagrangian (L)', predicate: 'is defined as', object: 'kinetic energy minus potential energy (T - V)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Hamiltonian mechanics', predicate: 'is a theory developed as a reformulation of', object: 'classical mechanics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The Hamiltonian (H)', predicate: 'is defined as', object: 'the total energy of the system (T + V)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];
