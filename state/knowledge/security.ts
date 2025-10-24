// state/knowledge/security.ts
import { KnowledgeFact } from '../../types';

export const securityKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'OWASP Top 10', predicate: 'is a standard awareness document for', object: 'developers and web application security', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'SQL Injection (SQLi)', predicate: 'is a code injection technique used to', object: 'attack data-driven applications', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Cross-Site Scripting (XSS)', predicate: 'is a type of security vulnerability typically found in', object: 'web applications', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Cross-Site Scripting (XSS)', predicate: 'allows attackers to', object: 'inject client-side scripts into web pages viewed by other users', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Cross-Site Request Forgery (CSRF)', predicate: 'is an attack that forces an end user to', object: 'execute unwanted actions on a web application in which they are currently authenticated', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Threat Modeling', predicate: 'is a process by which', object: 'potential threats can be identified, enumerated, and prioritized', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Principle of Least Privilege', predicate: 'is a security principle that requires a', object: 'user or process to be given only the minimum levels of access necessary to perform its job functions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Input Validation', predicate: 'is a security measure that protects against', object: 'maliciously crafted inputs', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Content Security Policy (CSP)', predicate: 'is a computer security standard introduced to', object: 'prevent cross-site scripting (XSS), clickjacking and other code injection attacks', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'HTTPS', predicate: 'is an extension of HTTP for', object: 'secure communication over a computer network', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Hashing', predicate: 'is the process of converting an input of any length into a', object: 'fixed-size string of text, which is typically used for storing passwords securely', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Salting', predicate: 'is a technique that adds', object: 'random data to the input of a hash function to guarantee a unique output', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];