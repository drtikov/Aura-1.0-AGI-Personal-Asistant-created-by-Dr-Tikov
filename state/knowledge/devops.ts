// state/knowledge/devops.ts
import { KnowledgeFact } from '../../types';

export const devopsKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'DevOps', predicate: 'is a set of practices that combines', object: 'software development (Dev) and IT operations (Ops)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Continuous Integration (CI)', predicate: 'is the practice of', object: 'automating the integration of code changes from multiple contributors into a single software project', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Continuous Deployment (CD)', predicate: 'is a software release process that uses', object: 'automated testing to validate if changes to a codebase are correct and stable for immediate autonomous deployment', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Infrastructure as Code (IaC)', predicate: 'is the process of managing and provisioning computer data centers through', object: 'machine-readable definition files, rather than physical hardware configuration or interactive configuration tools', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Docker', predicate: 'is a set of platform-as-a-service products that use', object: 'OS-level virtualization to deliver software in packages called containers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Kubernetes', predicate: 'is an open-source', object: 'container-orchestration system for automating computer application deployment, scaling, and management', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Site Reliability Engineering (SRE)', predicate: 'is a discipline that incorporates aspects of', object: 'software engineering and applies them to infrastructure and operations problems', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Service Level Objective (SLO)', predicate: 'is a', object: 'target value or range of values for a service level that is measured by a Service Level Indicator (SLI)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Service Level Indicator (SLI)', predicate: 'is a', object: 'carefully defined quantitative measure of some aspect of the level of service that is provided', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Error Budget', predicate: 'is the maximum amount of', object: 'time a technical system can fail without contractual consequences', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Monitoring', predicate: 'in DevOps involves', object: 'collecting and analyzing data to track the performance and health of an application and its infrastructure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Alerting', predicate: 'is the process of', object: 'notifying personnel in response to a significant event or metric crossing a threshold', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];