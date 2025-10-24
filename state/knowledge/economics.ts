// state/knowledge/economics.ts
import { KnowledgeFact } from '../../types';

export const economicsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Economics', predicate: 'is the social science that studies', object: 'the production, distribution, and consumption of goods and services', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Microeconomics', predicate: 'focuses on the behavior of', object: 'individual agents and markets', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Macroeconomics', predicate: 'focuses on the performance of an', object: 'economy as a whole, including GDP, inflation, and unemployment', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Supply and demand', predicate: 'is a fundamental concept that explains', object: 'price determination in a market', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Keynesian economics', predicate: 'is a macroeconomic theory that advocates for', object: 'government intervention to stimulate demand in times of recession', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Comparative advantage', predicate: 'is an economic law referring to the ability of any given economic actor to', object: 'produce goods and services at a lower opportunity cost than other economic actors', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];