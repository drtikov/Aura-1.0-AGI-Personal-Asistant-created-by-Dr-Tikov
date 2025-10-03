// state/reducer.ts
import { AuraState, Action } from '../types';
import { getInitialState } from './initialState';
import { coreReducer } from './reducers/core';
import { memoryReducer } from './reducers/memory';
import { architectureReducer } from './reducers/architecture';
import { planningReducer } from './reducers/planning';
import { enginesReducer } from './reducers/engines';
import { logsReducer } from './reducers/logs';
import { systemReducer } from './reducers/system';
import { neuroCortexReducer } from './reducers/neuroCortex';
import { granularCortexReducer } from './reducers/granularCortex';
import { koniocortexReducer } from './reducers/koniocortex';
import { premotorPlannerReducer } from './reducers/premotor';
import { basalGangliaReducer } from './reducers/basalGanglia';
import { cerebellumReducer } from './reducers/cerebellum';
import { psycheReducer } from './reducers/psyche';
import { motorCortexReducer } from './reducers/motorCortex';
import { praxisResonatorReducer } from './reducers/praxisResonator';
import { cognitiveForgeReducer } from './reducers/cognitiveForge';
import { pluginReducer } from './reducers/pluginReducer';
import { socialCognitionReducer } from './reducers/socialCognition';
import { sandboxReducer } from './reducers/sandbox';
import { doxasticReducer } from './reducers/doxastic';
import { metaphorReducer } from './reducers/metaphor';
import { hovaReducer } from './reducers/hova';
import { documentForgeReducer } from './reducers/documentForge';
import { internalScientistReducer } from './reducers/internalScientist';
import { metisSandboxReducer } from './reducers/metisSandbox';

const reducers = [
    coreReducer,
    memoryReducer,
    architectureReducer,
    planningReducer,
    enginesReducer,
    logsReducer,
    systemReducer,
    neuroCortexReducer,
    granularCortexReducer,
    koniocortexReducer,
    premotorPlannerReducer,
    basalGangliaReducer,
    cerebellumReducer,
    psycheReducer,
    motorCortexReducer,
    praxisResonatorReducer,
    cognitiveForgeReducer,
    pluginReducer,
    socialCognitionReducer,
    sandboxReducer,
    doxasticReducer,
    metaphorReducer,
    hovaReducer,
    documentForgeReducer,
    internalScientistReducer,
    metisSandboxReducer,
];

export const auraReducer = (state: AuraState, action: Action): AuraState => {
    if (action.type === 'RESET_STATE') {
        return getInitialState();
    }
    if (action.type === 'IMPORT_STATE' || action.type === 'RESTORE_STATE_FROM_MEMRISTOR') {
        return action.payload;
    }

    // Intercept syscalls to add to the event bus before they are processed
    if (action.type === 'SYSCALL') {
        const { wisdomSignal, happinessSignal, loveSignal, gunaState } = state.internalState;
        const event: any = {
            id: self.crypto.randomUUID(),
            timestamp: Date.now(),
            type: action.payload.call,
            payload: action.payload.args,
            qualiaVector: { wisdom: wisdomSignal, happiness: happinessSignal, love: loveSignal, gunaState },
        };
        // This is a direct mutation for performance, but it's contained. A better way would be a separate reducer.
        state.eventBus = [event, ...state.eventBus].slice(0, 50);
    }

    const changes = reducers.reduce((acc, reducer) => {
        return { ...acc, ...reducer(state, action) };
    }, {});

    if (Object.keys(changes).length > 0) {
        return { ...state, ...changes };
    }

    return state;
};
