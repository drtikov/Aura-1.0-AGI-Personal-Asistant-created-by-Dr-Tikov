// state/knowledge/pde.ts
import { KnowledgeFact } from '../../types';

export const pdeKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Partial Differential Equation (PDE)', predicate: 'is an equation that involves', object: 'partial derivatives of a multivariable function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Navier-Stokes equations', predicate: 'are a set of', object: 'partial differential equations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Navier-Stokes equations', predicate: 'describe the motion of', object: 'viscous fluid substances', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Existence and smoothness', predicate: 'of Navier-Stokes solutions is an', object: 'unsolved Millennium Prize Problem', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Weak solution', predicate: 'is a concept that', object: 'weakens the differentiability requirements of a PDE solution', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Jean Leray', predicate: 'proved the existence of', object: 'weak solutions for the incompressible Navier-Stokes equations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];