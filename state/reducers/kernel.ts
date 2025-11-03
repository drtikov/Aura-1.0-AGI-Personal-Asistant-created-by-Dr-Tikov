// state/reducers/kernel.ts
import React from 'react';
// FIX: Added 'AuraState' to import to resolve 'Cannot find name' error.
import { AuraState, Action, SyscallCall, SyscallPayload, KernelTask, ModificationLogEntry, KernelPatchProposal } from '../../types.ts';

export const kernelReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'KERNEL/TICK': {
            return {
                kernelState: {
                    ...state.kernelState,
                    tick: state.kernelState.tick + 1,
                }
            };
        }

        // FIX: Renamed from KERNEL/ADD_TASK to KERNEL/QUEUE_TASK
        case 'KERNEL/QUEUE_TASK': {
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
            // FIX: Added type guard to ensure `id` property exists for comparison.
            const proposal = state.ontogeneticArchitectState.proposalQueue.find(p => 'id' in p && p.id === patchId) as KernelPatchProposal | undefined;
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
            // FIX: Added type guard to ensure `id` property exists for comparison.
            const proposal = state.ontogeneticArchitectState.proposalQueue.find(p => 'id' in p && p.id === patchId) as KernelPatchProposal | undefined;
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

        default:
            return {};
    }
};