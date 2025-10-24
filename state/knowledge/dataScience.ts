// state/knowledge/dataScience.ts
import { KnowledgeFact } from '../../types';

export const dataScienceKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Data Science', predicate: 'is an interdisciplinary field that uses', object: 'scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Supervised Learning', predicate: 'is a type of machine learning where the model learns from', object: 'labeled data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Unsupervised Learning', predicate: 'is a type of machine learning where the model learns from', object: 'unlabeled data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Classification', predicate: 'is a supervised learning task that predicts a', object: 'categorical label', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Regression', predicate: 'is a supervised learning task that predicts a', object: 'continuous value', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Clustering', predicate: 'is an unsupervised learning task that groups', object: 'similar data points together', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Data Cleaning', predicate: 'is the process of', object: 'detecting and correcting corrupt or inaccurate records from a record set, table, or database', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Feature Engineering', predicate: 'is the process of using domain knowledge to', object: 'create features that make machine learning algorithms work better', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Overfitting', predicate: 'occurs when a model learns the', object: 'training data too well, including its noise, and performs poorly on new, unseen data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Pandas', predicate: 'is a popular Python library for', object: 'data manipulation and analysis', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Scikit-learn', predicate: 'is a popular Python library for', object: 'machine learning', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Mean', predicate: 'is the', object: 'average of a set of numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Median', predicate: 'is the', object: 'middle value in a sorted list of numbers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Standard Deviation', predicate: 'is a measure of the amount of', object: 'variation or dispersion of a set of values', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];