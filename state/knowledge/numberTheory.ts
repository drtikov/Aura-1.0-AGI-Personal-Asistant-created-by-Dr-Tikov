// state/knowledge/numberTheory.ts
import { KnowledgeFact } from '../../types.ts';

export const numberTheoryKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- Core Concepts ---
  { subject: 'Number Theory', predicate: 'is a branch of mathematics devoted primarily to the study of', object: 'the integers and integer-valued functions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Prime Number', predicate: 'is a natural number greater than 1 that has no', object: 'positive divisors other than 1 and itself', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Divisibility', predicate: 'is a central concept in', object: 'number theory', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Greatest Common Divisor (GCD)', predicate: 'of two integers is the', object: 'largest positive integer that divides both numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Euclidean Algorithm', predicate: 'is an efficient method for computing the', object: 'Greatest Common Divisor (GCD)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Modular Arithmetic', predicate: 'is a system of arithmetic for integers, where numbers', object: '"wrap around" upon reaching a certain value—the modulus', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Congruence', predicate: 'relation (a ≡ b mod n) means that', object: 'a and b have the same remainder when divided by n', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Diophantine Equation', predicate: 'is a', object: 'polynomial equation for which only integer solutions are sought', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Quadratic Residue', predicate: '(modulo n) is an integer q such that', object: 'there exists an integer x where x^2 ≡ q (mod n)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // --- Key Theorems ---
  { subject: 'Fundamental Theorem of Arithmetic', predicate: 'states that every integer greater than 1 either is a prime number itself or can be represented as a', object: 'product of prime numbers, and this representation is unique', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Fermat\'s Little Theorem', predicate: 'states that if p is a prime number, then for any integer a,', object: 'a^p ≡ a (mod p)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Euler\'s Totient Theorem', predicate: 'states that if n and a are coprime positive integers, then', object: 'a^φ(n) ≡ 1 (mod n)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Euler\'s totient function φ(n)', predicate: 'counts the', object: 'positive integers up to a given integer n that are relatively prime to n', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Chinese Remainder Theorem', predicate: 'provides a unique solution to', object: 'simultaneous congruences with coprime moduli', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Law of Quadratic Reciprocity', predicate: 'is a theorem about', object: 'modular arithmetic that gives conditions for the solvability of quadratic equations modulo prime numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Prime Number Theorem', predicate: 'describes the', object: 'asymptotic distribution of the prime numbers among the positive integers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Dirichlet\'s Theorem on Arithmetic Progressions', predicate: 'states that for any two coprime integers a and d, there are', object: 'infinitely many primes of the form a + nd', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  
  // --- Famous Problems & Conjectures ---
  { subject: 'Riemann Hypothesis', predicate: 'is a conjecture that the', object: 'Riemann zeta function has its zeros only at the negative even integers and complex numbers with real part 1/2', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Riemann Hypothesis', predicate: 'is one of the most important', object: 'unsolved problems in mathematics', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Goldbach Conjecture', predicate: 'states that every even integer greater than 2 is the', object: 'sum of two prime numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Twin Prime Conjecture', predicate: 'states that there are', object: 'infinitely many primes p such that p + 2 is also prime', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Fermat\'s Last Theorem', predicate: 'states that no three positive integers a, b, and c can satisfy the equation', object: 'a^n + b^n = c^n for any integer value of n greater than 2', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Fermat\'s Last Theorem', predicate: 'was proven by', object: 'Andrew Wiles in 1994', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Connections & Applications ---
  { subject: 'RSA algorithm', predicate: 'is a public-key cryptosystem based on the', object: 'presumed difficulty of factoring large integers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Elliptic Curve Cryptography (ECC)', predicate: 'is an approach to public-key cryptography based on the', object: 'algebraic structure of elliptic curves over finite fields', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Analytic Number Theory', predicate: 'uses methods from', object: 'mathematical analysis to solve problems about the integers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Algebraic Number Theory', predicate: 'uses methods from', object: 'abstract algebra to study the integers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  
  // --- p-adic Analysis & Iwasawa Theory ---
  { subject: 'p-adic Number', predicate: 'is an extension of the rational numbers that is', object: 'topologically different from the real numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'p-adic Analysis', predicate: 'is a branch of number theory that deals with the', object: 'analysis of functions of p-adic numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'p-adic L-function', predicate: 'is a p-adic analogue of a', object: 'complex L-function', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'p-adic L-function', predicate: 'interpolates special values of a', object: 'classical L-function p-adically', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  { subject: 'Iwasawa Theory', predicate: 'is the study of', object: 'Galois modules over infinite towers of number fields', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Main Conjecture of Iwasawa Theory', predicate: 'relates', object: 'p-adic L-functions to Selmer groups', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'The Main Conjecture', predicate: 'is a p-adic analogue of the', object: 'analytic class number formula', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  { subject: 'p-adic L-functions', predicate: 'are crucial for the p-adic version of the', object: 'Birch and Swinnerton-Dyer conjecture', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
];