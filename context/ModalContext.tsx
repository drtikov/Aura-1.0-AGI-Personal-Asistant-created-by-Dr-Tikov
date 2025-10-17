// context/ModalContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect, Suspense, lazy } from 'react';
import { useAuraDispatch, useCoreState } from './AuraContext.tsx';
import { ArchitecturalChangeProposal, ModalPayloads } from '../types.ts';

type ModalType = keyof ModalPayloads;

interface ModalContextType {
    open: <T extends ModalType>(modalType: T, payload: ModalPayloads[T]) => void;
    close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// --- MODAL COMPONENT MAPPING FOR DYNAMIC IMPORTS ---
// This prevents all modals from being bundled and loaded at once.
const MODAL_MAP = {
  causalChain: lazy(() => import('../components/CausalChainModal.tsx').then(module => ({ default: module.CausalChainModal }))),
  proposalReview: lazy(() => import('../components/ProposalReviewModal.tsx').then(module => ({ default: module.ProposalReviewModal }))),
  whatIf: lazy(() => import('../components/WhatIfModal.tsx').then(module => ({ default: module.WhatIfModal }))),
  search: lazy(() => import('../components/SearchModal.tsx').then(module => ({ default: module.SearchModal }))),
  strategicGoal: lazy(() => import('../components/StrategicGoalModal.tsx').then(module => ({ default: module.StrategicGoalModal }))),
  forecast: lazy(() => import('../components/ForecastModal.tsx').then(module => ({ default: module.ForecastModal }))),
  cognitiveGainDetail: lazy(() => import('../components/CognitiveGainDetailModal.tsx').then(module => ({ default: module.CognitiveGainDetailModal }))),
  multiverseBranching: lazy(() => import('../components/MultiverseBranchingModal.tsx').then(module => ({ default: module.MultiverseBranchingModal }))),
  brainstorm: lazy(() => import('../components/BrainstormModal.tsx').then(module => ({ default: module.BrainstormModal }))),
  imageGeneration: lazy(() => import('../components/ImageGenerationModal.tsx').then(module => ({ default: module.ImageGenerationModal }))),
  imageEditing: lazy(() => import('../components/ImageEditingModal.tsx').then(module => ({ default: module.ImageEditingModal }))),
  videoGeneration: lazy(() => import('../components/VideoGenerationModal.tsx').then(module => ({ default: module.VideoGenerationModal }))),
  // FIX: Corrected import path casing for AdvancedControlsModal to resolve module resolution errors.
  // FIX: To resolve module resolution errors, this now points to the canonical PascalCase file to avoid casing ambiguity.
  advancedControls: lazy(() => import('../components/AdvancedControlsModal.tsx').then(module => ({ default: module.AdvancedControlsModal }))),
  musicGeneration: lazy(() => import('../components/MusicGenerationModal.tsx').then(module => ({ default: module.MusicGenerationModal }))),
  coCreatedWorkflow: lazy(() => import('../components/CoCreatedWorkflowModal.tsx').then(module => ({ default: module.CoCreatedWorkflowModal }))),
  skillGenesis: lazy(() => import('../components/SkillGenesisModal.tsx').then(module => ({ default: module.SkillGenesisModal }))),
  abstractConcept: lazy(() => import('../components/AbstractConceptModal.tsx').then(module => ({ default: module.AbstractConceptModal }))),
  telos: lazy(() => import('../components/TelosModal.tsx').then(module => ({ default: module.TelosModal }))),
  psychePrimitives: lazy(() => import('../components/PsychePrimitivesModal.tsx').then(module => ({ default: module.PsychePrimitivesModal }))),
  documentForge: lazy(() => import('../components/DocumentForgeContainerModal.tsx').then(module => ({ default: module.DocumentForgeContainerModal }))),
  pluginManager: lazy(() => import('../components/PluginManagerModal.tsx').then(module => ({ default: module.PluginManagerModal }))),
  poseQuestion: lazy(() => import('../components/PoseQuestionModal.tsx').then(module => ({ default: module.PoseQuestionModal }))),
  personaJournal: lazy(() => import('../components/PersonaJournalModal.tsx').then(module => ({ default: module.PersonaJournalModal }))),
  autonomousEvolution: lazy(() => import('../components/AutonomousEvolutionModal.tsx').then(module => ({ default: module.AutonomousEvolutionModal }))),
  systemPanels: lazy(() => import('../components/SystemPanelsModal.tsx').then(module => ({ default: module.SystemPanelsModal }))),
};

const ModalRenderer = () => {
    const { modal, close } = useModal();
    const [LoadedModal, setLoadedModal] = useState<{ Component: React.LazyExoticComponent<React.FC<any>> } | null>(null);

    useEffect(() => {
        if (modal?.type) {
            const Component = MODAL_MAP[modal.type as keyof typeof MODAL_MAP];
            if (Component) {
                setLoadedModal({ Component });
            } else {
                console.error(`Modal type "${modal.type}" not found in MODAL_MAP.`);
                setLoadedModal(null);
            }
        } else {
            setLoadedModal(null);
        }
    }, [modal]);

    if (!modal || !LoadedModal) return null;
    
    // The individual modal components (e.g., CausalChainModal) are now loaded on demand.
    // They still contain their own <Modal> wrapper, but are only rendered when active.
    return (
        <Suspense fallback={<div />}>
            <LoadedModal.Component {...modal.payload} isOpen={true} onClose={close} />
        </Suspense>
    );
};


export const ModalProvider = ({ children }: { children?: ReactNode }) => {
    const [modal, setModal] = useState<{ type: ModalType; payload: any } | null>(null);

    const open = useCallback(<T extends ModalType>(modalType: T, payload: ModalPayloads[T]) => {
        setModal({ type: modalType, payload });
    }, []);

    const close = useCallback(() => {
        setModal(null);
    }, []);

    const contextValue = { open, close, modal };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            <ModalRenderer />
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    // We only expose open and close to consumers, not the internal state.
    return { open: context.open, close: context.close, modal: context.modal };
};