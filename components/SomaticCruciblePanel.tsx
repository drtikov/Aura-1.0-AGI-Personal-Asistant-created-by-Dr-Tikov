import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { Sparkline } from './Sparkline';

export const SomaticCruciblePanel = React.memo(() => {
    const { somaticCrucible: state } = useArchitectureState();
    const { t } = useLocalization();

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'validated':
            case 'success':
                return 'var(--success-color)';
            case 'rejected':
            case 'failure':
                return 'var(--failure-color)';
            case 'simulating':
            case 'designing':
                return 'var(--warning-color)';
            default:
                return 'var(--text-muted)';
        }
    };
    
    return (
        <div className="side-panel somatic-crucible-panel">
            <div className="panel-subsection-title">{t('somatic_pfsTitle')}</div>
            {state.possibleFutureSelves.length === 0 ? (
                <div className="kg-placeholder">{t('somatic_pfsPlaceholder')}</div>
            ) : (
                state.possibleFutureSelves.map(pfs => (
                    <div key={pfs.id} className="gde-status" style={{ borderLeftColor: getStatusColor(pfs.status) }}>
                        <p title={pfs.description}>
                           <strong>{pfs.name}</strong>
                        </p>
                        <small>{t('cogArchPanel_status')}: <span style={{ color: getStatusColor(pfs.status), fontWeight: 'bold' }}>{pfs.status}</span></small>
                    </div>
                ))
            )}
            
            <div className="panel-subsection-title">{t('somatic_simLogTitle')}</div>
            {state.simulationLogs.length === 0 ? (
                 <div className="kg-placeholder">{t('somatic_simLogPlaceholder')}</div>
            ) : (
                 state.simulationLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="rie-insight-item" style={{background: 'rgba(0,0,0,0.1)'}}>
                        <div className="mod-log-header">
                            <span className="mod-log-type" title={log.pfsId}>{log.pfsId.substring(0,12)}...</span>
                            <span className={`mod-log-status status-${log.outcome}`}>{log.outcome}</span>
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic', fontSize: '0.8rem'}}>
                            {log.reasoning}
                        </p>
                        {log.somaticTrajectory && log.somaticTrajectory.length > 1 && (
                            <div className="somatic-sparklines" style={{marginTop: '0.5rem'}}>
                               <Sparkline data={log.somaticTrajectory.map(s => s.wisdomSignal)} strokeColor='var(--state-wisdom)' height={20} />
                               <Sparkline data={log.somaticTrajectory.map(s => s.happinessSignal)} strokeColor='var(--state-happiness)' height={20} />
                               <Sparkline data={log.somaticTrajectory.map(s => s.load)} strokeColor='var(--resource-cpu)' height={20} />
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
});