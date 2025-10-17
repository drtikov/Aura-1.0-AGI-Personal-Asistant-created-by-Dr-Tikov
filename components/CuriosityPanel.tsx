// components/CuriosityPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
// FIX: Corrected import path for types to resolve module error.
import { KnownUnknown } from '../types';
import { useModal } from '../context/ModalContext';

export const CuriosityPanel = React.memo(() => {
    const { curiosityState: state, knownUnknowns } = useCoreState();
    const { t } = useLocalization();
    const modal = useModal();
    const informationGaps = state.informationGaps
        .map(id => knownUnknowns.find(ku => ku.id === id))
        .filter(Boolean) as KnownUnknown[];

    return (
        <div className="side-panel curiosity-panel">
            <div className="state-item">
                <label>{t('curiosityPanel_level')}</label>
                <div className="state-bar-container">
                    <div className="state-bar curiosity-bar" style={{ width: `${state.level * 100}%` }}></div>
                </div>
            </div>
            
            <div className="state-item">
                <label>{t('curiosityPanel_motivationDrive')}</label>
                <div className="state-bar-container">
                    <div className="state-bar" style={{ width: `${state.motivationDrive * 100}%`, backgroundColor: 'var(--guna-dharma)' }}></div>
                </div>
            </div>

            <div className="awareness-item">
                <label>{t('curiosityPanel_activeGoal')}</label>
                <strong title={state.activeCuriosityGoalId || ''}>{state.activeCuriosityGoalId ? `...${state.activeCuriosityGoalId.slice(-8)}` : t('curiosityPanel_noActiveGoal')}</strong>
            </div>

            <div className="panel-subsection-title">{t('curiosityPanel_activeInquiry')}</div>
            {state.activeInquiry ? (
                <div className="active-inquiry-item">
                    <div className="spinner-small"></div>
                    <span>{state.activeInquiry}</span>
                </div>
            ) : (
                 <div className="kg-placeholder">{t('curiosityPanel_noActiveInquiry')}</div>
            )}

            <div className="panel-subsection-title">{t('curiosityPanel_informationGaps')}</div>
             {informationGaps.length === 0 ? (
                <div className="kg-placeholder">{t('curiosityPanel_noGaps')}</div>
            ) : (
                informationGaps.map(item => (
                    <div key={item.id} className="veto-log-item">
                        <p className="veto-action">{item.question}</p>
                    </div>
                ))
            )}
            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button className="control-button" onClick={() => modal.open('poseQuestion', {})}>
                    {t('curiosityPanel_poseQuestion')}
                </button>
            </div>
        </div>
    );
});