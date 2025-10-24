// core/schemaGenerator.ts
import { AuraState, SyscallCall } from '../types';
// FIX: Imported CURRENT_STATE_VERSION from constants.ts where it is defined, instead of types.ts.
import { CURRENT_STATE_VERSION } from '../constants';
import { personas } from '../state/personas';
import { brainstormPersonas } from '../state/brainstormPersonas';

export const generateManifest = (state: AuraState): object => ({
    name: "Aura Architectural Schema",
    version: CURRENT_STATE_VERSION,
    generatedAt: new Date().toISOString(),
    auraTelos: state.telosEngine.valueHierarchy.telos,
    files: [
        "state.schema.json",
        "architecture.schema.json",
        "syscalls.schema.json",
        "VFS/"
    ]
});

export const generateArchitectureSchema = (state: AuraState): object => {
    const { pluginState } = state;

    const allPersonas = [...personas, ...brainstormPersonas];
    const uniquePersonas = Array.from(new Map(allPersonas.map(p => [p.id, p])).values());

    return {
        personas: uniquePersonas.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            systemInstruction: p.systemInstruction,
        })),
        plugins: pluginState.registry.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            type: p.type,
            status: p.status,
            ...(p.toolSchema && { toolSchema: p.toolSchema })
        })),
        coprocessors: pluginState.registry
            .filter(p => p.type === 'COPROCESSOR')
            .map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                status: p.status,
            })),
    };
};

export const generateStateSchema = (): object => ({
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "AuraState",
    "description": "The complete state object for the Aura Symbiotic AGI.",
    "type": "object",
    "properties": {
        "version": { "type": "number", "description": "The version of the state schema." },
        "theme": { "type": "string", "description": "The current UI theme identifier." },
        "language": { "type": "string", "description": "The current UI language." },
        "history": { "type": "array", "items": { "type": "object" }, "description": "Log of all interactions." },
        // Add more top-level properties as needed...
        "internalState": {
            "type": "object",
            "properties": {
                "status": { "type": "string", "enum": ["idle", "thinking", "acting", "CONTEMPLATIVE", "processing", "introspecting"] },
                "gunaState": { "type": "string", "enum": ["Sattva", "Rajas", "Tamas", "Dharma", "Guna-Teeta"] },
                "wisdomSignal": { "type": "number" },
                "happinessSignal": { "type": "number" },
                // ... other internalState properties
            }
        },
        "userModel": {
            "type": "object",
            "properties": {
                "trustLevel": { "type": "number" },
                "sentimentScore": { "type": "number" },
                // ... other userModel properties
            }
        },
        "selfProgrammingState": {
            "type": "object",
            "properties": {
                "virtualFileSystem": {
                    "type": "object",
                    "patternProperties": {
                        ".*": { "type": "string" }
                    }
                }
            }
        }
        // ... It would be very verbose to list all 100+ state slices here.
        // This is a representative sample. A full implementation would be exhaustive.
    },
    "required": ["version", "theme", "history", "internalState", "userModel"]
});

export const generateSyscallSchema = (): object[] => {
    // This is a representative sample of syscalls. A complete implementation would be very large.
    const syscalls: { name: SyscallCall, description: string, argsSchema: object }[] = [
        {
            name: 'SET_THEME',
            description: 'Sets the UI theme.',
            argsSchema: { "type": "string", "description": "The theme identifier (e.g., 'ui-1')." }
        },
        {
            name: 'ADD_HISTORY_ENTRY',
            description: 'Adds a new entry to the chat history.',
            argsSchema: {
                "type": "object",
                "properties": {
                    "from": { "type": "string", "enum": ["user", "bot", "system", "tool"] },
                    "text": { "type": "string" }
                },
                "required": ["from"]
            }
        },
        {
            name: 'ADD_FACT',
            description: 'Adds a new fact to the knowledge graph.',
            argsSchema: {
                "type": "object",
                "properties": {
                    "subject": { "type": "string" },
                    "predicate": { "type": "string" },
                    "object": { "type": "string" },
                    "confidence": { "type": "number" },
                },
                "required": ["subject", "predicate", "object", "confidence"]
            }
        },
        {
            name: 'BUILD_GOAL_TREE',
            description: 'Constructs a new hierarchical goal tree.',
            argsSchema: {
                "type": "object",
                "properties": {
                    "rootGoal": { "type": "string" },
                    "decomposition": { "type": "object" }
                },
                "required": ["rootGoal", "decomposition"]
            }
        },
        {
            name: 'EXECUTE_TOOL',
            description: 'Requests the execution of a registered tool.',
            argsSchema: {
                "type": "object",
                "properties": {
                    "toolName": { "type": "string" },
                    "args": { "type": "object" }
                },
                "required": ["toolName", "args"]
            }
        }
    ];

    return syscalls;
};