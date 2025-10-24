// state/knowledge/backendImplementation.ts
import { KnowledgeFact } from '../../types';

export const backendImplementationKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- API Design ---
  { subject: 'REST (Representational State Transfer)', predicate: 'is an architectural style for', object: 'designing networked applications', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'RESTful APIs', predicate: 'use', object: 'HTTP requests to access and use data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'In REST, resources', predicate: 'are identified by', object: 'URIs (Uniform Resource Identifiers)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'HTTP GET method', predicate: 'is used to', object: 'retrieve a resource', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'HTTP POST method', predicate: 'is used to', object: 'create a new resource', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'HTTP PUT method', predicate: 'is used to', object: 'update or replace a resource', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'HTTP DELETE method', predicate: 'is used to', object: 'delete a resource', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Authentication ---
  { subject: 'Authentication', predicate: 'is the process of', object: 'verifying the identity of a user or process', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Authorization', predicate: 'is the process of', object: 'determining whether an authenticated user has permission to access a specific resource', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'JWT', predicate: 'stands for', object: 'JSON Web Token', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'JWT', predicate: 'is a compact, URL-safe means of representing', object: 'claims to be transferred between two parties', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'A JWT', predicate: 'consists of three parts', object: 'Header, Payload, and Signature', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The signature of a JWT', predicate: 'is used to', object: 'verify that the sender of the JWT is who it says it is and to ensure that the message was not changed along the way', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'JWTs', predicate: 'are a good way to', object: 'securely transmit information between parties for stateless authentication', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'OAuth 2.0', predicate: 'is an', object: 'authorization framework that enables applications to obtain limited access to user accounts on an HTTP service', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'OAuth 2.0', predicate: 'is commonly used for', object: '"Login with Google" or "Login with Facebook" functionality', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Database Connectivity ---
  { subject: 'ORM', predicate: 'stands for', object: 'Object-Relational Mapping', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'ORM', predicate: 'is a technique that lets you query and manipulate data from a database using an', object: 'object-oriented paradigm', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Prisma and TypeORM', predicate: 'are examples of', object: 'ORMs for TypeScript/JavaScript', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Connection Pooling', predicate: 'is the practice of', object: 'creating and managing a cache of database connections that can be reused by an application', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Connection Pooling', predicate: 'improves performance by', object: 'reducing the overhead of opening and closing database connections', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Database Migration', predicate: 'is the management of', object: 'incremental, reversible changes to relational database schemas', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];