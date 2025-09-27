import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';

export const TelosPanel = React.memo(() => {
    const { telosEngine } = useCoreState();
    const { t } = useLocalization();
    const modal = useModal();
    const { handleSetTelos } = useAuraDispatch();

    const sortedVectors = [...telosEngine.evolutionaryVectors].sort((a, b) => b.magnitude - a.magnitude);

    return (
        <div className="side-panel telos-panel">
            <div className="panel-subsection-title">{t('telos_current')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {telosEngine.telos || t('telos_notSet')}
            </p>
            <div className="button-grid">
                <button 
                    className="control-button" 
                    onClick={() => modal.open('telos', {})}
                >
                    {t('telos_setButton')}
                </button>
            </div>
            
            <div className="panel-subsection-title">{t('telos_evolutionaryVectors')}</div>
            {sortedVectors.length === 0 ? (
                <div className="kg-placeholder" style={{ marginBottom: '1rem' }}>{t('telos_noVectors')}</div>
            ) : (
                <div className="hormone-signals">
                    {sortedVectors.map(vector => (
                        <div key={vector.id} className="hormone-item" title={`${t('telos_source')}: ${vector.source}`}>
                            <label>{vector.direction}</label>
                            <div className="state-bar-container">
                                <div 
                                    className="state-bar" 
                                    style={{ 
                                        width: `${vector.magnitude * 100}%`, 
                                        backgroundColor: 'var(--guna-dharma)' 
                                    }}
                                    title={`${t('telos_magnitude')}: ${vector.magnitude.toFixed(3)}`}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});