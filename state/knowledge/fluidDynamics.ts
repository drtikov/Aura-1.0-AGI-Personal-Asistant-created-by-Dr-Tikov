// state/knowledge/fluidDynamics.ts
import { KnowledgeFact } from '../../types';

export const fluidDynamicsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Fluid Dynamics', predicate: 'is a subdiscipline of fluid mechanics that describes the', object: 'flow of fluids—liquids and gases', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Turbulence', predicate: 'is a fluid motion characterized by', object: 'chaotic changes in pressure and flow velocity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Vorticity', predicate: 'is a pseudovector field that describes the', object: 'local spinning motion of a continuum near some point', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Incompressibility', predicate: 'in fluid dynamics is a property of a flow where the', object: 'divergence of the flow velocity is zero', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'The 3D incompressible Navier-Stokes problem', predicate: 'concerns', object: 'the existence of smooth, global solutions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];