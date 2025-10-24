// state/knowledge/python.ts
import { KnowledgeFact } from '../../types';

export const pythonKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Python', predicate: 'is a', object: 'high-level, interpreted programming language', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Python', predicate: 'is known for its', object: 'simple, readable syntax', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Python', predicate: 'uses', object: 'indentation to define code blocks', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Guido van Rossum', predicate: 'is the creator of', object: 'Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'PEP 8', predicate: 'is the style guide for', object: 'Python code', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'List', predicate: 'is a', object: 'mutable ordered sequence of elements in Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Tuple', predicate: 'is an', object: 'immutable ordered sequence of elements in Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Dictionary', predicate: 'is an', object: 'unordered collection of key-value pairs in Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Set', predicate: 'is an', object: 'unordered collection of unique elements in Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'List Comprehension', predicate: 'is a concise way to create', object: 'lists in Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Decorator', predicate: 'is a design pattern in Python that allows a user to', object: 'add new functionality to an existing object without modifying its structure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Generator', predicate: 'is a simple way of creating', object: 'iterators in Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`yield` keyword', predicate: 'is used in a function to create a', object: 'Generator', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'pip', predicate: 'is the', object: 'standard package manager for Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Virtual Environment', predicate: 'is used to create', object: 'isolated Python environments', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Django', predicate: 'is a high-level Python', object: 'web framework', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Flask', predicate: 'is a micro', object: 'web framework for Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'NumPy', predicate: 'is a fundamental package for', object: 'scientific computing with Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Pandas', predicate: 'is a library providing', object: 'high-performance, easy-to-use data structures and data analysis tools for Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The `__init__` method', predicate: 'is a', object: 'constructor for a class in Python', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];