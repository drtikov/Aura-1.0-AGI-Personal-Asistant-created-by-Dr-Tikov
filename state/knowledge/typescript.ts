// state/knowledge/typescript.ts
import { KnowledgeFact } from '../../types';

export const typescriptKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'TypeScript', predicate: 'is a', object: 'superset of JavaScript', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'TypeScript', predicate: 'adds', object: 'static typing to JavaScript', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'TypeScript', predicate: 'is developed by', object: 'Microsoft', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'tsc', predicate: 'is the', object: 'TypeScript compiler', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'tsc', predicate: 'transpiles', object: 'TypeScript code into JavaScript', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Type Annotation', predicate: 'uses syntax like', object: ': string or : number', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Interface', predicate: 'is a way to define', object: 'a contract for an object\'s shape', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Interface', predicate: 'can be extended by', object: 'other interfaces', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Type Alias', predicate: 'is defined with the', object: '`type` keyword', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Union Type', predicate: 'allows a variable to be', object: 'one of several types', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Union Type', predicate: 'uses the', object: '| (pipe) character', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Intersection Type', predicate: 'combines', object: 'multiple types into one', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Intersection Type', predicate: 'uses the', object: '& (ampersand) character', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Generics', predicate: 'provide a way to create', object: 'reusable components that work with a variety of types', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Generics', predicate: 'use a type variable like', object: '<T>', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Enum', predicate: 'is a way of giving more friendly names to sets of', object: 'numeric values', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`any` type', predicate: 'is a type that', object: 'opts-out of type checking', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`unknown` type', predicate: 'is the', object: 'type-safe counterpart of `any`', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`void` type', predicate: 'is used where there is', object: 'no data, such as a function that does not return a value', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`never` type', predicate: 'represents the type of values that', object: 'never occur', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Type Assertion', predicate: 'is a mechanism to', object: 'tell the compiler about the type of a variable', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Type Assertion', predicate: 'uses the', object: '`as` keyword or angle-bracket syntax', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
