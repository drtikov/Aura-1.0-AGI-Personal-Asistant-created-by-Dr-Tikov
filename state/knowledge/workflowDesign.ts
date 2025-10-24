// state/knowledge/workflowDesign.ts
import { KnowledgeFact } from '../../types';

export const workflowDesignKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Workflow', predicate: 'is a', object: 'sequence of tasks that processes a set of data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Workflow Trigger', predicate: 'is an', object: 'event or condition that initiates a workflow', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Workflow Steps', predicate: 'should be', object: 'atomic, sequential, and clearly defined', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'A good workflow', predicate: 'is', object: 'robust, efficient, and easy to understand', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'CoCreatedWorkflow system', predicate: 'is used to', object: 'define, manage, and execute automated user workflows within Aura', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];