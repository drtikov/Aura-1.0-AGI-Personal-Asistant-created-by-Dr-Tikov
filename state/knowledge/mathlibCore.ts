// state/knowledge/mathlibCore.ts
import { KnowledgeFact } from '../../types';

// A small, curated subset of concepts from Lean's Mathlib, focusing on Group Theory.
// This serves as a foundational seed for formal mathematical reasoning.
export const mathlibCoreKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- Core Definitions ---
  { subject: 'Group', predicate: 'is a', object: 'set G with a binary operation *', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Group', predicate: 'must satisfy', object: 'associativity axiom', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Group', predicate: 'must satisfy', object: 'identity element axiom', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Group', predicate: 'must satisfy', object: 'inverse element axiom', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Abelian Group', predicate: 'is a', object: 'Group that also satisfies commutativity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Subgroup', predicate: 'is a', object: 'subset of a group that is itself a group under the same operation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Homomorphism', predicate: 'is a', object: 'structure-preserving map between two algebraic structures of the same type', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // --- Core Axioms as Facts ---
  { subject: 'Associativity', predicate: 'states that for all a, b, c in G,', object: '(a * b) * c = a * (b * c)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Identity Element', predicate: 'states there exists an element e in G such that for every a in G,', object: 'e * a = a * e = a', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Inverse Element', predicate: 'states that for each a in G, there exists an element b in G such that', object: 'a * b = b * a = e', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Commutativity', predicate: 'states that for all a, b in G,', object: 'a * b = b * a', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // --- Foundational Theorems ---
  { subject: 'Uniqueness of Identity', predicate: 'states that', object: 'the identity element in a group is unique', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Uniqueness of Inverses', predicate: 'states that', object: 'every element in a group has a unique inverse', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Lagrange\'s Theorem', predicate: 'states that if H is a subgroup of a finite group G, then', object: 'the order of H divides the order of G', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Lagrange\'s Theorem', predicate: 'is a theorem in', object: 'Group Theory', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Cayley\'s Theorem', predicate: 'states that', object: 'every group G is isomorphic to a subgroup of the symmetric group acting on G', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },

  // --- Ring Theory ---
  { subject: 'Ring', predicate: 'is a', object: 'set R with two binary operations, + and *', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Ring', predicate: 'must be an', object: 'Abelian Group under addition (+)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Ring', predicate: 'must be a', object: 'monoid under multiplication (*)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Ring', predicate: 'must satisfy', object: 'distributivity of multiplication over addition', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Distributivity (Ring)', predicate: 'states that for all a, b, c in R,', object: 'a * (b + c) = (a * b) + (a * c)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Commutative Ring', predicate: 'is a', object: 'Ring that is commutative under multiplication', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Integers (ℤ)', predicate: 'form a', object: 'Commutative Ring', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Multiplication by zero', predicate: 'in a ring states that for any element a,', object: 'a * 0 = 0 * a = 0', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Ideal', predicate: 'is a', object: 'subgroup of the additive group of a ring that absorbs multiplication by elements of the ring', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Ideal', predicate: 'is used to construct', object: 'quotient rings', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },

  // --- Field Theory ---
  { subject: 'Field', predicate: 'is a', object: 'commutative ring where every non-zero element has a multiplicative inverse', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Field', predicate: 'is a fundamental structure in', object: 'Abstract Algebra', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Real Numbers (ℝ)', predicate: 'form a', object: 'Field', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Complex Numbers (ℂ)', predicate: 'form a', object: 'Field', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Integers (ℤ)', predicate: 'do not form a', object: 'Field', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  
  // --- Vector Spaces & Linear Algebra ---
  { subject: 'Vector Space', predicate: 'is a', object: 'set of vectors over a field of scalars, with vector addition and scalar multiplication', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Vector Space', predicate: 'must be an', object: 'Abelian Group under vector addition', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Scalar multiplication', predicate: 'must satisfy', object: 'distributivity and associativity axioms', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Linear Independence', predicate: 'means that', object: 'no vector in a set can be written as a linear combination of the others', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Basis (Vector Space)', predicate: 'is a', object: 'linearly independent set of vectors that spans the entire vector space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Dimension (Vector Space)', predicate: 'is the', object: 'number of vectors in any basis for the space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Linear Transformation', predicate: 'is a', object: 'function between two vector spaces that preserves vector addition and scalar multiplication', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Linear Transformation', predicate: 'is a', object: 'homomorphism of vector spaces', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Matrix', predicate: 'is a', object: 'rectangular array of numbers arranged in rows and columns', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Matrix', predicate: 'can represent a', object: 'Linear Transformation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Eigenvector', predicate: 'of a linear transformation is a', object: 'nonzero vector that changes by only a scalar factor when that linear transformation is applied to it', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Eigenvalue', predicate: 'is the', object: 'scalar factor by which an eigenvector is scaled', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  
  // --- Concepts from the Lean mathlib Paper ---
  { subject: 'mathlib', predicate: 'is a', object: 'community-driven library of formalized mathematics for the Lean proof assistant', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'mathlib', predicate: 'is distinguished by its', object: 'dependently typed foundations and extensive structure hierarchy', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Lean', predicate: 'is a', object: 'proof assistant based on the Calculus of Inductive Constructions (CIC)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Lean', predicate: 'uses a system of', object: 'dependent types', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Type Class', predicate: 'is a mechanism used in mathlib for', object: 'organizing mathematical structures and theorems polymorphically', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Metaprogramming', predicate: 'in Lean allows users to write', object: 'custom tactics, commands, and automation tools', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'simp', predicate: 'is a', object: 'primary simplification tactic in Lean and mathlib that performs rewriting', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Topology', predicate: 'is a major component of', object: 'mathlib, including theories of uniform spaces and metric spaces', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Category Theory', predicate: 'is a library in', object: 'mathlib that includes (co)limits, monads, and adjunctions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Sylow\'s theorems', predicate: 'are formalized in', object: 'mathlib', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Hilbert\'s basis theorem', predicate: 'is formalized in', object: 'mathlib', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'The halting problem', predicate: 'is proven undecidable in', object: 'mathlib', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Perfectoid spaces', predicate: 'were defined in', object: 'Lean using mathlib', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];