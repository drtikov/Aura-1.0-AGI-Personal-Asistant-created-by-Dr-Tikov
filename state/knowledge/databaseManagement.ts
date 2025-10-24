// state/knowledge/databaseManagement.ts
import { KnowledgeFact } from '../../types';

export const databaseManagementKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- SQL vs NoSQL ---
  { subject: 'SQL databases', predicate: 'are also known as', object: 'relational databases', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'NoSQL databases', predicate: 'are also known as', object: 'non-relational databases', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'SQL databases', predicate: 'use', object: 'structured query language (SQL)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'SQL databases', predicate: 'have a', object: 'predefined schema', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'NoSQL databases', predicate: 'have a', object: 'dynamic schema for unstructured data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'SQL databases', predicate: 'are typically scaled', object: 'vertically (increasing power of a single server)', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'NoSQL databases', predicate: 'are typically scaled', object: 'horizontally (distributing load across multiple servers)', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'ACID', predicate: 'is a set of properties for', object: 'database transactions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'ACID', predicate: 'stands for', object: 'Atomicity, Consistency, Isolation, Durability', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'SQL databases', predicate: 'are often preferred for applications requiring', object: 'ACID compliance and complex queries', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'NoSQL databases', predicate: 'are often preferred for applications with', object: 'large amounts of unstructured data and high throughput requirements', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'PostgreSQL', predicate: 'is an example of a', object: 'SQL (relational) database', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'MongoDB', predicate: 'is an example of a', object: 'NoSQL (document) database', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Redis', predicate: 'is an example of a', object: 'NoSQL (key-value) database', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  
  // --- Administration & Optimization ---
  { subject: 'Database Index', predicate: 'is a data structure that improves the speed of', object: 'data retrieval operations on a database table', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Creating an index', predicate: 'involves a', object: 'trade-off between faster read performance and slower write performance', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Query Optimization', predicate: 'is the process of', object: 'choosing the most efficient way to execute a query', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Query Plan (or Explain Plan)', predicate: 'is the sequence of steps used to', object: 'access data in a SQL relational database management system', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Database Replication', predicate: 'is the process of', object: 'creating and maintaining multiple copies of the same database', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Replication', predicate: 'can be used for', object: 'high availability, load balancing, and disaster recovery', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Database Backup', predicate: 'is a copy of database data that can be used to', object: 'reconstruct that data after a loss', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Full Backup', predicate: 'is a backup of the', object: 'entire database', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Incremental Backup', predicate: 'is a backup of', object: 'only the data that has changed since the last backup', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];