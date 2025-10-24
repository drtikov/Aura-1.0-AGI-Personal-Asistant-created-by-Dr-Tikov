// state/knowledge/geology.ts
import { KnowledgeFact } from '../../types';

export const geologyKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Geology', predicate: 'is an earth science concerned with the', object: 'solid Earth, the rocks of which it is composed, and the processes by which they change over time', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Plate Tectonics', predicate: 'is the scientific theory describing the large-scale motion of', object: 'seven large plates and the movements of a larger number of smaller plates of Earth\'s lithosphere', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'theorem' },
  { subject: 'Rock Cycle', predicate: 'is a basic concept in geology that describes transitions through geologic time among the', object: 'three main rock types: igneous, sedimentary, and metamorphic', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'fact' },
  { subject: 'Igneous Rock', predicate: 'is formed through the', object: 'cooling and solidification of magma or lava', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Sedimentary Rock', predicate: 'is formed by the', object: 'accumulation or deposition of mineral or organic particles at the Earth\'s surface', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Metamorphic Rock', predicate: 'arises from the transformation of existing rock types, in a process called', object: 'metamorphism', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
];