// state/reducers/system.ts
import { AuraState, Action, CGLPlan, POLCommand, AGISDecision, MetacognitiveLink, CognitiveTask } from '../../types';

export const systemReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'METACGNITIVE_NEXUS/ADD_DIAGNOSTIC_FINDING': {
            const newFinding = {
                ...args,
                id: `finding_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                status: 'unprocessed',
            };
            return {
                metacognitiveNexus: {
                    ...state.metacognitiveNexus,
                    diagnosticLog: [newFinding, ...state.metacognitiveNexus.diagnosticLog],
                }
            };
        }

        case 'METACGNITIVE_NEXUS/UPDATE_DIAGNOSTIC_FINDING': {
            return {
                metacognitiveNexus: {
                    ...state.metacognitiveNexus,
                    diagnosticLog: state.metacognitiveNexus.diagnosticLog.map(f =>
                        f.id === args.id ? { ...f, ...args.updates } : f
                    ),
                }
            };
        }

        case 'METACGNITIVE_NEXUS/ADD_META_LINK': {
            const newLink: MetacognitiveLink = {
                ...args,
                id: `meta_${self.crypto.randomUUID()}`,
                observationCount: 1,
                lastUpdated: Date.now(),
            };
            const linkKey = `${newLink.source.key}(${newLink.source.condition})->${newLink.target.key}(${newLink.target.metric})`;
            const existingLink = state.metacognitiveCausalModel[linkKey];

            if (existingLink) {
                const updatedLink = {
                    ...existingLink,
                    correlation: (existingLink.correlation * existingLink.observationCount + newLink.correlation) / (existingLink.observationCount + 1),
                    observationCount: existingLink.observationCount + 1,
                    lastUpdated: Date.now(),
                };
                return {
                    metacognitiveCausalModel: {
                        ...state.metacognitiveCausalModel,
                        [linkKey]: updatedLink,
                    }
                };
            }

            return {
                metacognitiveCausalModel: {
                    ...state.metacognitiveCausalModel,
                    [linkKey]: newLink,
                }
            };
        }

        case 'UPDATE_RESOURCE_MONITOR':
            return {
                resourceMonitor: {
                    ...state.resourceMonitor,
                    ...args
                }
            };
        
        case 'ADD_SELF_TUNING_DIRECTIVE':
            return {
                metacognitiveNexus: {
                    ...state.metacognitiveNexus,
                    selfTuningDirectives: [args, ...state.metacognitiveNexus.selfTuningDirectives]
                }
            };
            
        case 'UPDATE_SELF_TUNING_DIRECTIVE':
             return {
                metacognitiveNexus: {
                    ...state.metacognitiveNexus,
                    selfTuningDirectives: state.metacognitiveNexus.selfTuningDirectives.map(d =>
                        d.id === args.id ? { ...d, ...args.updates } : d
                    )
                }
            };

        // --- KERNEL SYSCALLS ---
        case 'KERNEL/TICK':
            return {
                kernelState: {
                    ...state.kernelState,
                    tick: state.kernelState.tick + 1,
                }
            };

        case 'KERNEL/ADD_TASK': {
            // FIX: Correctly cast `args` to `CognitiveTask` to match the expected type, which uses the `CognitiveTaskType` enum.
            const newTask = args as CognitiveTask;
            // Prevent adding duplicate tasks if one is already queued or running
            if (state.kernelState.runningTask?.type === newTask.type || state.kernelState.taskQueue.some(t => t.type === newTask.type)) {
                return {};
            }
            return {
                kernelState: {
                    ...state.kernelState,
                    taskQueue: [...state.kernelState.taskQueue, newTask],
                }
            };
        }

        case 'KERNEL/SET_RUNNING_TASK': {
            // FIX: Correctly cast `args` to `CognitiveTask` to match the type of `runningTask`.
            const task = args as CognitiveTask | null;
            let queue = state.kernelState.taskQueue;
            if (task) {
                // Remove the task from the queue when it starts running
                queue = state.kernelState.taskQueue.filter(t => t.id !== task.id);
            }
            return {
                kernelState: {
                    ...state.kernelState,
                    runningTask: task,
                    taskQueue: queue,
                }
            };
        }
        
        case 'KERNEL/LOG_SYSCALL':
            return {
                kernelState: {
                    ...state.kernelState,
                    syscallLog: [args, ...state.kernelState.syscallLog].slice(0, 100),
                }
            };
            
        // --- AGIS SYSCALLS ---
        case 'AGIS/TOGGLE_PAUSE': {
            return {
                autonomousReviewBoardState: {
                    ...state.autonomousReviewBoardState,
                    isPaused: !state.autonomousReviewBoardState.isPaused,
                }
            };
        }

        case 'AGIS/ADD_DECISION_LOG': {
            const newDecision: AGISDecision = {
                ...args,
                id: `agis_decision_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
            };
            
            let recentSuccesses = state.autonomousReviewBoardState.recentSuccesses;
            let recentFailures = state.autonomousReviewBoardState.recentFailures;

            if (newDecision.decision === 'auto-approved') {
                recentSuccesses++;
            } else if (newDecision.decision === 'rejected') {
                recentFailures++;
            }

            return {
                autonomousReviewBoardState: {
                    ...state.autonomousReviewBoardState,
                    decisionLog: [newDecision, ...state.autonomousReviewBoardState.decisionLog].slice(0, 50),
                    recentSuccesses,
                    recentFailures,
                }
            };
        }
        
        case 'AGIS/CALIBRATE_CONFIDENCE': {
            return {
                autonomousReviewBoardState: {
                    ...state.autonomousReviewBoardState,
                    agisConfidenceThreshold: args.newThreshold,
                    lastCalibrationReason: args.reason,
                    // Reset counters after calibration
                    recentSuccesses: 0,
                    recentFailures: 0,
                }
            };
        }

        default:
            return {};
    }
};