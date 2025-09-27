

import React from 'react';
import { Modal } from './Modal';
import { Accordion } from './Accordion';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { CognitivePrimitiveDefinition } from '../types';

// FIX: Wrapped the component in React.memo to correctly handle the `key` prop when used in a list.
const PrimitiveCard = React.memo(({ primitive }: { primitive: CognitivePrimitiveDefinition }) => {
    const { addToast } = useAuraDispatch();
    const { t } = useLocalization();

    const handleCopy = () => {
        const primitiveString = JSON.stringify(primitive, null, 2);
        navigator.clipboard.writeText(primitiveString).then(() => {
            addToast(t('codeEvolution_copied'), 'success');
        }, () => {
            addToast(t('codeEvolution_copyFailed'), 'error');
        });
    };

    return (
        <div className="proposal-card" style={{ marginBottom: '1rem' }}>
            <div className="proposal-card-header">
                <span className="proposal-type-badge psyche">{primitive.type}</span>
            </div>
            <div className="proposal-card-body">
                <p><em>{primitive.description}</em></p>
                <div className="code-snippet-container">
                    <pre><code>{JSON.stringify(primitive.payloadSchema, null, 2)}</code></pre>
                    <button
                        className="copy-snippet-button"
                        onClick={handleCopy}
                        title={t('codeEvolution_copy')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
});

export const PsychePrimitivesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { psycheState } = useArchitectureState();
    const { t } = useLocalization();
    const { addToast } = useAuraDispatch();
    const primitives = Object.values(psycheState.primitiveRegistry);

    const handleCopyAll = () => {
        const allPrimitivesString = JSON.stringify(psycheState.primitiveRegistry, null, 2);
        navigator.clipboard.writeText(allPrimitivesString).then(() => {
            addToast(t('psyche_modal_copy_all_success'), 'success');
        }, () => {
            addToast(t('psyche_modal_copy_all_failed'), 'error');
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${t('psyche_primitiveRegistry')} (v${psycheState.version})`}
            className="psyche-primitives-modal"
        >
            <p className="reason-text" style={{ marginBottom: '1rem' }}>
                {t('psyche_modal_description')}
            </p>

            <div className="top-actions">
                <button className="control-button" onClick={handleCopyAll}>
                    {t('psyche_modal_copy_all')}
                </button>
            </div>
            
            <Accordion title={t('psyche_modal_full_registry')} defaultOpen={false}>
                <div className="code-snippet-container">
                    <pre><code>{JSON.stringify(psycheState.primitiveRegistry, null, 2)}</code></pre>
                </div>
            </Accordion>

            <div className="primitives-grid" style={{marginTop: '1.5rem'}}>
                {primitives.map((primitive: CognitivePrimitiveDefinition) => (
                    <PrimitiveCard key={primitive.type} primitive={primitive} />
                ))}
            </div>
        </Modal>
    );
};
