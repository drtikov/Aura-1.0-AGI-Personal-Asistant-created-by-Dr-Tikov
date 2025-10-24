// components/GuidedInquiryModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { AnalogicalHypothesisProposal } from '../types.ts';

export const GuidedInquiryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    
    const [sourceDomain, setSourceDomain] = useState('');
    const [targetDomain, setTargetDomain] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status' | 'proposalType' > | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSourceDomain('');
            setTargetDomain('');
            setIsProcessing(false);
            setResult(null);
        }
    }, [isOpen]);

    const handleAnalyzeClick = async () => {
        if (sourceDomain.trim() && targetDomain.trim()) {
            setIsProcessing(true);
            setResult(null);
            try {
                const analysisResult = await geminiAPI.findDirectedAnalogy(sourceDomain, targetDomain);
                if (analysisResult) {
                    setResult(analysisResult);
                } else {
                    addToast('Failed to find a meaningful analogy.', 'warning');
                }
            } catch (e) {
                addToast(`Error during analysis: ${(e as Error).message}`, 'error');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('searchModal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleAnalyzeClick} disabled={isProcessing || !sourceDomain.trim() || !targetDomain.trim()}>
                {isProcessing ? t('whatIf_analyzing') : 'Find Analogy'}
            </button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Guided Analogical Inquiry"
            footer={footer}
            className="search-modal" // Re-use styling
        >
            <div className="trace-section"> 
                <h4>Define Conceptual Domains</h4> 
                <p>Provide two distinct domains for the Prometheus Engine to bridge. The more specific, the better.</p>
                <div className="image-gen-control-group" style={{marginTop: '1rem'}}>
                    <label htmlFor="source-domain">Source Domain</label>
                    <input id="source-domain" type="text" value={sourceDomain} onChange={e => setSourceDomain(e.target.value)} placeholder="e.g., Complex Systems Theory, Mycology" disabled={isProcessing} className="vfs-path-input"/>
                </div>
                 <div className="image-gen-control-group" style={{marginTop: '1rem'}}>
                    <label htmlFor="target-domain">Target Domain</label>
                    <input id="target-domain" type="text" value={targetDomain} onChange={e => setTargetDomain(e.target.value)} placeholder="e.g., Software Architecture, Social Dynamics" disabled={isProcessing} className="vfs-path-input"/>
                </div>
            </div>
            
            {isProcessing && <div className="processing-indicator" style={{justifyContent: 'center', marginTop: '1rem'}}> <div className="spinner"></div> </div>}
            
            {result && (
                <div className="trace-section" style={{marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem'}}>
                    <div className="proposal-card type-analogical_hypothesis">
                        <div className="proposal-card-header">
                            <span className="proposal-type-badge analogical_hypothesis">Generated Hypothesis</span>
                        </div>
                        <div className="proposal-card-body">
                             <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                                {result.sourceDomain} ↔ {result.targetDomain}
                            </p>
                            <p><strong>Analogy:</strong> <em>{result.analogy}</em></p>
                            <p style={{marginTop: '0.75rem'}}><strong>Conjecture:</strong> {result.conjecture}</p>
                            <div className="code-snippet-container" style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.4)' }}>
                                <pre><code><strong>Reasoning Trace:</strong>{'\n'}{result.reasoning}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};