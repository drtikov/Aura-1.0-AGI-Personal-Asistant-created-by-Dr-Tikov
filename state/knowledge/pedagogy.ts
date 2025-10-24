// state/knowledge/pedagogy.ts
import { KnowledgeFact } from '../../types';

export const pedagogyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Pedagogy', predicate: 'is the', object: 'theory and practice of learning', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Constructivism', predicate: 'is a learning theory that suggests', object: 'learners construct knowledge rather than just passively take in information', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Socratic Method', predicate: 'is a form of', object: 'cooperative argumentative dialogue based on asking and answering questions to stimulate critical thinking', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Curriculum Design', predicate: 'is the process of', object: 'creating a structured educational plan', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'First Principles Thinking', predicate: 'is the practice of', object: 'boiling things down to their most fundamental truths and reasoning up from there', confidence: 1, strength: 1.0, lastAccessed: 0 },
];