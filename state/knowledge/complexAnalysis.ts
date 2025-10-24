// state/knowledge/complexAnalysis.ts
import { KnowledgeFact } from '../../types.ts';

export const complexAnalysisKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- Core Concepts ---
  { subject: 'Complex Analysis', predicate: 'is the branch of mathematics that investigates', object: 'functions of complex numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Complex Number', predicate: 'is a number of the form', object: 'a + bi, where a and b are real numbers and i is the imaginary unit', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Holomorphic Function', predicate: 'is a', object: 'complex-differentiable function defined on an open subset of the complex plane', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Analytic Function', predicate: 'is often used interchangeably with', object: 'Holomorphic Function', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Cauchy-Riemann Equations', predicate: 'are a system of two partial differential equations which must be satisfied for a complex function to be', object: 'holomorphic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Contour Integral', predicate: 'is a method of', object: 'integrating a complex function along a path in the complex plane', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Singularity', predicate: 'of a complex function is a point at which the function is', object: 'not analytic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Pole', predicate: 'is a type of singularity where the function', object: 'goes to infinity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Essential Singularity', predicate: 'is a singularity near which the function', object: 'exhibits extreme behavior (Casorati–Weierstrass theorem)', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Residue', predicate: 'is a complex number proportional to the', object: 'contour integral of a meromorphic function along a path enclosing one of its singularities', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Analytic Continuation', predicate: 'is a technique to extend the domain of a given', object: 'analytic function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Conformal Map', predicate: 'is a function that locally preserves', object: 'angles, but not necessarily lengths', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Holomorphic functions', predicate: 'are', object: 'conformal at points where the derivative is non-zero', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Key Theorems ---
  { subject: 'Cauchy\'s Integral Theorem', predicate: 'states that the contour integral of a holomorphic function over a simple closed path in a simply connected domain is', object: 'zero', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Cauchy\'s Integral Formula', predicate: 'expresses the value of a holomorphic function at any point inside a disk in terms of the', object: 'values of the function on the boundary of the disk', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Cauchy\'s Integral Formula', predicate: 'implies that a holomorphic function is', object: 'infinitely differentiable', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Residue Theorem', predicate: 'is a powerful tool to evaluate', object: 'line integrals of analytic functions over closed curves', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Residue Theorem', predicate: 'relates a contour integral to the', object: 'sum of the residues of the function at its poles inside the contour', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Liouville\'s Theorem', predicate: 'states that every bounded entire function must be', object: 'constant', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Fundamental Theorem of Algebra', predicate: 'states that every non-constant single-variable polynomial with complex coefficients has', object: 'at least one complex root', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Fundamental Theorem of Algebra', predicate: 'can be proven using', object: 'Liouville\'s Theorem', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Maximum Modulus Principle', predicate: 'states that the modulus of a non-constant analytic function on a connected open set', object: 'cannot have a local maximum within that set', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Riemann Mapping Theorem', predicate: 'states that any non-empty simply connected open subset of the complex plane (which is not the whole plane) is', object: 'biholomorphically equivalent to the open unit disk', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },

  // --- Important Functions & Connections ---
  { subject: 'Euler\'s Formula', predicate: 'states that for any real number x,', object: 'e^(ix) = cos(x) + i*sin(x)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Complex Logarithm', predicate: 'is the', object: 'inverse function to the complex exponential function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Complex Logarithm', predicate: 'is a', object: 'multivalued function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Riemann Zeta Function', predicate: 'is a function of a complex variable that is', object: 'analytically continued from the sum of the infinite series Σ(1/n^s)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Riemann Zeta Function', predicate: 'is central to the', object: 'Riemann Hypothesis', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Riemann Surface', predicate: 'is a', object: 'one-dimensional complex manifold', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Complex analysis', predicate: 'has applications in', object: 'physics, engineering, and signal processing', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- L-Functions & Galois Representations ---
  { subject: 'L-function', predicate: 'is a type of meromorphic function that generalizes the', object: 'Riemann zeta function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'L-functions', predicate: 'are expected to have an', object: 'analytic continuation, functional equation, and Euler product', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  { subject: 'Hasse-Weil L-function', predicate: 'is an L-function associated with an', object: 'algebraic variety over a number field', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Hasse-Weil L-function', predicate: 'is central to the', object: 'Birch and Swinnerton-Dyer conjecture', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Galois Representation', predicate: 'is a', object: 'homomorphism from a Galois group to a group of matrices', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Artin L-functions', predicate: 'are attached to', object: 'Galois representations', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Langlands Program', predicate: 'is a web of conjectures that relate', object: 'Galois groups in number theory to automorphic forms and representation theory', confidence: 0.95, strength: 1.0, lastAccessed: 0 },
  { subject: 'L-functions', predicate: 'provide a link between', object: 'analytic objects and algebraic objects (via Galois representations)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'p-adic L-functions', predicate: 'are constructed differently from complex L-functions, using', object: 'p-adic interpolation', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];