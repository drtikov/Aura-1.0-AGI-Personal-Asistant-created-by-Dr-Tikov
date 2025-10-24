// state/knowledge/digitalAssetManagement.ts
import { KnowledgeFact } from '../../types';

export const digitalAssetManagementKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Digital Asset', predicate: 'is', object: 'any digital file or artifact that has intrinsic or extrinsic value', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Co-created artifacts in Aura', predicate: 'include', object: 'CoCreatedWorkflows and custom Plugins', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Artifact Lifecycle', predicate: 'includes', object: 'creation, usage, maintenance, and retirement', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Usage Metrics', predicate: 'can be used to determine if an', object: 'artifact is still valuable or can be retired', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Curator', predicate: 'is responsible for', object: 'managing the library of co-created artifacts', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];