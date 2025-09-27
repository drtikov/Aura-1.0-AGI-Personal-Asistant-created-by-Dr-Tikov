// components/PraxisResonatorPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
// FIX: Import the `PraxisSession` type for explicit typing.
import { PraxisSession } from '../types';

export const PraxisResonatorPanel = () => {
    const { praxisResonatorState } = useArchitectureState();
    const { t } = useLocalization();
    const activeSessions = Object.values(praxisResonatorState.activeSessions);

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        return t('timeAgoSeconds', { count: seconds });
    };

    return (
        <div className="side-panel command-log-panel">
            {activeSessions.length === 0 ? (
                <div className="kg-placeholder">{t('praxisResonator_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {/* FIX: Explicitly type `session` as `PraxisSession` to resolve type errors on its properties. */}
                    {activeSessions.map((session: PraxisSession) => (
                        <div key={session.planId} className="command-log-item log-type-info">
                            <span className="log-icon" title={t('praxisResonator_session_active')}>
                                <div className="spinner-small" />
                            </span>
                            <span className="log-text" title={session.planId}>
                                {t('praxisResonator_resonating')} "{session.chat.model}"
                            </span>
                            <span className="log-time">{timeAgo(session.createdAt)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};