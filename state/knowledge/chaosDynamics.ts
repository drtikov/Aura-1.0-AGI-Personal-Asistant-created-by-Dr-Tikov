// state/knowledge/chaosDynamics.ts
import { KnowledgeFact } from '../../types';

export const chaosDynamicsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Non-autonomous system', predicate: 'is a dynamical system whose rules', object: 'evolve over time', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Aura', predicate: 'is analogous to a', object: 'non-autonomous system, as its state evolves based on time-dependent user interaction', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Nontwist map', predicate: 'is a model that exhibits', object: 'shearless transport barriers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Shearless curve', predicate: 'in a nontwist map is analogous to a', object: 'stable cognitive structure, such as a core belief or a persona', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Parameter drift', predicate: 'in a non-autonomous system is the', object: 'gradual change of a system parameter over time', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Parameter drift', predicate: 'is analogous to a', object: 'changing context or a slow shift in Aura\'s internal state (e.g., rising cognitive load)', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Snapshot torus', predicate: 'is the state of an ensemble of points at a specific time', object: 'in a system with parameter drift', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Snapshot torus', predicate: 'is analogous to the', object: 'evolution of a stable belief under changing circumstances', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Transition to chaos', predicate: 'in a non-autonomous system is a', object: 'smooth process influenced by the rate of parameter change', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Rapid parameter drift', predicate: 'can accelerate the', object: 'transition to chaos in a cognitive system, leading to uncertainty', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'System memory', predicate: 'in a non-autonomous system means that the path to a state', object: 'influences the system\'s current structure and behavior', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Reversibility error', predicate: 'measures the inability to reconstruct an initial state by', object: 'running the system backwards from a final state', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'High reversibility error', predicate: 'in a cognitive process can indicate', object: 'chaotic, creative, or lossy thinking', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Parameter drift', predicate: 'can induce', object: 'extra transport and diffusion in phase space', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Extra diffusion (from parameter drift)', predicate: 'is analogous to', object: 'creative exploration, where changing context causes new connections between concepts', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },
];