// state/knowledge/gameTheory.ts
import { KnowledgeFact } from '../../types';

export const gameTheoryKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Game Theory', predicate: 'is the study of', object: 'mathematical models of strategic interaction among rational decision-makers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Zero-Sum Game', predicate: 'is a situation where', object: 'one person\'s gain is equivalent to another\'s loss', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Prisoner\'s Dilemma', predicate: 'is a standard example of a game analyzed in game theory that shows why', object: 'two completely rational individuals might not cooperate, even if it appears that it is in their best interests to do so', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Nash Equilibrium', predicate: 'is a proposed solution of a non-cooperative game involving two or more players in which', object: 'each player is assumed to know the equilibrium strategies of the other players, and no player has anything to gain by changing only their own strategy', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Mechanism Design', predicate: 'is a field in economics and game theory that takes an', object: 'engineering approach to designing economic mechanisms or incentives', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
];