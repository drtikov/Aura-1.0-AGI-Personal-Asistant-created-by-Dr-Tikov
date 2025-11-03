// state/knowledge/entrepreneurNetwork.ts
import { KnowledgeFact } from '../../types';

// This file simulates a multidimensional database of a business network.
export const entrepreneurNetworkData: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // Company: InnovateHub
  { subject: 'InnovateHub', predicate: 'is a', object: 'company', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'InnovateHub', predicate: 'operates in', object: 'SaaS', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'InnovateHub', predicate: 'focuses on', object: 'AI-driven project management', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'InnovateHub', predicate: 'funding stage is', object: 'Series A', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'InnovateHub', predicate: 'is seeking', object: 'partnerships in enterprise software', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  { subject: 'Jane Doe', predicate: 'is CEO of', object: 'InnovateHub', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Company: BioSynth
  { subject: 'BioSynth', predicate: 'is a', object: 'company', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'BioSynth', predicate: 'operates in', object: 'Biotech', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'BioSynth', predicate: 'focuses on', object: 'synthetic protein generation', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'BioSynth', predicate: 'funding stage is', object: 'Seed', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'BioSynth', predicate: 'is seeking', object: 'angel investment', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Dr. Alan Grant', predicate: 'is founder of', object: 'BioSynth', confidence: 1, strength: 1.0, lastAccessed: 0 },

  // Company: FinTech Secure
  { subject: 'FinTech Secure', predicate: 'is a', object: 'company', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'FinTech Secure', predicate: 'operates in', object: 'FinTech', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'FinTech Secure', predicate: 'focuses on', object: 'blockchain-based payment security', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'FinTech Secure', predicate: 'funding stage is', object: 'Series B', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'FinTech Secure', predicate: 'is seeking', object: 'strategic acquisition opportunities', confidence: 0.8, strength: 1.0, lastAccessed: 0 },
  { subject: 'John Smith', predicate: 'is CTO of', object: 'FinTech Secure', confidence: 1, strength: 1.0, lastAccessed: 0 },
  
  // Person: Jane Doe
  { subject: 'Jane Doe', predicate: 'is an', object: 'entrepreneur', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Jane Doe', predicate: 'has expertise in', object: 'SaaS and AI', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Jane Doe', predicate: 'is offering', object: 'mentorship in product-market fit', confidence: 0.9, strength: 1.0, lastAccessed: 0 },

  // Person: Dr. Alan Grant
  { subject: 'Dr. Alan Grant', predicate: 'is an', object: 'entrepreneur', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Dr. Alan Grant', predicate: 'has expertise in', object: 'Biotech and genetics', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Dr. Alan Grant', predicate: 'is seeking', object: 'a co-founder with business development experience', confidence: 1, strength: 1.0, lastAccessed: 0 },
];
