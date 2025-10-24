// state/knowledge/topology.ts
import { KnowledgeFact } from '../../types';

export const topologyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // Core Concepts
  { subject: 'Topology', predicate: 'is a branch of mathematics concerned with', object: 'properties of space that are preserved under continuous deformations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Topological Space', predicate: 'is a set of points, along with a set of open sets, that satisfies', object: 'axioms relating points and open sets', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Open Set', predicate: 'is a fundamental concept in', object: 'topology', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Closed Set', predicate: 'is a set whose complement is an', object: 'Open Set', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Homeomorphism', predicate: 'is a', object: 'continuous function between topological spaces that has a continuous inverse function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Homeomorphism', predicate: 'is the equivalence relation in', object: 'topology', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'A coffee mug and a donut', predicate: 'are', object: 'homeomorphic', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // Properties of Topological Spaces
  { subject: 'Compactness', predicate: 'is a property that generalizes the notion of a', object: 'closed and bounded subset of Euclidean space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Heine-Borel theorem', predicate: 'states that a subset of Euclidean space is compact if and only if it is', object: 'closed and bounded', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Connectedness', predicate: 'is the property of a topological space that it', object: 'cannot be represented as the union of two or more disjoint non-empty open subsets', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Path-connectedness', predicate: 'is the property that any two points can be', object: 'joined by a path', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Path-connectedness', predicate: 'implies', object: 'Connectedness', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Hausdorff space', predicate: 'is a topological space where for any two distinct points, there exist', object: 'disjoint open sets containing each', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // Algebraic Topology
  { subject: 'Algebraic Topology', predicate: 'is a branch of mathematics that uses tools from', object: 'abstract algebra to study topological spaces', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Fundamental Group', predicate: 'is a group associated with a pointed topological space that records information about the', object: 'basic shape, or holes, of the topological space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Homotopy', predicate: 'describes a', object: 'continuous deformation between two continuous functions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Homology', predicate: 'is a general way of associating a sequence of', object: 'algebraic objects such as abelian groups or modules to other mathematical objects such as topological spaces', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  
  // Key Theorems
  { subject: 'Brouwer Fixed-Point Theorem', predicate: 'states that for any continuous function f mapping a compact convex set into itself, there is a point x such that', object: 'f(x) = x', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Jordan Curve Theorem', predicate: 'states that every simple closed curve in the plane', object: 'separates the plane into an "interior" and an "exterior" region', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Poincaré Conjecture', predicate: 'states that every simply connected, closed 3-manifold is', object: 'homeomorphic to the 3-sphere', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Poincaré Conjecture', predicate: 'was proven by', object: 'Grigori Perelman', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
