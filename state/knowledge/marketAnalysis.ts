// state/knowledge/marketAnalysis.ts
import { KnowledgeFact } from '../../types';

export const marketAnalysisKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Market Analysis', predicate: 'is a thorough assessment of a', object: 'market within a specific industry', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'SWOT Analysis', predicate: 'is a strategic planning technique used to identify', object: 'Strengths, Weaknesses, Opportunities, and Threats', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Porter\'s Five Forces', predicate: 'is a model that identifies and analyzes', object: 'five competitive forces that shape every industry', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Market Segmentation', predicate: 'is the process of dividing a broad consumer or business market into', object: 'sub-groups of consumers based on some type of shared characteristics', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Consumer Behavior', predicate: 'is the study of', object: 'how individuals, groups, and organizations select, buy, use, and dispose of goods and services', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];