import React, { useState, useCallback, createContext, useContext, useMemo } from 'react';
import { 
    CausalChainModal,
    CognitiveGainDetailModal,
    ForecastModal,
    IngestPanel,
    MultiverseBranchingModal,
    ProposalReviewModal,
    SearchModal,
    StrategicGoalModal,
    WhatIfModal
} from '../components';
import { ModalType, ModalProps } from '../types';

type ModalState = {
    type: ModalType | null;
    props: any;
};

type ModalContextType = {
    open: <T extends ModalType>(type: T, props: ModalProps[T]) => void;
    close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modal, setModal] = useState<ModalState>({ type: null, props: {} });

    const open = useCallback(<T extends ModalType>(type: T, props: ModalProps[T]) => {
        setModal({ type, props });
    }, []);

    const close = useCallback(() => {
        setModal({ type: null, props: {} });
    }, []);

    const contextValue = useMemo(() => ({ open, close }), [open, close]);

    const renderModal = () => {
        switch (modal.type) {
            case 'causalChain':
                return <CausalChainModal {...modal.props} onClose={close} />;
            case 'forecast':
                return <ForecastModal isOpen={true} {...modal.props} onClose={close} />;
            case 'whatIf':
                return <WhatIfModal isOpen={true} {...modal.props} onClose={close} />;
            case 'multiverseBranching':
                return <MultiverseBranchingModal isOpen={true} {...modal.props} onClose={close} />;
            case 'search':
                return <SearchModal isOpen={true} {...modal.props} onClose={close} />;
            case 'proposalReview':
                return <ProposalReviewModal {...modal.props} onClose={close} />;
            case 'cognitiveGainDetail':
                return <CognitiveGainDetailModal {...modal.props} onClose={close} />;
            case 'ingest':
                return <IngestPanel {...modal.props} onCancel={close} />;
            case 'strategicGoal':
                return <StrategicGoalModal isOpen={true} {...modal.props} onClose={close} />;
            default:
                return null;
        }
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            {renderModal()}
        </ModalContext.Provider>
    );
};