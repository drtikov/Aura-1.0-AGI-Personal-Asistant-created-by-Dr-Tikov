// state/knowledge/interiorDesign.ts
import { KnowledgeFact } from '../../types.ts';

export const interiorDesignKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'The 60-30-10 Rule', predicate: 'is a classic decor rule that helps', object: 'create a balanced color palette', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The 60-30-10 Rule', predicate: 'dictates that 60% of the room should be a', object: 'dominant color, 30% a secondary color, and 10% an accent color', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Ambient Lighting', predicate: 'provides', object: 'overall illumination for a room', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Task Lighting', predicate: 'is used for', object: 'specific activities like reading or cooking', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Accent Lighting', predicate: 'is used to', object: 'highlight a specific object or area, like artwork', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Mid-Century Modern', predicate: 'is a design style characterized by', object: 'clean lines, organic forms, and minimal ornamentation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];