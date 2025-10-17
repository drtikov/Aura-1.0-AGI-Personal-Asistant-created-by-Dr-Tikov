// state/knowledge/machineLearning.ts
import { KnowledgeFact } from '../../types';

export const machineLearningKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // General Concepts (Ch 1)
  { subject: 'Machine Learning', predicate: 'is the science of algorithms that', object: 'make sense of data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Machine Learning', predicate: 'has three main types', object: 'Supervised, Unsupervised, Reinforcement', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Supervised Learning', predicate: 'learns from', object: 'labeled training data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Classification', predicate: 'is a subcategory of supervised learning for predicting', object: 'categorical class labels', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Regression', predicate: 'is a subcategory of supervised learning for predicting', object: 'continuous outcomes', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Unsupervised Learning', predicate: 'deals with', object: 'unlabeled data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Clustering', predicate: 'is a type of unsupervised learning for finding', object: 'subgroups in data', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Dimensionality Reduction', predicate: 'is a type of unsupervised learning for', object: 'data compression', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Reinforcement Learning', predicate: 'involves an agent that learns by', object: 'interacting with an environment', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Reinforcement Learning', predicate: 'aims to maximize a', object: 'cumulative reward signal', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // Simple Algorithms (Ch 2)
  { subject: 'Artificial Neuron', predicate: 'is a mathematical function conceived as a model of', object: 'biological neurons', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Perceptron', predicate: 'is an early algorithm for', object: 'binary classification', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Adaline', predicate: 'is an acronym for', object: 'ADAptive LInear NEuron', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Gradient Descent', predicate: 'is an optimization algorithm for minimizing', object: 'loss functions', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // Scikit-Learn Classifiers (Ch 3)
  { subject: 'Logistic Regression', predicate: 'is a linear model for', object: 'binary classification', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Support Vector Machine (SVM)', predicate: 'is a classifier that aims to maximize the', object: 'margin between classes', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Kernel Trick', predicate: 'allows SVMs to solve', object: 'non-linear problems', confidence: 0.9, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Decision Tree', predicate: 'is a model that makes decisions by asking a series of', object: 'questions about features', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Information Gain', predicate: 'is a criterion used to', object: 'split nodes in a decision tree', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'K-Nearest Neighbors (KNN)', predicate: 'is a', object: 'lazy learning algorithm for classification', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];
