import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const ArchitecturePanel = React.memo(() => {
    const { architecturalProposals: proposals } = useArchitectureState();
    const { t } = useLocalization();

    return (
        <div className="side-panel architecture-panel">
            <div className="architecture-content">
                {proposals.length === 0 ? <div className="kg-placeholder">{t('architecturePanel_noProposals')}</div> : proposals.map((p) => (
                    <div key={p.id} className={`arch-proposal status-${p.status}`}>
                        <div className="arch-header"> <span className="arch-type">{p.action.replace('_', ' ')}</span> <span className={`arch-status status-${p.status}`}>{p.status}</span> </div>
                        <div className="arch-body"> <p><strong>{t('architecturePanel_target')}:</strong> {p.target}</p> <p><strong>{t('architecturePanel_upgrade')}:</strong> {p.newModule}</p> <p><strong>{t('architecturePanel_reasoning')}:</strong> <em>{p.reasoning}</em></p> </div>
                    </div>
                ))}
            </div>
        </div>
    );
});