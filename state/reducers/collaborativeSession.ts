// state/reducers/collaborativeSession.ts
import { AuraState, Action, CollaborativeSession } from '../../types.ts';

export const collaborativeSessionReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SESSION/START': {
            const newSession: CollaborativeSession = {
                id: `session_${self.crypto.randomUUID()}`,
                taskId: args.taskId,
                status: 'active',
                participants: args.participants,
                transcript: [],
                artifacts: [],
                subTasks: [],
            };
            return {
                collaborativeSessionState: { activeSession: newSession }
            };
        }
        case 'SESSION/UPDATE': {
            if (!state.collaborativeSessionState.activeSession) return {};
            return {
                collaborativeSessionState: {
                    activeSession: {
                        ...state.collaborativeSessionState.activeSession,
                        ...args,
                    }
                }
            };
        }
         case 'SESSION/UPDATE_SUBTASK_STATUS': {
            if (!state.collaborativeSessionState.activeSession || !state.collaborativeSessionState.activeSession.subTasks) return {};
            const { taskId, status } = args;
            return {
                collaborativeSessionState: {
                    activeSession: {
                        ...state.collaborativeSessionState.activeSession,
                        subTasks: state.collaborativeSessionState.activeSession.subTasks.map(task => 
                            task.id === taskId ? { ...task, status } : task
                        ),
                    }
                }
            };
        }
        case 'SESSION/POST_MESSAGE': {
            if (!state.collaborativeSessionState.activeSession) return {};
            const { personaId, content } = args;
            const newMessage = { personaId, content, timestamp: Date.now() };
            return {
                collaborativeSessionState: {
                    activeSession: {
                        ...state.collaborativeSessionState.activeSession,
                        transcript: [...state.collaborativeSessionState.activeSession.transcript, newMessage],
                    }
                }
            };
        }
        case 'SESSION/ADD_ARTIFACT': {
            if (!state.collaborativeSessionState.activeSession) return {};
            const { name, type, content } = args;
            const newArtifact = { name, type, content };
             return {
                collaborativeSessionState: {
                    activeSession: {
                        ...state.collaborativeSessionState.activeSession,
                        artifacts: [...state.collaborativeSessionState.activeSession.artifacts, newArtifact],
                    }
                }
            };
        }
        case 'SESSION/END': {
            if (!state.collaborativeSessionState.activeSession) return {};
            return {
                collaborativeSessionState: {
                    activeSession: {
                        ...state.collaborativeSessionState.activeSession,
                        status: args.status, // 'completed' or 'failed'
                    }
                }
            };
        }
        case 'SESSION/CLOSE': {
            // This is for the UI to close the session view. We can just nullify it.
            return {
                collaborativeSessionState: { activeSession: null }
            };
        }
        default:
            return {};
    }
};