// context/ModalContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { CausalChainModal } from '../components/CausalChainModal.tsx';
import { ProposalReviewModal } from '../components/ProposalReviewModal.tsx';
import { WhatIfModal } from '../components/WhatIfModal.tsx';
import { SearchModal } from '../components/SearchModal.tsx';
import { StrategicGoalModal } from '../components/StrategicGoalModal.tsx';
import { ForecastModal } from '../components/ForecastModal.tsx';
import { CognitiveGainDetailModal } from '../components/CognitiveGainDetailModal.tsx';
import { MultiverseBranchingModal } from '../components/MultiverseBranchingModal.tsx';
import { BrainstormModal } from '../components/BrainstormModal.tsx';
import { ImageGenerationModal } from '../components/ImageGenerationModal.tsx';
import { ImageEditingModal } from '../components/ImageEditingModal.tsx';
import { VideoGenerationModal } from '../components/VideoGenerationModal.tsx';
// FIX: To resolve module resolution errors, this now points to the PascalCase file to ensure consistent casing.
import { AdvancedControlsModal } from '../components/AdvancedControlsModal.tsx';
import { MusicGenerationModal } from '../components/MusicGenerationModal.tsx';
import { CoCreatedWorkflowModal } from '../components/CoCreatedWorkflowModal.tsx';
import { SkillGenesisModal } from '../components/SkillGenesisModal.tsx';
import { AbstractConceptModal } from '../components/AbstractConceptModal.tsx';
import { TelosModal } from '../components/TelosModal.tsx';
import { PsychePrimitivesModal } from '../components/PsychePrimitivesModal.tsx';
import { DocumentForgeContainerModal } from '../components/DocumentForgeContainerModal.tsx';
import { useAuraDispatch, useCoreState } from './AuraContext.tsx';
import { PerformanceLogEntry, ArchitecturalChangeProposal, CognitiveGainLogEntry, ModalPayloads } from '../types.ts';
import { PluginManagerModal } from '../components/PluginManagerModal.tsx';
import { PoseQuestionModal } from '../components/PoseQuestionModal.tsx';
import { PersonaJournalModal } from '../components/PersonaJournalModal.tsx';
import { AutonomousEvolutionModal } from '../components/AutonomousEvolutionModal.tsx';
import { SystemPanelsModal } from '../components/SystemPanelsModal.tsx';

// FIX: Changed ModalType to be derived from ModalPayloads keys to ensure type safety and resolve indexing errors.
type ModalType = keyof ModalPayloads;

interface ModalContextType {
    open: <T extends ModalType>(modalType: T, payload: ModalPayloads[T]) => void;
    close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children?: ReactNode }) => {
    const [modal, setModal] = useState<{ type: ModalType; payload: any } | null>(null);
    const { 
        approveProposal, rejectProposal, handleWhatIf, 
        handleSearch, handleSetStrategicGoal, 
        processingState, handleMultiverseBranch,
        handleSetTelos, handlePoseQuestion
    } = useAuraDispatch();
    
    const { internalState, telosEngine } = useCoreState();

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
                state={internalState}
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
            <CoCreatedWorkflowModal
                isOpen={modal?.type === 'coCreatedWorkflow'}
                onClose={close}
            />
            <SkillGenesisModal
                isOpen={modal?.type === 'skillGenesis'}
                onClose={close}
            />
            <AbstractConceptModal
                isOpen={modal?.type === 'abstractConcept'}
                onClose={close}
            />
            <TelosModal
                isOpen={modal?.type === 'telos'}
                onClose={close}
                onSetTelos={handleSetTelos}
                currentTelos={telosEngine.telos}
            />
            <PsychePrimitivesModal
                isOpen={modal?.type === 'psychePrimitives'}
                onClose={close}
            />
            <PluginManagerModal
                isOpen={modal?.type === 'pluginManager'}
                onClose={close}
            />
            <PoseQuestionModal
                isOpen={modal?.type === 'poseQuestion'}
                onClose={close}
                onPose={handlePoseQuestion}
            />
            <DocumentForgeContainerModal
                isOpen={modal?.type === 'documentForge'}
                onClose={close}
            />
            <AutonomousEvolutionModal
                isOpen={modal?.type === 'autonomousEvolution'}
                onClose={close}
            />
            <SystemPanelsModal
                isOpen={modal?.type === 'systemPanels'}
                onClose={close}
            />
            <PersonaJournalModal
                isOpen={modal?.type === 'personaJournal'}
                onClose={close}
                payload={modal?.type === 'personaJournal' ? modal.payload : { persona: null, entries: [] }}
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