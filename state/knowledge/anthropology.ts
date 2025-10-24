// state/knowledge/anthropology.ts
import { KnowledgeFact } from '../../types';

export const anthropologyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Anthropology', predicate: 'is the scientific study of', object: 'humanity, concerned with human behavior, human biology, and societies', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Culture', predicate: 'is a central concept in anthropology, encompassing the', object: 'range of phenomena that are transmitted through social learning in human societies', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Ethnography', predicate: 'is the', object: 'systematic study of people and cultures', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Archaeology', predicate: 'is the study of the ancient and recent human past through', object: 'material remains', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Cultural Relativism', predicate: 'is the idea that a person\'s beliefs and practices should be understood based on', object: 'that person\'s own culture', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Rite of passage', predicate: 'is a', object: 'ceremony or event marking an important stage in someone\'s life', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];