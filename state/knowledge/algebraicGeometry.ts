// state/knowledge/algebraicGeometry.ts
import { KnowledgeFact } from '../../types.ts';

export const algebraicGeometryKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- Core Concepts ---
  { subject: 'Algebraic Geometry', predicate: 'is a branch of mathematics that studies', object: 'solutions of polynomial equations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Affine Variety', predicate: 'is the set of solutions to a system of', object: 'polynomial equations over an algebraically closed field', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Projective Variety', predicate: 'is the set of solutions to a system of', object: 'homogeneous polynomial equations in a projective space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Zariski Topology', predicate: 'is a topology on an algebraic variety where', object: 'closed sets are the algebraic subsets', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Coordinate Ring', predicate: 'of an affine variety V is the ring of', object: 'polynomial functions on V', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Morphism', predicate: 'between algebraic varieties is a', object: 'function that is given locally by polynomials', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Dimension of a variety', predicate: 'is the', object: 'maximum length of a chain of distinct irreducible subvarieties', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Singular point', predicate: 'of a variety is a point where the', object: 'tangent space is not well-defined', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  
  // --- Schemes & Sheaves (Advanced Concepts) ---
  { subject: 'Scheme', predicate: 'is a generalization of an', object: 'algebraic variety', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Scheme theory', predicate: 'was introduced by', object: 'Alexander Grothendieck', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Scheme', predicate: 'allows for the use of', object: 'non-algebraically closed fields and nilpotent elements', confidence: 0.95, strength: 1.0, lastAccessed: 0 },
  { subject: 'Sheaf', predicate: 'is a tool for systematically tracking', object: 'locally defined data attached to the open sets of a topological space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Structure Sheaf', predicate: 'is a sheaf on a variety or scheme that', object: 'assigns a ring of "regular" functions to each open set', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Sheaf Cohomology', predicate: 'is a powerful tool for studying the', object: 'global properties of varieties and schemes', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // --- Key Theorems ---
  { subject: 'Hilbert\'s Nullstellensatz', predicate: 'is a fundamental theorem in', object: 'algebraic geometry', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Hilbert\'s Nullstellensatz', predicate: 'relates', object: 'algebraic sets to ideals in polynomial rings', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Bézout\'s Theorem', predicate: 'states that the number of intersection points of two plane algebraic curves is equal to', object: 'the product of their degrees (counted with multiplicity)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Riemann-Roch Theorem', predicate: 'is a major theorem in', object: 'complex analysis and algebraic geometry for a compact Riemann surface', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Riemann-Roch Theorem', predicate: 'relates the', object: 'dimension of the space of meromorphic functions with prescribed poles to the genus of the surface', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // --- Examples & Connections ---
  { subject: 'Plane Curve', predicate: 'is an', object: 'algebraic curve in an affine or projective plane', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Elliptic Curve', predicate: 'is a', object: 'smooth, projective, algebraic curve of genus one, on which there is a specified point O', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Elliptic Curve', predicate: 'is central to', object: 'Fermat\'s Last Theorem proof', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Elliptic Curve', predicate: 'has applications in', object: 'cryptography', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Moduli Space', predicate: 'is a', object: 'geometric space whose points represent isomorphism classes of geometric objects', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // --- Advanced Cohomology Theories ---
  { subject: 'Cohomology Theory', predicate: 'is a tool to assign', object: 'algebraic invariants to topological spaces or schemes', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Étale Cohomology', predicate: 'is an algebraic analogue of', object: 'sheaf cohomology for varieties over any field', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Étale Cohomology', predicate: 'is used to prove the', object: 'Weil conjectures', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Crystalline Cohomology', predicate: 'is a', object: 'p-adic cohomology theory for varieties in positive characteristic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Galois Cohomology', predicate: 'studies the', object: 'group cohomology of Galois modules', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Galois Cohomology', predicate: 'is used to study', object: 'central simple algebras and Brauer groups', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Selmer Group', predicate: 'is defined using', object: 'Galois Cohomology', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Tate-Shafarevich Group', predicate: 'is defined using', object: 'Galois Cohomology', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Weil Conjectures', predicate: 'concern the properties of', object: 'zeta functions of varieties over finite fields', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Cohomological Calculations', predicate: 'are computationally', object: 'very difficult in practice', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];