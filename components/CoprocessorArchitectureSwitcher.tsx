// components/CoprocessorArchitectureSwitcher.tsx
import React from 'react';
import { useAuraDispatch, useLocalization, useArchitectureState } from '../context/AuraContext.tsx';
import { CoprocessorArchitecture } from '../types.ts';

export const CoprocessorArchitectureSwitcher = () => {
    const { syscall } = useAuraDispatch();
    const { cognitiveArchitecture } = useArchitectureState();
    const { t } = useLocalization();
    
    const currentArch = cognitiveArchitecture.coprocessorArchitecture;
    const isAutomatic = cognitiveArchitecture.coprocessorArchitectureMode === 'automatic';
    const autoReason = cognitiveArchitecture.lastAutoSwitchReason;

    const handleArchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        syscall('SET_COPROCESSOR_ARCHITECTURE', e.target.value as CoprocessorArchitecture);
    };
    
    const handleModeToggle = () => {
        const newMode = isAutomatic ? 'manual' : 'automatic';
        syscall('SET_COPROCESSOR_ARCHITECTURE_MODE', newMode);
    };

    const architectures: { id: CoprocessorArchitecture, labelKey: string }[] = [
        { id: CoprocessorArchitecture.TRIUNE, labelKey: 'coprocessor_TRIUNE' },
        { id: CoprocessorArchitecture.REFLEX_ARC, labelKey: 'coprocessor_REFLEX_ARC' },
        { id: CoprocessorArchitecture.EVENT_STREAM, labelKey: 'coprocessor_EVENT_STREAM' },
        { id: CoprocessorArchitecture.TEMPORAL_ENGINE, labelKey: 'coprocessor_TEMPORAL_ENGINE' },
        { id: CoprocessorArchitecture.SYMBIOTIC_ECOSYSTEM, labelKey: 'coprocessor_SYMBIOTIC_ECOSYSTEM' },
        { id: CoprocessorArchitecture.SENSORY_INTEGRATION, labelKey: 'coprocessor_SENSORY_INTEGRATION' },
        { id: CoprocessorArchitecture.SUBSUMPTION_RELAY, labelKey: 'coprocessor_SUBSUMPTION_RELAY' }
    ];

    return (
        <div className="side-panel">
            <div className="panel-subsection-title" style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{t('coprocessor_mode_title')}</span>
                <span className="accordion-summary" style={{ textTransform: 'uppercase' }}>
                    {isAutomatic ? t('coprocessor_mode_auto') : t('coprocessor_mode_manual')}
                </span>
            </div>
             <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button
                    className="control-button"
                    onClick={handleModeToggle}
                    title={isAutomatic ? t('coprocessor_switch_to_manual_tip') : t('coprocessor_switch_to_auto_tip')}
                >
                    {isAutomatic ? t('coprocessor_switch_to_manual') : t('coprocessor_switch_to_auto')}
                </button>
            </div>
            <div className={`radio-button-group ${isAutomatic ? 'disabled-group' : ''}`}>
                {architectures.map(arch => (
                    <label key={arch.id} className="radio-button-label">
                        <input 
                            type="radio" 
                            name="coprocessor-architecture" 
                            value={arch.id} 
                            checked={currentArch === arch.id} 
                            onChange={handleArchChange}
                            disabled={isAutomatic}
                        />
                        <span className="radio-button-custom"></span>
                        <span>{t(arch.labelKey)}</span>
                    </label>
                ))}
            </div>
            {isAutomatic && autoReason && (
                <div className="auto-reason-display" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '2px solid var(--primary-color)', paddingLeft: '0.75rem' }}>
                    <strong>{t('coprocessor_auto_reason')}:</strong> {t(autoReason, { ns: 'translation', defaultValue: autoReason })}
                </div>
            )}
        </div>
    );
};