// state/reducers/system.ts
// FIX: Replaced the incorrect 'CognitiveTask' with the correct 'KernelTask' type.
import { AuraState, Action, AGISDecision, MetacognitiveLink, KernelTask, ModificationLogEntry, KernelPatchProposal } from '../../types';

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
            // FIX: Correctly cast `args` to `KernelTask` to match the expected type.
            const newTask = args as KernelTask;
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
            // FIX: Correctly cast `args` to `KernelTask` to match the type of `runningTask`.
            const task = args as KernelTask | null;
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
            
        case 'KERNEL/BEGIN_SANDBOX_TEST': {
            const patchId = args.patchId as string;
            const proposal = state.ontogeneticArchitectState.proposalQueue.find(p => p.id === patchId) as KernelPatchProposal | undefined;
            if (!proposal) return {};

            return {
                kernelState: {
                    ...state.kernelState,
                    sandbox: {
                        active: true,
                        status: 'testing',
                        currentPatchId: patchId,
                        log: [{ timestamp: Date.now(), message: `Starting sandbox test for patch: ${proposal.changeDescription}` }],
                    }
                }
            };
        }

        case 'KERNEL/CONCLUDE_SANDBOX_TEST': {
            const { passed, reason } = args;
            return {
                kernelState: {
                    ...state.kernelState,
                    sandbox: {
                        ...state.kernelState.sandbox,
                        status: passed ? 'passed' : 'failed',
                        log: [...state.kernelState.sandbox.log, { timestamp: Date.now(), message: `Test ${passed ? 'passed' : 'failed'}. Reason: ${reason}` }],
                    }
                }
            };
        }

        case 'KERNEL/APPLY_PATCH': {
            const patchId = state.kernelState.sandbox.currentPatchId;
            const proposal = state.ontogeneticArchitectState.proposalQueue.find(p => p.id === patchId) as KernelPatchProposal | undefined;
            if (!proposal || state.kernelState.sandbox.status !== 'passed') return {};

            const { task, newFrequency } = proposal.patch.payload;
            
            const newLog: ModificationLogEntry = {
                id: `mod_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                description: `Autonomous kernel patch applied: ${proposal.changeDescription}`,
                gainType: 'OPTIMIZATION',
                validationStatus: 'validated',
                isAutonomous: true,
            };

            const versionParts = state.kernelState.kernelVersion.split('.');
            const newPatchVersion = parseInt(versionParts[2] || '0') + 1;
            const newVersion = `${versionParts[0]}.${versionParts[1]}.${newPatchVersion}`;

            return {
                kernelState: {
                    ...state.kernelState,
                    kernelVersion: newVersion,
                    taskFrequencies: {
                        ...state.kernelState.taskFrequencies,
                        [task]: newFrequency,
                    },
                    sandbox: {
                        active: false,
                        status: 'idle',
                        currentPatchId: null,
                        log: [],
                    }
                },
                modificationLog: [newLog, ...state.modificationLog].slice(0, 50),
            };
        }
        
        case 'SYSTEM/REBOOT': {
            return {
                kernelState: {
                    ...state.kernelState,
                    rebootRequired: true,
                }
            };
        }

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
        
        case 'AGIS/SET_THRESHOLD':
            return {
                autonomousReviewBoardState: {
                    ...state.autonomousReviewBoardState,
                    agisConfidenceThreshold: args.threshold,
                }
            };

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