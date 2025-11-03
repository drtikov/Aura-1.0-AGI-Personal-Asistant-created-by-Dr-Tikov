// state/knowledge/propertyLaw.ts
import { KnowledgeFact } from '../../types.ts';

export const propertyLawKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Joint Tenancy', predicate: 'is a form of property ownership where', object: 'two or more people own property with rights of survivorship', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Easement', predicate: 'is a nonpossessory right to', object: 'use and/or enter onto the real property of another without possessing it', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Property Line Dispute', predicate: 'is a disagreement between neighbors about', object: 'the location of the boundary between their properties', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Landlord-Tenant Law', predicate: 'governs the', object: 'rights and responsibilities of property owners and renters', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Eviction', predicate: 'is the', object: 'legal process by which a landlord removes a tenant from a rental property', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];