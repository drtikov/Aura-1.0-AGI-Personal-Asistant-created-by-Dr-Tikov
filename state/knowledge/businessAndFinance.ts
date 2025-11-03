// state/knowledge/businessAndFinance.ts
import { KnowledgeFact } from '../../types';

export const businessAndFinanceKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // General Business
  { subject: 'Business Model Canvas', predicate: 'is a', object: 'strategic management template for developing new or documenting existing business models', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Value Proposition', predicate: 'is a promise of value to be', object: 'delivered, communicated, and acknowledged', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'SWOT Analysis', predicate: 'is a strategic planning technique for identifying', object: 'Strengths, Weaknesses, Opportunities, and Threats', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // Startups & Venture Capital
  { subject: 'Venture Capital (VC)', predicate: 'is a form of private equity financing that is provided by', object: 'venture capital firms or funds to startups, early-stage, and emerging companies', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Seed Funding', predicate: 'is the', object: 'first official equity funding stage', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Series A Funding', predicate: 'is the first round of venture capital financing', object: 'after seed and angel funding', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Term Sheet', predicate: 'is a nonbinding agreement setting forth the', object: 'basic terms and conditions under which an investment will be made', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Valuation', predicate: 'is the process of determining the', object: 'present value of a company or an asset', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'SaaS', predicate: 'stands for', object: 'Software as a Service', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'B2B', predicate: 'stands for', object: 'Business-to-Business', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'B2C', predicate: 'stands for', object: 'Business-to-Consumer', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  
  // Deal Structuring
  { subject: 'Equity', predicate: 'represents', object: 'ownership in a company', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Convertible Note', predicate: 'is a form of short-term debt that', object: 'converts into equity in a future financing round', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'SAFE note', predicate: 'stands for', object: 'Simple Agreement for Future Equity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];
