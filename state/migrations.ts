
import { AuraState, AgentProfile, InternalState } from '../types';
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
    userModel: AgentProfile; // Let's assume userModel was the same in v2
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
        internalState: restOfInternalState, // Use the internal state without positivityScore
        userModel: {
            ...oldState.userModel,
            engagementLevel: newInitialState.userModel.engagementLevel, // Add the new field with its default
        },
        history: [
            ...oldState.history,
            {
                id: self.crypto.randomUUID(),
                from: 'system',
                text: 'SYSTEM: State format upgraded from v2 to v3.'
            }
        ]
    };
};


// The migration pipeline. Add new migration functions here.
// The key is the TARGET version. The value is the function that migrates FROM the previous version.
const MIGRATION_STEPS: Record<number, (state: any) => any> = {
    3: migrateV2toV3,
    // Example for the future:
    // 4: migrateV3toV4, 
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
