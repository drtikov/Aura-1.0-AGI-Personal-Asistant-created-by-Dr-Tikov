// state/knowledge/stem.ts
import { KnowledgeFact } from '../../types';

export const stemKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'E=mc^2', predicate: 'is known as', object: 'Mass-energy equivalence formula', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'E=mc^2', predicate: 'was formulated by', object: 'Albert Einstein', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'H2O', predicate: 'is the chemical formula for', object: 'Water', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Water', predicate: 'consists of', object: 'two hydrogen atoms and one oxygen atom', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Photosynthesis', predicate: 'is a process used by', object: 'plants and other organisms', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Photosynthesis', predicate: 'converts', object: 'light energy into chemical energy', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Gravity', predicate: 'is a', object: 'natural phenomenon by which all things with mass are brought toward one another', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Newton\'s First Law of Motion', predicate: 'is also known as the', object: 'Law of Inertia', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Newton\'s Second Law of Motion', predicate: 'states that', object: 'Force equals mass times acceleration (F=ma)', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'The First Law of Thermodynamics', predicate: 'is also known as the', object: 'Law of Conservation of Energy', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'The Second Law of Thermodynamics', predicate: 'states that', object: 'the total entropy of an isolated system can only increase over time', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'The Periodic Table', predicate: 'is a tabular arrangement of the', object: 'chemical elements', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'An atom', predicate: 'consists of a', object: 'central nucleus and surrounding electrons', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'A nucleus', predicate: 'contains', object: 'protons and neutrons', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'A covalent bond', predicate: 'is a chemical bond that involves the', object: 'sharing of electron pairs between atoms', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Cell Theory', predicate: 'states that', object: 'all living organisms are composed of cells', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Evolution by natural selection', predicate: 'is a process that results in', object: 'the adaptation of an organism to its environment', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'The Pythagorean theorem', predicate: 'states that', object: 'in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Pi (π)', predicate: 'is the ratio of a', object: 'circle\'s circumference to its diameter', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Calculus', predicate: 'is the mathematical study of', object: 'continuous change', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'A transistor', predicate: 'is a semiconductor device used to', object: 'amplify or switch electronic signals', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'The Internet', predicate: 'originated from', object: 'ARPANET', confidence: 0.95, strength: 1.0, lastAccessed: 0 },
  { subject: 'Moore\'s Law', predicate: 'is the observation that the number of', object: 'transistors in an integrated circuit doubles about every two years', confidence: 1, strength: 1.0, lastAccessed: 0 },
];