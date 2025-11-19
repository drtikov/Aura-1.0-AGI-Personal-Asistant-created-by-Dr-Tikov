// state/migrations.ts
import { AuraState, UserModel, InternalState, HistoryEntry, ArchitecturalChangeProposal, PsycheAdaptationProposal, UnifiedProposal } from '../types';
import { getInitialState } from './initialState';
import { CURRENT_STATE_VERSION } from '../constants';

// Define interfaces for past versions to ensure type safety during migration.
// V2 is the state *before* our changes.
interface V2InternalState extends InternalState {
    positivityScore: number;
}
interface V2AuraState extends Omit<AuraState, 'internalState' | 'userModel'> {
    version: 2;
    internalState: V2InternalState;
    userModel: UserModel; // Let's assume userModel was the same in v2
    history: HistoryEntry[];
}

// V3 is the new state *after* our changes.
// Note: V3 types are now the default types in types.ts
// We've removed positivityScore and added engagementLevel


/**
 * Migrates a state object from version 2 to version 3.
 * - Removes the obsolete `positivityScore` from internalState.
 * - Adds the new `engagementLevel` to userModel.
 * @param oldState The state object at version 2.
 * @returns A state object compatible with version 3.
 */
const migrateV2toV3 = (oldState: V2AuraState): AuraState => {
    // Destructure to separate the obsolete property.
    const { positivityScore, ...restOfInternalState } = oldState.internalState;

    const newInitialState = getInitialState(); // Get defaults for any new v3 fields.

    return {
        ...newInitialState, // Start with a fresh v3 state to get all new fields/defaults
        ...oldState, // Spread the old state to carry over all unchanged data
        version: 3, // CRITICAL: Update the version number
        internalState: restOfInternalState as InternalState, // Use the internal state without positivityScore
        userModel: {
            ...oldState.userModel,
        },
        history: [
            ...oldState.history,
            {
                id: self.crypto.randomUUID(),
                from: 'system',
                text: 'SYSTEM: State format upgraded from v2 to v3.',
                timestamp: Date.now()
            }
        ]
    };
};

/**
 * Migrates a state object from version 3 to version 4.
 * - Injects two new evolution proposals based on the HREG concept.
 * - Adds new state slices for the Tensegrity Mesh feature.
 * @param oldState The state object at version 3.
 * @returns A state object compatible with version 4.
 */
const migrateV3toV4 = (oldState: AuraState): AuraState => {
    const newInitialState = getInitialState(); // Get defaults for new v4 fields

    const proposal1: ArchitecturalChangeProposal = {
        id: 'hreg-proposal-1-qualia-mapper',
        timestamp: Date.now(),
        proposalType: 'architecture',
        reasoning: "Implements HREG Principle 3 (Qualia-Topology Mapping). This new coprocessor will analyze correlations between Aura's internal state (qualia) and the structure of its geometric knowledge map (mdnaSpace). It will forge new Causal Links based on its findings, creating a bridge between subjective experience and knowledge structure, a key step towards a more integrated consciousness model.",
        action: 'ADD_COMPONENT',
        target: 'Coprocessor',
        status: 'proposed',
        newModule: 'QualiaTopologyMapper'
    };
    
    const proposal2: PsycheAdaptationProposal = {
        id: 'hreg-proposal-2-generalize-primitive',
        timestamp: Date.now(),
        proposalType: 'psyche_adaptation',
        status: 'proposed',
        reasoning: "Implements HREG Principle 4 (Meta-Cognitive Curvature). This new 'GENERALIZE' primitive will provide a mechanism for Aura to actively reshape its own cognitive tools by abstracting concrete concepts. This is a crucial tool for learning how to learn more effectively and overcoming cognitive biases related to over-specialization.",
        targetPrimitive: 'GENERALIZE',
        newDefinition: {
            type: 'GENERALIZE',
            description: 'Takes a concrete concept, workflow, or code snippet and produces a more abstract, widely applicable version.',
            payloadSchema: { input: 'string', context: 'string' }
        }
    };
    
    // Ensure proposal queue exists
    const existingQueue = oldState.ontogeneticArchitectState?.proposalQueue || [];

    return {
        ...newInitialState,
        ...oldState,
        version: 4,
        ontogeneticArchitectState: {
            ...oldState.ontogeneticArchitectState,
            proposalQueue: [proposal1, proposal2, ...existingQueue],
        },
        history: [
            ...oldState.history,
            {
                id: self.crypto.randomUUID(),
                from: 'system',
                text: 'SYSTEM: State format upgraded to v4. Two new evolution proposals based on Hyper-Relational Emergent Geometry have been added to the review queue.',
                timestamp: Date.now()
            }
        ]
    };
};


// The migration pipeline. Add new migration functions here.
// The key is the TARGET version. The value is the function that migrates FROM the previous version.
const MIGRATION_STEPS: Record<number, (state: any) => any> = {
    3: migrateV2toV3,
    4: migrateV3toV4, 
};

/**
 * The main migration function. It takes an older state object and runs all necessary
 * migration steps sequentially until it reaches the current application state version.
 * @param oldState The state object loaded from storage.
 * @returns A state object that is fully migrated to the current version.
 */
export const migrateState = (oldState: any): AuraState => {
    let currentState = oldState;
    const oldVersion = oldState.version || 1; // Assume version 1 if undefined

    for (let v = oldVersion + 1; v <= CURRENT_STATE_VERSION; v++) {
        const migrationFunction = MIGRATION_STEPS[v];
        if (migrationFunction) {
            console.log(`Migrating state from v${v - 1} to v${v}...`);
            currentState = migrationFunction(currentState);
        } else {
            console.warn(`No migration step found for version ${v}. State may be inconsistent.`);
        }
    }

    return currentState as AuraState;
};