// state/knowledge/technicalWriting.ts
import { KnowledgeFact } from '../../types';

export const technicalWritingKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Technical Writing', predicate: 'is a type of writing where the author is', object: 'writing about a particular subject that requires direction, instruction, or explanation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Clarity', predicate: 'is a primary goal of', object: 'Technical Writing', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Conciseness', predicate: 'is a primary goal of', object: 'Technical Writing', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Accuracy', predicate: 'is a primary goal of', object: 'Technical Writing', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Audience analysis', predicate: 'is the process of determining', object: 'the needs, knowledge, and background of the readers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Markdown', predicate: 'is a', object: 'lightweight markup language for creating formatted text', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Markdown', predicate: 'is commonly used for writing', object: 'README files and documentation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'JSDoc', predicate: 'is a markup language used to', object: 'annotate JavaScript source code files', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`@param`', predicate: 'is a JSDoc tag used to document', object: 'a function parameter', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`@returns`', predicate: 'is a JSDoc tag used to document', object: 'the return value of a function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Architectural Decision Record (ADR)', predicate: 'is a document that captures an', object: 'important architectural decision made along with its context and consequences', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'An ADR', predicate: 'should include sections for', object: 'Title, Status, Context, Decision, and Consequences', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Active Voice', predicate: 'is generally preferred in', object: 'technical writing over passive voice', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
