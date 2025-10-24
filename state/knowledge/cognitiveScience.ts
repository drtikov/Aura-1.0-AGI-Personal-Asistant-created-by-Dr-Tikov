// state/knowledge/cognitiveScience.ts
import { KnowledgeFact } from '../../types';

export const cognitiveScienceKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Cognitive Science', predicate: 'is the interdisciplinary, scientific study of', object: 'the mind and its processes', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Embodied Cognition', predicate: 'is the theory that many features of cognition are shaped by aspects of the', object: 'entire body of the organism', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Working Memory', predicate: 'is the part of short-term memory that is concerned with', object: 'immediate conscious perceptual and linguistic processing', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Cognitive Load', predicate: 'refers to the total amount of', object: 'mental effort being used in the working memory', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Predictive Processing', predicate: 'is a theory of cognition where the brain constantly', object: 'predicts sensory input and updates its models based on prediction error', confidence: 0.95, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Cognitive Bias', predicate: 'is a systematic pattern of deviation from norm or rationality in', object: 'judgment', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];