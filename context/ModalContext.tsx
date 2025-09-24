

import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { CausalChainModal } from '../components/CausalChainModal';
import { ProposalReviewModal } from '../components/ProposalReviewModal';
import { WhatIfModal } from '../components/WhatIfModal';
import { SearchModal } from '../components/SearchModal';
import { StrategicGoalModal } from '../components/StrategicGoalModal';
import { ForecastModal } from '../components/ForecastModal';
import { CognitiveGainDetailModal } from '../components/CognitiveGainDetailModal';
import { MultiverseBranchingModal } from '../components/MultiverseBranchingModal';
import { BrainstormModal } from '../components/BrainstormModal';
import { ImageGenerationModal } from '../components/ImageGenerationModal';
import { ImageEditingModal } from '../components/ImageEditingModal';
import { VideoGenerationModal } from '../components/VideoGenerationModal';
import { AdvancedControlsModal } from '../components/AdvancedControlsModal';
import { MusicGenerationModal } from '../components/MusicGenerationModal';
import { useAuraDispatch } from './AuraContext';
import { PerformanceLogEntry, ArchitecturalChangeProposal, CognitiveGainLogEntry, ModalPayloads } from '../types';

type ModalType = 
    | 'causalChain' 
    | 'proposalReview' 
    | 'whatIf' 
    | 'search' 
    | 'strategicGoal'
    | 'forecast'
    | 'cognitiveGainDetail'
    | 'multiverseBranching'
    | 'brainstorm'
    | 'imageGeneration'
    | 'imageEditing'
    | 'videoGeneration'
    | 'advancedControls'
    | 'musicGeneration';

interface ModalContextType {
    open: <T extends ModalType>(modalType: T, payload: ModalPayloads[T]) => void;
    close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// FIX: Made children prop optional to resolve "Property 'children' is missing" error.
export const ModalProvider = ({ children }: { children?: ReactNode }) => {
    const [modal, setModal] = useState<{ type: ModalType; payload: any } | null>(null);
    const { 
        approveProposal, rejectProposal, handleWhatIf, 
        handleSearch, handleSetStrategicGoal, state, 
        processingState, handleMultiverseBranch, handleBrainstorm
    } = useAuraDispatch();

    const open = useCallback(<T extends ModalType>(modalType: T, payload: ModalPayloads[T]) => {
        setModal({ type: modalType, payload });
    }, []);

    const close = useCallback(() => {
        setModal(null);
    }, []);

    const onApproveProposal = (proposal: ArchitecturalChangeProposal) => {
        approveProposal(proposal);
        close();
    };

    const onRejectProposal = (id: string) => {
        rejectProposal(id);
        close();
    };

    const contextValue = { open, close };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}

            <CausalChainModal 
                log={modal?.type === 'causalChain' ? modal.payload.log : null}
                onClose={close}
            />
            <ProposalReviewModal
                proposal={modal?.type === 'proposalReview' ? modal.payload.proposal : null}
                onClose={close}
                onApprove={onApproveProposal}
                onReject={onRejectProposal}
            />
            <WhatIfModal 
                isOpen={modal?.type === 'whatIf'}
                onClose={close}
                onAnalyze={handleWhatIf}
                isProcessing={processingState.active && processingState.stage === 'whatIf'}
            />
            <SearchModal
                isOpen={modal?.type === 'search'}
                onClose={close}
                onSearch={handleSearch}
                isProcessing={processingState.active && processingState.stage === 'search'}
            />
            <StrategicGoalModal
                isOpen={modal?.type === 'strategicGoal'}
                onClose={close}
                onSetGoal={handleSetStrategicGoal}
                isProcessing={processingState.active && processingState.stage === 'strategicGoal'}
            />
            <ForecastModal
                isOpen={modal?.type === 'forecast'}
                onClose={close}
                state={state.internalState}
            />
            <CognitiveGainDetailModal
                log={modal?.type === 'cognitiveGainDetail' ? modal.payload.log : null}
                onClose={close}
            />
             <MultiverseBranchingModal
                isOpen={modal?.type === 'multiverseBranching'}
                onClose={close}
                onBranch={handleMultiverseBranch}
                isProcessing={processingState.active && processingState.stage === 'multiverseBranching'}
            />
             <BrainstormModal
                isOpen={modal?.type === 'brainstorm'}
                onClose={close}
                onGenerate={handleBrainstorm}
                isProcessing={processingState.active && processingState.stage === 'brainstorm'}
            />
            <ImageGenerationModal
                isOpen={modal?.type === 'imageGeneration'}
                onClose={close}
                initialPrompt={modal?.type === 'imageGeneration' ? modal.payload.initialPrompt : undefined}
            />
            <ImageEditingModal
                isOpen={modal?.type === 'imageEditing'}
                onClose={close}
                initialImage={modal?.type === 'imageEditing' ? modal.payload.initialImage : undefined}
            />
            <VideoGenerationModal
                isOpen={modal?.type === 'videoGeneration'}
                onClose={close}
            />
            <AdvancedControlsModal
                isOpen={modal?.type === 'advancedControls'}
                onClose={close}
            />
            <MusicGenerationModal
                isOpen={modal?.type === 'musicGeneration'}
                onClose={close}
            />
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};