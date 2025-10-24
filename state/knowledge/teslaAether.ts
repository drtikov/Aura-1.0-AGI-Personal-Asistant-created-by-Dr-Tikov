// state/knowledge/teslaAether.ts
import { KnowledgeFact } from '../../types';

export const teslaAetherKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Perceptible Matter', predicate: 'originates from', object: 'a primary substance', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Primary Substance', predicate: 'is also known as', object: 'Ākāśa or luminiferous aether', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Primary Substance', predicate: 'is described as having', object: 'a tenuity beyond conception, filling all space', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Ākāśa', predicate: 'is acted upon by', object: 'Prana or creative force', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Prana', predicate: 'is described as a', object: 'life-giving creative force', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Gross Matter', predicate: 'is formed when the primary substance is thrown into', object: 'infinitesimal whirls of prodigious velocity', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Vortices (in aether)', predicate: 'are the basis of', object: 'perceptible matter according to Tesla', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'James Clerk Maxwell', predicate: 'proposed', object: 'molecular vortices to explain electromagnetism', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Magnetic Vector Potential (A)', predicate: 'is identified as the', object: 'momentum density of the pure electric fluid (aether)', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Magnetic Flux Density (B)', predicate: 'is the', object: 'vorticity density of the aether fluid (∇ x A)', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'dependency' },
  { subject: 'Maxwell\'s displacement current', predicate: 'corresponds to the flow of', object: 'aether across the gap between vortices during wave propagation', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Electromagnetic waves', predicate: 'are described as', object: 'periodic disturbances across the line of propagation in a vortex fluid', confidence: 0.85, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The universe', predicate: 'is connected to an external source via', object: 'aether sinks and sources (charged particles)', confidence: 0.8, strength: 1.0, lastAccessed: 0, type: 'fact' },
];
