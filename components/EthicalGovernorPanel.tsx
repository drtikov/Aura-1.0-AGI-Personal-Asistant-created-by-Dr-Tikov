// components/EthicalGovernorPanel.tsx
import React from 'react';
import { useEngineState, useLocalization } from '../context/AuraContext.tsx';

export const EthicalGovernorPanel = React.memo(() => {
    const { ethicalGovernorState: state } = useEngineState();
    const { t } = useLocalization();
    return (
        <div className="side-panel ethical-governor-panel">
            <div className="ethical-governor-content">
                <div className="panel-subsection-title">{t('ethicalGovernor_corePrinciples')}</div>
                <ul className="ethical-principles-list">
                    {state.principles.map((principle, index) => <li key={index}>{principle}</li>)}
                </ul>
                <div className="panel-subsection-title">{t('ethicalGovernor_vetoLog')}</div>
                {state.vetoLog.length === 0 ? (
                    <div className="kg-placeholder">{t('ethicalGovernor_noVetos')}</div>
                ) : (
                    state.vetoLog.map(log => (
                        <div key={log.id} className="veto-log-item">
                            <p className="veto-action"><strong>{t('ethicalGovernor_vetoed')}:</strong> {log.actionDescription}</p>
                            <p className="veto-reason"><strong>{t('ethicalGovernor_reason')}:</strong> {log.reason}</p>
                            <p className="veto-principle"><strong>{t('ethicalGovernor_principle')}:</strong> "{log.principleViolated}"</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});