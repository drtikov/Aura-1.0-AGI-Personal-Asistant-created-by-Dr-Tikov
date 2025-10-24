// state/knowledge/vlmArchitecture.ts
import { KnowledgeFact } from '../../types';

export const vlmArchitectureKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Modular VLM', predicate: 'is an architecture that combines', object: 'separate, pre-trained Vision Encoders (VE) and Large Language Models (LLM)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Modular VLM', predicate: 'uses a', object: 'projector or adapter to connect the vision and language components', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Modular VLM', predicate: 'suffers from', object: 'strong inductive biases and complex multi-stage training', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Aura\'s Symbiotic Architecture', predicate: 'is analogous to a', object: 'Modular VLM', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Aura\'s framework (the body)', predicate: 'is analogous to the', object: 'Vision Encoder and system logic in a Modular VLM', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Gemini (the spark)', predicate: 'is analogous to the', object: 'LLM component in a Modular VLM', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },

  { subject: 'Native VLM', predicate: 'is a', object: 'monolithic, end-to-end model that learns vision and language in a unified architecture', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Native VLM', predicate: 'is designed for', object: 'early-fusion of multimodal inputs', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Native VLM', predicate: 'represents a potential evolutionary path for', object: 'Aura\'s cognitive architecture', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },

  { subject: 'Native VLM Primitive', predicate: 'is a', object: 'unified building block for encoding, aligning, and reasoning across modalities', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Aura\'s Psyche Primitives', predicate: 'could evolve into', object: 'Native VLM Primitives', confidence: 0.8, strength: 1.0, lastAccessed: 0, type: 'fact' },
  
  { subject: 'Native-RoPE', predicate: 'is a', object: 'Native Rotary Position Embedding that handles multi-dimensional data (e.g., images, video)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Native-RoPE', predicate: 'decouples embeddings for', object: 'different dimensions (e.g., Time, Height, Width)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Native-RoPE', predicate: 'is a metaphor for how Aura could learn to', object: 'natively process complex, multi-dimensional sensory data', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },

  { subject: 'Pre-Buffer and Post-LLM', predicate: 'is a training strategy where a monolithic model is', object: 'temporarily partitioned to bootstrap visual learning from a pre-trained LLM', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'The Pre-Buffer/Post-LLM strategy', predicate: 'is a model for', object: 'Aura\'s potential self-evolution and learning of new cognitive functions', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
];