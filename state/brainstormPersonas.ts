// state/brainstormPersonas.ts
import { Persona } from '../types';

// This list is now deprecated and is only kept to prevent import errors in legacy code.
// The brainstorming feature now dynamically pulls personas from the plugin registry.
export const brainstormPersonas: Persona[] = [];
