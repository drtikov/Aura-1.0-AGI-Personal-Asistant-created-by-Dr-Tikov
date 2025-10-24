// components/SomaticCruciblePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
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
            case 'ethical_review':
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
                    <div key={pfs.id} className="pfs-card">
                        <div className="pfs-header">
                            <span className="pfs-name">{pfs.name}</span>
                            <span className="pfs-status" style={{ color: getStatusColor(pfs.status) }}>
                                {pfs.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="pfs-body">
                            <p className="pfs-description">{pfs.description}</p>
                            <div className="pfs-metrics">
                                <div className="pfs-metric-item">
                                    <div className="sparkline-labels">
                                        <span>Projected Wisdom Trajectory</span>
                                    </div>
                                    <Sparkline data={pfs.projectedTrajectory?.wisdom || [0,0]} strokeColor="var(--state-wisdom)" height={25} />
                                </div>
                                 <div className="pfs-metric-item">
                                    <div className="sparkline-labels">
                                        <span>Projected Harmony Trajectory</span>
                                    </div>
                                    <Sparkline data={pfs.projectedTrajectory?.harmony || [0,0]} strokeColor="var(--guna-dharma)" height={25} />
                                </div>
                            </div>
                        </div>
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
                    </div>
                ))
            )}
        </div>
    );
});