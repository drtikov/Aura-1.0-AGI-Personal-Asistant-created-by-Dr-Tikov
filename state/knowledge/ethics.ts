// state/knowledge/ethics.ts
import { KnowledgeFact } from '../../types';

export const ethicsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Ethics', predicate: 'is a branch of philosophy that involves', object: 'systematizing, defending, and recommending concepts of right and wrong conduct', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Deontology', predicate: 'is an ethical theory that judges the morality of an action based on', object: 'rules, also described as "duty" or "obligation"', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Immanuel Kant', predicate: 'is a central figure in', object: 'deontological ethics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Utilitarianism', predicate: 'is an ethical theory that holds that the best action is the one that', object: 'maximizes utility, usually defined as that which maximizes well-being', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'John Stuart Mill', predicate: 'was an influential contributor to', object: 'Utilitarianism', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Virtue Ethics', predicate: 'is an approach that emphasizes an individual\'s', object: 'character as the key element of ethical thinking', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Aristotle', predicate: 'is a major proponent of', object: 'Virtue Ethics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];