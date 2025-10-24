// state/knowledge/engineeringDesign.ts
import { KnowledgeFact } from '../../types';

export const engineeringDesignKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Mechanical Engineering', predicate: 'is a discipline that applies', object: 'engineering physics and materials science principles to design and manufacture mechanical systems', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'CAD', predicate: 'stands for', object: 'Computer-Aided Design', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: '3D Printing', predicate: 'is also known as', object: 'additive manufacturing', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Material Science', predicate: 'involves the', object: 'discovery and design of new materials', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Ergonomics', predicate: 'is the process of designing or arranging workplaces, products and systems so that they', object: 'fit the people who use them', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Physics Simulation', predicate: 'is used to', object: 'predict the behavior of a physical system', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
];