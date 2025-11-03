// state/knowledge/personalFinance.ts
import { KnowledgeFact } from '../../types.ts';

export const personalFinanceKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Emergency Fund', predicate: 'is a stash of money set aside to cover the', object: 'financial surprises life throws your way', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Financial advisors', predicate: 'often recommend an emergency fund should cover', object: '3 to 6 months of living expenses', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Diversification', predicate: 'is a strategy that mixes a wide variety of', object: 'investments within a portfolio', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '401(k)', predicate: 'is a', object: 'retirement savings plan sponsored by an employer', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'IRA', predicate: 'stands for', object: 'Individual Retirement Account', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Budgeting', predicate: 'is the process of creating a plan to', object: 'spend your money', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];