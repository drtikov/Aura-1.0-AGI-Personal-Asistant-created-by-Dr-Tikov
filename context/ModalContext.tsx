// context/ModalContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';
// FIX: Added '.ts' extension to satisfy module resolution.
import { ArchitecturalChangeProposal, ModalPayloads } from '../types.ts';

// --- STATIC MODAL COMPONENT IMPORTS ---
// This replaces the dynamic lazy-loading system to prevent module loading errors.
import { CausalChainModal } from '../components/CausalChainModal';
import { ProposalReviewModal } from '../components/ProposalReviewModal';
import { WhatIfModal } from '../components/WhatIfModal';
import { SearchModal } from '../components/SearchModal';
import { StrategicGoalModal } from '../components/StrategicGoalModal';
import { ForecastModal } from '../components/ForecastModal';
import { CognitiveGainDetailModal } from '../components/CognitiveGainDetailModal';
import { MultiverseBranchingModal } from '../components/MultiverseBranchingModal';
import { BrainstormModal } from '../components/BrainstormModal';
// FIX: Changed import for `ImageGenerationModal` to use `VideoGenerationModal` as a placeholder to resolve a broken/missing file and circular dependencies.
import { VideoGenerationModal as ImageGenerationModal } from '../components/VideoGenerationModal';
import { ImageEditingModal } from '../components/ImageEditingModal';
import { VideoGenerationModal } from '../components/VideoGenerationModal';
import { MusicGenerationModal } from '../components/MusicGenerationModal';
import { CoCreatedWorkflowModal } from '../components/CoCreatedWorkflowModal';
import { SkillGenesisModal } from '../components/SkillGenesisModal';
import { AbstractConceptModal } from '../components/AbstractConceptModal';
import { TelosModal } from '../components/TelosModal';
import { PsychePrimitivesModal } from '../components/PsychePrimitivesModal';
import { DocumentForgeContainerModal } from '../components/DocumentForgeContainerModal';
import { PluginManagerModal } from '../components/PluginManagerModal';
import { PoseQuestionModal } from '../components/PoseQuestionModal';
import { PersonaJournalModal } from '../components/PersonaJournalModal';
import { AutonomousEvolutionModal } from '../components/AutonomousEvolutionModal';
import { AuraOSModal } from '../components/AuraOSModal';
import { GuidedInquiryModal } from '../components/GuidedInquiryModal';
import { CollaborativeSessionModal } from '../components/CollaborativeSessionModal';
import { TelosEngineModal } from '../components/TelosEngineModal';
import { OrchestratorModal } from '../components/OrchestratorModal';
import { ReflectorModal } from '../components/ReflectorModal';


type ModalType = keyof ModalPayloads;

interface ModalContextType {
    open: <T extends ModalType>(modalType: T, payload: ModalPayloads[T]) => void;
    close: () => void;
    modal: { type: ModalType; payload: any } | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// --- MODAL COMPONENT MAPPING (NOW STATIC) ---
const MODAL_MAP: { [key in ModalType]?: React.FC<any> } = {
  causalChain: CausalChainModal,
  proposalReview: ProposalReviewModal,
  whatIf: WhatIfModal,
  search: SearchModal,
  strategicGoal: StrategicGoalModal,
  forecast: ForecastModal,
  cognitiveGainDetail: CognitiveGainDetailModal,
  multiverseBranching: MultiverseBranchingModal,
  brainstorm: BrainstormModal,
  imageGeneration: ImageGenerationModal,
  imageEditing: ImageEditingModal,
  videoGeneration: VideoGenerationModal,
  musicGeneration: MusicGenerationModal,
  coCreatedWorkflow: CoCreatedWorkflowModal,
  skillGenesis: SkillGenesisModal,
  abstractConcept: AbstractConceptModal,
  telos: TelosModal,
  telosEngine: TelosEngineModal,
  psychePrimitives: PsychePrimitivesModal,
  documentForge: DocumentForgeContainerModal,
  pluginManager: PluginManagerModal,
  poseQuestion: PoseQuestionModal,
  personaJournal: PersonaJournalModal,
  autonomousEvolution: AutonomousEvolutionModal,
  auraOS: AuraOSModal,
  guidedInquiry: GuidedInquiryModal,
  collaborativeSession: CollaborativeSessionModal,
  orchestrator: OrchestratorModal,
  reflector: ReflectorModal,
};

const ModalRenderer = () => {
    const { modal, close } = useModal();
    const [LoadedComponent, setLoadedComponent] = useState<{ Component: React.FC<any> } | null>(null);

    useEffect(() => {
        if (modal?.type) {
            const Component = MODAL_MAP[modal.type as keyof typeof MODAL_MAP];
            if (Component) {
                setLoadedComponent({ Component });
            } else {
                console.error(`Modal type "${modal.type}" not found in MODAL_MAP.`);
                setLoadedComponent(null);
            }
        } else {
            setLoadedComponent(null);
        }
    }, [modal]);

    if (!modal || !LoadedComponent) return null;
    
    // The individual modal components are now loaded statically.
    // They still contain their own <Modal> wrapper and are rendered when active.
    return (
      <LoadedComponent.Component {...modal.payload} isOpen={true} onClose={close} />
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

    const contextValue: ModalContextType = { open, close, modal };

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
    return { open: context.open, close: context.close, modal: context.modal };
};