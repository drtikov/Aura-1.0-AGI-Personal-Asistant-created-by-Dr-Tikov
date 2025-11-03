// state/knowledge/urbanPlanning.ts
import { KnowledgeFact } from '../../types.ts';

export const urbanPlanningKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Zoning Code R1', predicate: 'typically refers to', object: 'single-family residential districts', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Zoning Code C1', predicate: 'typically refers to', object: 'local commercial or retail districts', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Mixed-Use Development', predicate: 'is a type of urban development that blends', object: 'residential, commercial, cultural, institutional, or entertainment uses', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Urban Sprawl', predicate: 'is the', object: 'unrestricted growth in many urban areas of housing, commercial development, and roads over large expanses of land', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Walkability', predicate: 'is a measure of how', object: 'friendly an area is to walking', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Proximity to public transit', predicate: 'often increases', object: 'property value', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
];