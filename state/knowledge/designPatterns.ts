// state/knowledge/designPatterns.ts
import { KnowledgeFact } from '../../types';

export const designPatternsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- Creational Patterns ---
  { subject: 'Singleton Pattern', predicate: 'is a', object: 'Creational Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Singleton Pattern', predicate: 'ensures', object: 'a class has only one instance and provides a global point of access to it', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Factory Method Pattern', predicate: 'is a', object: 'Creational Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Factory Method Pattern', predicate: 'provides an interface for creating objects in a superclass but allows', object: 'subclasses to alter the type of objects that will be created', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Abstract Factory Pattern', predicate: 'is a', object: 'Creational Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Abstract Factory Pattern', predicate: 'lets you produce', object: 'families of related objects without specifying their concrete classes', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Builder Pattern', predicate: 'is a', object: 'Creational Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Builder Pattern', predicate: 'lets you construct', object: 'complex objects step by step', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Prototype Pattern', predicate: 'is a', object: 'Creational Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Prototype Pattern', predicate: 'lets you copy', object: 'existing objects without making your code dependent on their classes', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // --- Structural Patterns ---
  { subject: 'Adapter Pattern', predicate: 'is a', object: 'Structural Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Adapter Pattern', predicate: 'allows objects with', object: 'incompatible interfaces to collaborate', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Decorator Pattern', predicate: 'is a', object: 'Structural Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Decorator Pattern', predicate: 'lets you attach', object: 'new behaviors to objects by placing them inside special wrapper objects', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Facade Pattern', predicate: 'is a', object: 'Structural Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Facade Pattern', predicate: 'provides a simplified interface to a', object: 'library, a framework, or any other complex set of classes', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Proxy Pattern', predicate: 'is a', object: 'Structural Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Proxy Pattern', predicate: 'provides a substitute or placeholder for', object: 'another object to control access to it', confidence: 1, strength: 1.0, lastAccessed: 0 },
  
  // --- Behavioral Patterns ---
  { subject: 'Observer Pattern', predicate: 'is a', object: 'Behavioral Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Observer Pattern', predicate: 'lets you define a subscription mechanism to', object: 'notify multiple objects about any events that happen to the object they’re observing', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Strategy Pattern', predicate: 'is a', object: 'Behavioral Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Strategy Pattern', predicate: 'lets you define a family of algorithms, put each of them into a separate class, and', object: 'make their objects interchangeable', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Command Pattern', predicate: 'is a', object: 'Behavioral Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Command Pattern', predicate: 'turns a request into a', object: 'stand-alone object that contains all information about the request', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'State Pattern', predicate: 'is a', object: 'Behavioral Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'State Pattern', predicate: 'lets an object alter its behavior when its', object: 'internal state changes', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Template Method Pattern', predicate: 'is a', object: 'Behavioral Design Pattern', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Template Method Pattern', predicate: 'defines the skeleton of an algorithm in a superclass but lets', object: 'subclasses override specific steps of the algorithm without changing its structure', confidence: 1, strength: 1.0, lastAccessed: 0 },
];