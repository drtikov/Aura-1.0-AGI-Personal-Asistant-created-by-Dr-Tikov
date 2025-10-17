import React from 'react';
import { Modal } from './Modal.tsx';
import { Accordion } from './Accordion.tsx';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
// FIX: Imported CognitivePrimitiveDefinition to resolve type error.
import { CognitivePrimitiveDefinition } from '../types.ts';

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
            addToast(t('psyche_library_copied_all'), 'success');
        }, () => {
            addToast(t('psyche_library_copy_failed'), 'error');
        });
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('psyche_library')}
            className="psyche-primitives-modal"
        >
            <div className="top-actions">
                <button className="control-button" onClick={handleCopyAll}>
                    {t('psyche_library_copy_all')}
                </button>
            </div>
            <div className="primitives-grid">
                {/* FIX: Explicitly typed 'primitive' to resolve 'unknown' type error. */}
                {primitives.map((primitive: CognitivePrimitiveDefinition) => (
                    <PrimitiveCard key={primitive.type} primitive={primitive} />
                ))}
            </div>
        </Modal>
    );
};