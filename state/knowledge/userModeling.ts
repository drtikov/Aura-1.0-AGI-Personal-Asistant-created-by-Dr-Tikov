// state/knowledge/userModeling.ts
import { KnowledgeFact } from '../../types';

export const userModelingKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'User Model', predicate: 'is a', object: 'representation of a user\'s goals, knowledge, and preferences', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'User Behavior Patterns', predicate: 'can be identified by analyzing', object: 'sequences of user actions over time from Episodic Memory', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Latent Goals', predicate: 'are', object: 'implicit user objectives that can be inferred from behavior, but are not explicitly stated', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Repetitive Tasks', predicate: 'are a key indicator for', object: 'automation opportunities', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Collaboration Proposal', predicate: 'should be', object: 'non-intrusive and clearly state the observed behavior and the suggested benefit', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
];