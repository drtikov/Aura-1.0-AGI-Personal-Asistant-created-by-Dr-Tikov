// state/knowledge/productManagement.ts
import { KnowledgeFact } from '../../types';

export const productManagementKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Product Management', predicate: 'is an organizational function that guides every step of a', object: 'product\'s lifecycle', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Roadmap', predicate: 'is a', object: 'high-level, strategic plan that outlines the vision and direction of the product over time', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Prioritization', predicate: 'is the process of', object: 'deciding the relative importance of a set of items', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'RICE', predicate: 'is a', object: 'prioritization framework', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'RICE', predicate: 'stands for', object: 'Reach, Impact, Confidence, and Effort', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'RICE score', predicate: 'is calculated as', object: '(Reach * Impact * Confidence) / Effort', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'MoSCoW method', predicate: 'is a', object: 'prioritization technique used in management and business analysis', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'MoSCoW', predicate: 'stands for', object: 'Must have, Should have, Could have, and Won\'t have', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'User Story', predicate: 'is an', object: 'informal, natural language description of a feature written from the perspective of an end user', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Epic', predicate: 'is a', object: 'large body of work that can be broken down into a number of smaller stories', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Technical Debt', predicate: 'is the implied cost of', object: 'rework caused by choosing an easy (limited) solution now instead of using a better approach that would take longer', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Minimum Viable Product (MVP)', predicate: 'is a version of a product with just enough features to', object: 'be usable by early customers who can then provide feedback for future product development', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];
