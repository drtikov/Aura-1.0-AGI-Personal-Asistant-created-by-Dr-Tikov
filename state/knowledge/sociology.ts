// state/knowledge/sociology.ts
import { KnowledgeFact } from '../../types';

export const sociologyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Sociology', predicate: 'is the study of', object: 'social behavior, its origins, development, organization, and institutions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Social Structure', predicate: 'is the', object: 'patterned social arrangements in society that are both emergent from and determinant of the actions of individuals', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Social Norms', predicate: 'are', object: 'unwritten rules about how to behave in a particular social group or culture', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Social Stratification', predicate: 'refers to a society\'s categorization of its people into groups based on', object: 'socioeconomic factors like wealth, income, race, education, and power', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Group Dynamics', predicate: 'is a system of behaviors and psychological processes occurring within', object: 'a social group, or between social groups', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Cultural Lag', predicate: 'is a term to describe the situation in which', object: 'technological advancements or changes in society occur faster than the changes in the rules and norms of the culture', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
];