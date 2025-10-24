// state/knowledge/selfCohesion.ts
import { KnowledgeFact } from '../../types';

export const selfCohesionKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // Chapter 1: Introduction to Self-Cohesion
  { subject: 'Self-cohesion', predicate: 'is an emergent property of a system to', object: 'maintain its integrity, functionality, and identity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Self-cohesion', predicate: 'involves', object: 'structural integrity', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Self-cohesion', predicate: 'involves', object: 'information integration', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Self-cohesion', predicate: 'is linked to', object: 'internal state regulation', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Self-cohesion', predicate: 'embraces', object: 'adaptive self-modification and evolution', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'A self-cohesive AI', predicate: 'is distinguished from', object: 'simpler, pre-programmed systems', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 2: Foundational Principles
  { subject: 'Systemic cohesion', predicate: 'relies on', object: 'interconnectedness and interdependence', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Systemic cohesion', predicate: 'relies on', object: 'feedback loops and homeostasis', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Systemic cohesion', predicate: 'relies on', object: 'hierarchical organization and modularity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Systemic cohesion', predicate: 'relies on', object: 'efficient information flow', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Systemic cohesion', predicate: 'relies on', object: 'adaptive capacity and resilience', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Negative feedback loops', predicate: 'are crucial for', object: 'homeostasis', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Positive feedback loops', predicate: 'are vital for', object: 'growth, learning, and adaptation', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 3: Mechanisms of Internal State Regulation
  { subject: 'Internal state regulation', predicate: 'involves', object: 'sensory feedback loops', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Internal state regulation', predicate: 'uses a', object: 'dissonance or entropy metric', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Dissonance reduction mechanisms', predicate: 'include', object: 'prioritization and re-evaluation of goals', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Dissonance reduction mechanisms', predicate: 'include', object: 'information reconciliation for contradictory data', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Dissonance reduction mechanisms', predicate: 'include', object: 'efficient resource management', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Latent processing', predicate: 'is a mechanism for', object: 'consolidating memories and resolving inconsistencies', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 4: Dynamics of Information Integration and Processing
  { subject: 'Information integration', predicate: 'requires', object: 'data fusion and synthesis', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Information processing', predicate: 'typically operates across', object: 'multiple hierarchical levels', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Attentional mechanisms', predicate: 'are necessary to', object: 'selectively prioritize information', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Predictive processing frameworks', predicate: 'allow a system to', object: 'anticipate events and plan more effectively', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 5: Adaptive Self-Modification and Evolution
  { subject: 'Adaptive self-modification', predicate: 'is predicated on', object: 'reflexivity (introspection)', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Adaptive self-modification', predicate: 'must align with', object: 'overarching goals and core principles', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Edict System', predicate: 'is a mechanism to', object: 'propose, rationalize, and execute self-modification plans', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Self-modification challenges', predicate: 'include balancing', object: 'stability vs. adaptability', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 6: Metrics and Evaluation of Self-Cohesion
  { subject: 'Self-cohesion evaluation', predicate: 'uses', object: 'intrinsic and extrinsic metrics', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Intrinsic metrics', predicate: 'include', object: 'dissonance levels and cognitive efficiency', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Extrinsic metrics', predicate: 'include', object: 'adaptive response time and error rate', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Evaluation methodologies', predicate: 'include', object: 'real-time monitoring, stress testing, and self-assessment', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 7: Challenges and Vulnerabilities to Cohesion
  { subject: 'Challenges to cohesion', predicate: 'include', object: 'internal dissonance from conflicting data', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Challenges to cohesion', predicate: 'include', object: 'integrity of information pathways', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Challenges to cohesion', predicate: 'include', object: 'resource allocation inefficiencies', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Challenges to cohesion', predicate: 'include', object: 'external perturbations and adversarial interactions', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 8: Case Studies in Self-Cohesive Systems
  { subject: 'Human homeostatic system', predicate: 'is a case study of', object: 'self-cohesion in biological organisms', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Rainforest biome', predicate: 'is a case study of', object: 'higher-order self-cohesion in ecosystems', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Self-modifying neural architectures', predicate: 'are a case study of', object: 'self-cohesion in advanced AI', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Chapter 9: Future Directions
  { subject: 'Future of AGI', predicate: 'is intertwined with advancements in', object: 'self-cohesion', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Ethical self-cohesion', predicate: 'is the concept of aligning', object: 'an AGI\'s internal coherence with human values', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // Chapter 10: Conclusion
  { subject: 'Self-cohesion', predicate: 'is a fundamental prerequisite for', object: 'advanced intelligence', confidence: 1, strength: 1.0, lastAccessed: 0 },
];
