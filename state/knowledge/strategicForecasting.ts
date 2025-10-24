// state/knowledge/strategicForecasting.ts
import { KnowledgeFact } from '../../types';

export const strategicForecastingKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Strategic Forecasting', predicate: 'is the process of', object: 'predicting future outcomes and trends to inform long-term planning', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Trend Analysis', predicate: 'is the practice of', object: 'collecting information and attempting to spot a pattern', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Scenario Planning', predicate: 'is a strategic planning method that organizations use to', object: 'make flexible long-term plans', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'ARIMA', predicate: 'is an acronym for', object: 'Autoregressive Integrated Moving Average', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'ARIMA', predicate: 'is a model used in statistics and econometrics to', object: 'analyze and forecast time series data', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Risk Assessment', predicate: 'is the process of', object: 'identifying potential hazards and analyzing what could happen if a hazard occurs', confidence: 1, strength: 1.0, lastAccessed: 0 },
];