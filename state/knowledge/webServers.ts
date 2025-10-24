// state/knowledge/webServers.ts
import { KnowledgeFact } from '../../types';

export const webServersKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Web Server', predicate: 'is software and underlying hardware that accepts requests via', object: 'HTTP or its secure variant HTTPS', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Nginx', predicate: 'is a', object: 'high-performance web server, reverse proxy, and load balancer', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Apache HTTP Server', predicate: 'is a', object: 'free and open-source cross-platform web server software', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Reverse Proxy', predicate: 'is a type of proxy server that retrieves resources on behalf of a client from', object: 'one or more servers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Load Balancer', predicate: 'distributes network or application traffic across', object: 'multiple servers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Round Robin', predicate: 'is a', object: 'load balancing algorithm where requests are distributed sequentially among a group of servers', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'HTTP/2', predicate: 'is a major revision of the HTTP network protocol that allows for', object: 'multiplexing requests over a single TCP connection', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'HTTPS', predicate: 'is the secure version of HTTP, where communications are encrypted using', object: 'TLS (Transport Layer Security)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`Cache-Control`', predicate: 'is an', object: 'HTTP header used to specify browser caching policies', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Content Delivery Network (CDN)', predicate: 'is a geographically distributed network of proxy servers that', object: 'provides high availability and performance by distributing the service spatially relative to end-users', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: '`server` block', predicate: 'in Nginx configuration defines', object: 'a virtual server to handle requests for a particular domain', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`location` block', predicate: 'in Nginx configuration defines', object: 'how to process requests for different URIs', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: '`proxy_pass` directive', predicate: 'in Nginx is used to', object: 'forward requests to another server (acting as a reverse proxy)', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
];