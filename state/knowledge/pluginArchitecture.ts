// state/knowledge/pluginArchitecture.ts
import { KnowledgeFact } from '../../types';

export const pluginArchitectureKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Plugin', predicate: 'is a', object: 'software component that adds a specific feature to an existing computer program', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Aura Plugin Types', predicate: 'include', object: 'TOOL, KNOWLEDGE, and COPROCESSOR', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'TOOL Plugin', predicate: 'exposes a', object: 'new capability to the Gemini model via a function schema', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'KNOWLEDGE Plugin', predicate: 'adds a', object: 'new set of declarative facts to Aura\'s Knowledge Graph', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Plugin Design', predicate: 'should follow the', object: 'Single Responsibility Principle', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
];