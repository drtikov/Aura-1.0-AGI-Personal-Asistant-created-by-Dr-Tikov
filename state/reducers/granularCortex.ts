// state/reducers/granularCortex.ts
import { AuraState, Action, SensoryEngram, SensoryPrimitive } from '../../types';

// A simple function to compare two engrams and calculate an error score.
// This is a placeholder for a much more complex algorithm.
const calculatePredictionError = (actual: SensoryEngram, predicted: SensoryEngram | null) => {
    if (!predicted || predicted.modality !== actual.modality) {
        return {
            magnitude: 1.0, // Maximum error if no prediction or wrong modality
            // FIX: Corrected property from `primitives` to `rawPrimitives`.
            mismatchedPrimitives: actual.rawPrimitives.map((p: SensoryPrimitive) => ({ predicted: null, actual: p })),
        };
    }

    let totalError = 0;
    const mismatchedPrimitives: { predicted: SensoryPrimitive | null, actual: SensoryPrimitive | null }[] = [];
    // FIX: Added explicit type to Map constructor to resolve type inference issues.
    const predictedPrimitives: Map<string, SensoryPrimitive> = new Map(predicted.rawPrimitives.map((p: SensoryPrimitive) => [p.type, p]));

    // FIX: Corrected property from `primitives` to `rawPrimitives`.
    for (const actualPrimitive of actual.rawPrimitives) {
        const predictedPrimitive = predictedPrimitives.get(actualPrimitive.type);
        if (!predictedPrimitive) {
            totalError += 1; // Primitive was present but not predicted
            mismatchedPrimitives.push({ predicted: null, actual: actualPrimitive });
        } else {
            let difference = 0;
            if (typeof actualPrimitive.value === 'number' && typeof predictedPrimitive.value === 'number') {
                difference = Math.abs(actualPrimitive.value - predictedPrimitive.value);
            } else if (actualPrimitive.value !== predictedPrimitive.value) {
                difference = 1;
            }
            totalError += difference;
            if (difference > 0.1) {
                mismatchedPrimitives.push({ predicted: predictedPrimitive, actual: actualPrimitive });
            }
            predictedPrimitives.delete(actualPrimitive.type);
        }
    }

    // Add error for primitives that were predicted but not present
    totalError += predictedPrimitives.size;
    // FIX: Added explicit type to `p` in forEach to resolve `unknown` type error.
    predictedPrimitives.forEach((p: SensoryPrimitive) => mismatchedPrimitives.push({ predicted: p, actual: null }));


    // FIX: Corrected property from `primitives` to `rawPrimitives`.
    const maxPossibleError = actual.rawPrimitives.length + predicted.rawPrimitives.length;
    const magnitude = maxPossibleError > 0 ? Math.min(1, totalError / maxPossibleError) : 0;

    return { magnitude, mismatchedPrimitives };
};

export const granularCortexReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SET_SENSORY_PREDICTION':
            return {
                granularCortexState: {
                    ...state.granularCortexState,
                    lastPredictedEngram: args,
                    log: [{ timestamp: Date.now(), message: `Received sensory prediction for ${args.modality}.` }, ...state.granularCortexState.log].slice(0, 20)
                }
            };
        
        case 'PROCESS_SENSORY_INPUT': {
            const { actualEngram, predictedEngram } = args;
            const error = calculatePredictionError(actualEngram, predictedEngram);

            const newError = {
                timestamp: Date.now(),
                magnitude: error.magnitude,
                mismatchedPrimitives: error.mismatchedPrimitives,
            };

            const logMessage = `Processed ${actualEngram.modality} input. Prediction error: ${(error.magnitude * 100).toFixed(1)}%.`;

            return {
                granularCortexState: {
                    ...state.granularCortexState,
                    lastActualEngram: actualEngram,
                    lastPredictionError: newError,
                    log: [{ timestamp: Date.now(), message: logMessage }, ...state.granularCortexState.log].slice(0, 20)
                },
                // Also update the world model if the error is significant
                worldModelState: error.magnitude > 0.5 ? {
                    ...state.worldModelState,
                    predictionError: {
                        ...state.worldModelState.predictionError,
                        magnitude: error.magnitude,
                        source: 'sensory_input',
                        failedPrediction: `Predicted ${predictedEngram?.modality || 'nothing'}, got ${actualEngram.modality}.`,
                        actualOutcome: `High sensory prediction error.`,
                    }
                } : state.worldModelState,
            };
        }

        default:
            return {};
    }
};