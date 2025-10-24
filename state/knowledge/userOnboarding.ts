// state/knowledge/userOnboarding.ts
import { KnowledgeFact } from '../../types';

export const userOnboardingKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'User Onboarding', predicate: 'is the process of', object: 'actively guiding users to find new value in your product', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Value Realization', predicate: 'is the point at which a', object: 'user understands and experiences the benefit of a product or feature', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Effective tutorials', predicate: 'should be', object: 'short, interactive, and context-sensitive', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Proactive reminders', predicate: 'can be used to', object: 're-engage a user with an underutilized feature', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'User Adoption', predicate: 'is the process by which', object: 'new users become acclimated to a product and decide to keep using it', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];