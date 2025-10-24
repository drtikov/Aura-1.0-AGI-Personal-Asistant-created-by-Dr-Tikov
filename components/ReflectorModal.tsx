// components/ReflectorModal.tsx
import React, { useState } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useArchitectureState } from '../context/AuraContext.tsx';
import { SafeMarkdown } from './SafeMarkdown.tsx';

const CORE_COMPONENTS = [
    'hooks/useAura.ts',
    'hooks/useAutonomousSystem.ts',
    'hooks/useGeminiAPI.ts',
    'state/reducer.ts',
    'components/CoreMonitor.tsx',
    'core/hal.ts',
    'core/kernel.ts',
];

export const ReflectorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    const { selfProgrammingState } = useArchitectureState();
    
    const [component, setComponent] = useState(CORE_COMPONENTS[0]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);

    const handleExplain = async () => {
        if (!component) {
            addToast('Please select a component to explain.', 'warning');
            return;
        }
        setIsProcessing(true);
        setExplanation(null);
        try {
            const code = selfProgrammingState.virtualFileSystem[component];
            if (!code) {
                throw new Error(`Could not find component code for ${component} in VFS.`);
            }
            const result = await geminiAPI.explainComponentFromFirstPrinciples(code, component);
            setExplanation(result);
        } catch (e) {
            addToast(`Explanation failed: ${(e as Error).message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('searchModal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleExplain} disabled={isProcessing || !component}>
                {isProcessing ? t('reflector_explaining') : t('reflector_explain')}
            </button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('reflector_modal_title')} 
            footer={footer}
            className="search-modal"
        >
            <div className="trace-section">
                <h4>{t('reflector_modal_heading')}</h4>
                <p>{t('reflector_modal_description')}</p>
                <div className="image-gen-control-group">
                    <label htmlFor="component-select">{t('reflector_select_component')}</label>
                    <select id="component-select" value={component} onChange={e => setComponent(e.target.value)} disabled={isProcessing}>
                        {CORE_COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            {isProcessing && (
                <div className="processing-indicator">
                    {t('reflector_explaining')} <div className="spinner"></div>
                </div>
            )}
            {explanation && (
                <div className="trace-section">
                    <h4>{t('reflector_explanation_for', { component })}</h4>
                    <div className="explanation-content" style={{ maxHeight: '40vh', overflowY: 'auto', background: 'rgba(0,0,0,0.1)', padding: '0.5rem' }}>
                         <SafeMarkdown text={explanation} />
                    </div>
                </div>
            )}
        </Modal>
    );
};