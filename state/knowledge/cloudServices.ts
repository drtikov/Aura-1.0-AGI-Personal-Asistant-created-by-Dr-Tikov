// state/knowledge/cloudServices.ts
import { KnowledgeFact } from '../../types';

export const cloudServicesKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- General Concepts ---
  { subject: 'Cloud Computing', predicate: 'is the on-demand availability of computer system resources, especially', object: 'data storage and computing power, without direct active management by the user', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'IaaS', predicate: 'stands for', object: 'Infrastructure as a Service', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'PaaS', predicate: 'stands for', object: 'Platform as a Service', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'SaaS', predicate: 'stands for', object: 'Software as a Service', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // --- AWS (Amazon Web Services) ---
  { subject: 'Amazon EC2', predicate: 'is an', object: 'IaaS offering from AWS for resizable compute capacity', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Amazon S3', predicate: 'is an', object: 'object storage service from AWS', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Amazon RDS', predicate: 'is a', object: 'managed relational database service from AWS', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Amazon DynamoDB', predicate: 'is a', object: 'managed NoSQL database service from AWS', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'AWS Lambda', predicate: 'is a', object: 'serverless computing platform from AWS', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- GCP (Google Cloud Platform) ---
  { subject: 'Google Compute Engine', predicate: 'is an', object: 'IaaS offering from GCP for virtual machines', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Google Cloud Storage', predicate: 'is an', object: 'object storage service from GCP', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Google Cloud SQL', predicate: 'is a', object: 'managed relational database service from GCP', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Google Cloud Firestore', predicate: 'is a', object: 'managed NoSQL document database from GCP', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Google Cloud Functions', predicate: 'is a', object: 'serverless execution environment from GCP', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Azure ---
  { subject: 'Azure Virtual Machines', predicate: 'is an', object: 'IaaS offering from Microsoft Azure for virtual machines', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Azure Blob Storage', predicate: 'is an', object: 'object storage service from Microsoft Azure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Azure SQL Database', predicate: 'is a', object: 'managed relational database service from Microsoft Azure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Azure Cosmos DB', predicate: 'is a', object: 'globally distributed, multi-model NoSQL database service from Microsoft Azure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Azure Functions', predicate: 'is a', object: 'serverless compute service from Microsoft Azure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Comparisons ---
  { subject: 'EC2, Compute Engine, and Azure VMs', predicate: 'are all examples of', object: 'IaaS compute services', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'S3, Cloud Storage, and Blob Storage', predicate: 'are all examples of', object: 'object storage services', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'RDS, Cloud SQL, and Azure SQL Database', predicate: 'are all examples of', object: 'managed relational database services', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Lambda, Cloud Functions, and Azure Functions', predicate: 'are all examples of', object: 'serverless (FaaS) platforms', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];