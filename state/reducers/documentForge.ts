// state/reducers/documentForge.ts
import { AuraState, Action } from '../../types';

export const documentForgeReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'DOCUMENT_FORGE/START_PROJECT': {
            return {
                documentForgeState: {
                    isActive: true,
                    goal: args.goal,
                    status: 'outlining',
                    statusMessage: 'Generating document outline...',
                    document: null,
                    error: null,
                }
            };
        }

        case 'DOCUMENT_FORGE/SET_STATUS': {
            return {
                documentForgeState: {
                    ...state.documentForgeState,
                    status: args.status,
                    statusMessage: args.message || '',
                }
            };
        }

        case 'DOCUMENT_FORGE/SET_OUTLINE': {
            return {
                documentForgeState: {
                    ...state.documentForgeState,
                    status: 'generating_content',
                    statusMessage: 'Generating chapter content...',
                    document: args.outline,
                }
            };
        }
        
        case 'DOCUMENT_FORGE/UPDATE_CHAPTER': {
            if (!state.documentForgeState.document) return {};
            return {
                documentForgeState: {
                    ...state.documentForgeState,
                    document: {
                        ...state.documentForgeState.document,
                        chapters: state.documentForgeState.document.chapters.map(ch => 
                            ch.id === args.id ? { ...ch, ...args.updates } : ch
                        )
                    }
                }
            };
        }

        case 'DOCUMENT_FORGE/UPDATE_DIAGRAM': {
             if (!state.documentForgeState.document) return {};
             return {
                documentForgeState: {
                    ...state.documentForgeState,
                    document: {
                        ...state.documentForgeState.document,
                        chapters: state.documentForgeState.document.chapters.map(ch => {
                            if (ch.id === args.chapterId && ch.diagram) {
                                return { ...ch, diagram: { ...ch.diagram, ...args.updates } };
                            }
                            return ch;
                        })
                    }
                }
            };
        }

        case 'DOCUMENT_FORGE/FINALIZE_PROJECT': {
            return {
                documentForgeState: {
                    ...state.documentForgeState,
                    status: 'complete',
                    statusMessage: 'Document generation complete.',
                }
            };
        }

        case 'DOCUMENT_FORGE/RESET': {
            return {
                documentForgeState: {
                    isActive: false,
                    goal: '',
                    status: 'idle',
                    statusMessage: '',
                    document: null,
                    error: null,
                }
            };
        }

        default:
            return {};
    }
};