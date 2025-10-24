// state/knowledge/history.ts
import { KnowledgeFact } from '../../types';

export const historyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'History', predicate: 'is the study of', object: 'past events, particularly in human affairs', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Historiography', predicate: 'is the study of the', object: 'methods of historians in developing history as an academic discipline', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Primary Source', predicate: 'is an', object: 'artifact, document, diary, manuscript, autobiography, recording, or any other source of information that was created at the time under study', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Secondary Source', predicate: 'is a document or recording that', object: 'relates or discusses information originally presented elsewhere', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'The fall of the Western Roman Empire', predicate: 'was caused by factors including', object: 'economic instability, overexpansion, and barbarian invasions', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
];