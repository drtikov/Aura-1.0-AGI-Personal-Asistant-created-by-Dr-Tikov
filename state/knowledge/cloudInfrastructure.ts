// state/knowledge/cloudInfrastructure.ts
import { KnowledgeFact } from '../../types';

export const cloudInfrastructureKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- General Cloud & IaC ---
  { subject: 'Infrastructure as Code (IaC)', predicate: 'is the process of managing infrastructure in a descriptive model, using the same versioning as DevOps team uses for source code', object: 'True', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Terraform', predicate: 'is a', object: 'popular open-source IaC tool created by HashiCorp', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Terraform', predicate: 'uses a declarative configuration language known as', object: 'HashiCorp Configuration Language (HCL)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Terraform state file', predicate: 'is used by Terraform to', object: 'map real world resources to your configuration', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Terraform CLI ---
  { subject: 'terraform init', predicate: 'is used to', object: 'initialize a working directory containing Terraform configuration files', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'terraform plan', predicate: 'creates an', object: 'execution plan, showing what Terraform will do when you call apply', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'terraform apply', predicate: 'executes the actions proposed in a', object: 'Terraform plan', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'terraform destroy', predicate: 'is used to', object: 'destroy the Terraform-managed infrastructure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Containers ---
  { subject: 'Docker', predicate: 'is a platform for developing, shipping, and running applications in', object: 'containers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Container', predicate: 'is a standard unit of software that', object: 'packages up code and all its dependencies', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Kubernetes (K8s)', predicate: 'is an open-source system for', object: 'automating deployment, scaling, and management of containerized applications', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Pod', predicate: 'is the smallest deployable unit in', object: 'Kubernetes', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // --- Kubernetes CLI (kubectl) ---
  { subject: 'kubectl get pods', predicate: 'is used to', object: 'list all pods in the current namespace', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'kubectl describe pod [pod-name]', predicate: 'is used to', object: 'show detailed information about a specific pod', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'kubectl logs [pod-name]', predicate: 'is used to', object: 'print the logs for a specific pod', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'kubectl apply -f [filename]', predicate: 'is used to', object: 'apply a configuration to a resource by filename', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- AWS ---
  { subject: 'Amazon EC2', predicate: 'is an AWS service that provides', object: 'secure, resizable compute capacity in the cloud (Virtual Servers)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Amazon S3', predicate: 'is an AWS service for', object: 'object storage', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'AWS VPC', predicate: 'stands for', object: 'Virtual Private Cloud', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'AWS VPC', predicate: 'lets you provision a logically isolated section of the', object: 'AWS Cloud where you can launch AWS resources', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'AWS IAM', predicate: 'stands for', object: 'Identity and Access Management', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'AWS IAM', predicate: 'enables you to manage access to', object: 'AWS services and resources securely', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  
  // --- AWS CLI ---
  { subject: 'aws s3 ls', predicate: 'is used to', object: 'list S3 buckets or objects', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'aws ec2 describe-instances', predicate: 'is used to', object: 'describe one or more of your Amazon EC2 instances', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- GCP ---
  { subject: 'Google Compute Engine (GCE)', predicate: 'is the IaaS component of', object: 'Google Cloud Platform', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Google Cloud Storage', predicate: 'is a RESTful online file storage web service for', object: 'storing and accessing data on Google Cloud Platform infrastructure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Google Kubernetes Engine (GKE)', predicate: 'is a managed environment for deploying, managing, and scaling', object: 'containerized applications using Google infrastructure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- GCP CLI (gcloud) ---
  { subject: 'gcloud compute instances list', predicate: 'is used to', object: 'list all Compute Engine instances in a project', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'gcloud sql instances describe [instance-name]', predicate: 'is used to', object: 'get information about a Cloud SQL instance', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },

  // --- Azure ---
  { subject: 'Azure Virtual Machines', predicate: 'is an on-demand, scalable computing resource that', object: 'Azure offers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Azure Blob Storage', predicate: 'is Microsoft\'s object storage solution for', object: 'the cloud', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Azure Kubernetes Service (AKS)', predicate: 'simplifies deploying a managed', object: 'Kubernetes cluster in Azure', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  
  // --- Azure CLI (az) ---
  { subject: 'az vm list', predicate: 'is used to', object: 'list details of virtual machines', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'az storage blob list', predicate: 'is used to', object: 'list blobs in a given container', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];