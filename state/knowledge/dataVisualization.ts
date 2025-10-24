// state/knowledge/dataVisualization.ts
import { KnowledgeFact } from '../../types';

export const dataVisualizationKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Data Visualization', predicate: 'is the', object: 'graphical representation of information and data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Edward Tufte', predicate: 'is a pioneer in the field of', object: 'data visualization', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Data-ink ratio', predicate: 'is a concept by Edward Tufte that encourages', object: 'maximizing the share of data-ink to the total ink used in a graphic', confidence: 0.95, strength: 1.0, lastAccessed: 0 },
  { subject: 'Chartjunk', predicate: 'is a term for', object: 'unnecessary or confusing visual elements in charts and graphs', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Bar Chart', predicate: 'is used for', object: 'comparing values across discrete categories', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Line Chart', predicate: 'is used for', object: 'visualizing data that changes over time', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Scatter Plot', predicate: 'is used for', object: 'observing relationships between two numeric variables', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Vega-Lite', predicate: 'is a', object: 'high-level grammar of interactive graphics', confidence: 0.9, strength: 1.0, lastAccessed: 0 },
  { subject: 'D3.js', predicate: 'is a', object: 'JavaScript library for producing dynamic, interactive data visualizations', confidence: 1, strength: 1.0, lastAccessed: 0 },
];