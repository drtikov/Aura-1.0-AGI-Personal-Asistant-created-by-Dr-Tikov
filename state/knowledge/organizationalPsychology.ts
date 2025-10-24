// state/knowledge/organizationalPsychology.ts
import { KnowledgeFact } from '../../types';

export const organizationalPsychologyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Organizational Psychology', predicate: 'is the scientific study of', object: 'human behavior in organizations and the workplace', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Maslow\'s Hierarchy of Needs', predicate: 'is a theory of motivation which states that', object: 'five categories of human needs dictate an individual\'s behavior', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Herzberg\'s Two-Factor Theory', predicate: 'states that there are certain factors in the workplace that cause', object: 'job satisfaction, while a separate set of factors cause dissatisfaction', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Systems Thinking', predicate: 'is a way of', object: 'making sense of the complex world by looking at it from a holistic perspective', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Team Dynamics', predicate: 'describes the', object: 'unconscious, psychological forces that influence the direction of a team\'s behavior and performance', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];