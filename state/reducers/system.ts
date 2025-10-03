// state/reducers/system.ts
import { AuraState, Action, CGLPlan, POLCommand } from '../../types';

/**
 * Converts a single CGL step into a POL command.
 */
const convertStepToCommand = (step: any): POLCommand => {
    // FIX: Added the required 'status' property to the POLCommand object.
    const command: POLCommand = {
        id: `pol-${self.crypto.randomUUID().slice(0, 8)}`,
        sourceStepId: step.id,
        type: 'NOOP',
        payload: {},
        status: 'pending',
    };

    switch (step.operation) {
        case 'GENERATE_RESPONSE':
        case 'TEXT_SYNTHESIS':
            command.type = 'CHAT_MESSAGE';
            command.payload = { message: step.parameters.prompt };
            break;
        case 'EXECUTE_TOOL':
            command.type = 'TOOL_EXECUTE';
            command.payload = { name: step.parameters.name, args: step.parameters.args };
            break;
        case 'KNOWLEDGE_QUERY':
            command.type = 'SYSCALL';
            command.payload = { call: 'ADD_TO_WORKING_MEMORY', args: `Query Result for: ${step.parameters.query}` };
            break;
        default:
            command.type = 'SYSCALL';
            command.payload = { call: 'ADD_COMMAND_LOG', args: { text: `Unknown CGL operation: ${step.operation}`, type: 'warning' } };
            break;
    }
    return command;
};

/**
 * Compiles a CGL plan into a staged, parallelizable POL command queue.
 * This version groups consecutive tool calls into a single parallel stage.
 */
const compileCGLToStagedPOL = (plan: CGLPlan): POLCommand[][] => {
    const stages: POLCommand[][] = [];
    if (!plan || !plan.steps) return stages;

    let currentParallelStage: POLCommand[] = [];

    for (const step of plan.steps) {
        const command = convertStepToCommand(step);
        
        // Group consecutive tool calls for parallel execution
        if (command.type === 'TOOL_EXECUTE') {
            currentParallelStage.push(command);
        } else {
            // If we encounter a non-tool command, push the current parallel stage (if any)
            if (currentParallelStage.length > 0) {
                stages.push(currentParallelStage);
                currentParallelStage = [];
            }
            // Push the current command as its own sequential stage
            stages.push([command]);
        }
    }

    // Add any remaining commands in the last parallel stage
    if (currentParallelStage.length > 0) {
        stages.push(currentParallelStage);
    }

    return stages;
};


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

        case 'KERNEL/SET_TASK_QUEUE':
            return {
                kernelState: {
                    ...state.kernelState,
                    taskQueue: args,
                }
            };

        case 'KERNEL/SET_RUNNING_TASK':
            return {
                kernelState: {
                    ...state.kernelState,
                    runningTask: args,
                }
            };
        
        case 'KERNEL/LOG_SYSCALL':
            return {
                kernelState: {
                    ...state.kernelState,
                    syscallLog: [args, ...state.kernelState.syscallLog].slice(0, 100),
                }
            };
            
        // --- COGNITIVE OS SYSCALLS ---
        case 'COGNITIVE_OS/EXECUTE_DIRECTIVE':
            return {
                cognitiveOSState: {
                    ...state.cognitiveOSState,
                    status: 'directive_received',
                    activeDirective: args,
                    activePlan: null,
                    commandQueue: [],
                    currentStageIndex: 0,
                    currentStageCommands: null,
                    completedCommands: [],
                    lastError: null,
                    isDynamicClusterActive: false,
                }
            };
        
        case 'COGNITIVE_OS/SET_PLAN': {
            const stagedQueue = compileCGLToStagedPOL(args);
            return {
                 cognitiveOSState: {
                    ...state.cognitiveOSState,
                    status: 'ready_to_execute',
                    activePlan: args,
                    commandQueue: stagedQueue,
                    currentStageIndex: 0,
                }
            };
        }
        
        case 'COGNITIVE_OS/ADVANCE_STAGE': {
            const { stage, stageIndex } = args;
            return {
                 cognitiveOSState: {
                    ...state.cognitiveOSState,
                    status: 'executing_pol',
                    currentStageIndex: stageIndex + 1,
                    currentStageCommands: stage,
                }
            }
        }

        case 'COGNITIVE_OS/STAGE_COMPLETE': {
            return {
                cognitiveOSState: {
                    ...state.cognitiveOSState,
                    status: 'ready_to_execute', // Ready for the next stage
                    completedCommands: [...state.cognitiveOSState.completedCommands, ...args.completedCommands],
                    currentStageCommands: null,
                }
            }
        }
        
        case 'COGNITIVE_OS/PIPELINE_COMPLETE': {
             return {
                cognitiveOSState: {
                    ...state.cognitiveOSState,
                    status: 'complete',
                    currentStageCommands: null,
                }
            };
        }

        case 'COGNITIVE_OS/EXECUTION_FAILED':
            return {
                cognitiveOSState: {
                    ...state.cognitiveOSState,
                    status: 'execution_failed',
                    lastError: args.error,
                    currentStageCommands: null,
                }
            };
        
        case 'COGNITIVE_OS/CLEANUP':
            return {
                cognitiveOSState: {
                    ...state.cognitiveOSState,
                    status: 'idle',
                    activeDirective: null,
                    activePlan: null,
                    commandQueue: [],
                    currentStageIndex: 0,
                    currentStageCommands: null,
                    completedCommands: [],
                    lastError: null,
                    isDynamicClusterActive: false,
                }
            };

        default:
            return {};
    }
};