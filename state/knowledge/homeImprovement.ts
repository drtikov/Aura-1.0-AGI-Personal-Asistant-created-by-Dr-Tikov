// state/knowledge/homeImprovement.ts
import { KnowledgeFact } from '../../types.ts';

export const homeImprovementKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Kitchen Remodel (minor)', predicate: 'has an average ROI of', object: 'around 70-80%', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Bathroom Addition', predicate: 'has an average ROI of', object: 'around 50-60%', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Deck Addition (wood)', predicate: 'has an average ROI of', object: 'around 65-75%', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Vinyl Siding', predicate: 'is known for its', object: 'low maintenance and durability', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Wood Siding', predicate: 'offers a classic aesthetic but requires', object: 'more maintenance than vinyl', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Load-bearing wall', predicate: 'is a wall that is an', object: 'active structural element of a building', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];