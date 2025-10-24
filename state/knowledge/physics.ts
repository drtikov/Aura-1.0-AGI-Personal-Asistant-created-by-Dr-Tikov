// state/knowledge/physics.ts
import { KnowledgeFact } from '../../types';

export const physicsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Newton\'s Laws of Motion', predicate: 'are three physical laws that form the basis for', object: 'classical mechanics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'General Relativity', predicate: 'is the geometric theory of', object: 'gravitation published by Albert Einstein in 1915', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Quantum Mechanics', predicate: 'is a fundamental theory in physics that provides a description of the physical properties of', object: 'nature at the scale of atoms and subatomic particles', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Thermodynamics', predicate: 'is the branch of physics that deals with', object: 'heat, work, and temperature, and their relation to energy', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Electromagnetism', predicate: 'is the branch of physics involving the study of the', object: 'electromagnetic force', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Standard Model of Particle Physics', predicate: 'is the theory describing', object: 'three of the four known fundamental forces in the universe', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
];