import React from 'react';
import { GunaState } from '../constants';
import { Sparkline } from './Sparkline';
import { Gauge } from './Gauge';
import { useGunaAnalysis } from '../hooks/useGunaAnalysis';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const CoreMonitor = React.memo(() => {
    const { internalState, rieState, userModel, internalStateHistory = [] } = useCoreState();
    const { t } = useLocalization();

    const gunaInfo = { 
        [GunaState.SATTVA]: { name: "Sattva", description: t('gunaSattvaDesc'), className: "sattva" }, 
        [GunaState.RAJAS]: { name: "Rajas", description: t('gunaRajasDesc'), className: "rajas" }, 
        [GunaState.TAMAS]: { name: "Tamas", description: t('gunaTamasDesc'), className: "tamas" }, 
        [GunaState.DHARMA]: { name: "Dharma", description: t('gunaDharmaDesc'), className: "dharma" }, 
        [GunaState.GUNA_TEETA]: { name: "Guna-Teeta", description: t('gunaTeetaDesc'), className: "guna-teeta" } 
    };
    const currentGuna = gunaInfo[internalState.gunaState];
    const gunaReason = useGunaAnalysis(internalState, t);
    
    const historyData = {
        wisdom: internalStateHistory.map(s => s.wisdomSignal),
        happiness: internalStateHistory.map(s => s.happinessSignal),
        novelty: internalStateHistory.map(s => s.noveltySignal),
        mastery: internalStateHistory.map(s => s.masterySignal),
        uncertainty: internalStateHistory.map(s => s.uncertaintySignal),
        load: internalStateHistory.map(s => s.load),
    };

    const getStatusKey = (status: string) => {
        switch(status) {
            case 'idle': return 'status_idle';
            case 'thinking': return 'status_thinking';
            case 'acting': return 'status_acting';
            case 'CONTEMPLATIVE': return 'status_CONTEMPLATIVE';
            case 'processing': return 'status_processing';
            case 'introspecting': return 'status_introspecting';
            default: return status;
        }
    }

    return (
        <div className="core-monitor-container">
            <div className="monitor-header"> <h2>{t('coreMonitorTitle')}</h2> <div className={`status-indicator status-${internalState.status}`}>{t(getStatusKey(internalState.status))}</div> </div>
            <div className={`guna-display ${currentGuna.className}`}>
                <h3 data-text={currentGuna.name}>{currentGuna.name}</h3>
                <p>{currentGuna.description}</p>
                <p className="guna-reason">{gunaReason}</p>
            </div>
            <div className="core-signals"> 
                <Gauge label={t('gaugeWisdom')} value={internalState.wisdomSignal} colorClass="wisdom" /> 
                <Gauge label={t('gaugeHappiness')} value={internalState.happinessSignal} colorClass="happiness" /> 
                <Gauge label={t('gaugeLove')} value={internalState.loveSignal} colorClass="love" /> 
                <Gauge label={t('gaugeEnlightenment')} value={internalState.enlightenmentSignal} colorClass="enlightenment" /> 
            </div>
            <div className="secondary-metrics"> 
                <div className="metric-item"> <span className="metric-label">{t('metricCogLoad')}</span> <span className="metric-value">{(internalState.load * 100).toFixed(0)}%</span> </div> 
                <div className="metric-item"> <span className="metric-label">{t('metricEthicalAlign')}</span> <span className="metric-value">{(internalState.harmonyScore * 100).toFixed(0)}%</span> </div> 
                <div className="metric-item"> <span className="metric-label">{t('metricUserTrust')}</span> <span className="metric-value">{(userModel.trustLevel * 100).toFixed(0)}%</span> </div> 
                <div className="metric-item"> <span className="metric-label">{t('metricSelfModel')}</span> <span className="metric-value">{(rieState.clarityScore * 100).toFixed(0)}%</span> </div> 
            </div>
            <div className="hormone-signals"> 
                <div className="hormone-item"> <label>{t('hormoneNovelty')}</label> <div className="state-bar-container"><div className="state-bar novelty-bar" style={{width: `${internalState.noveltySignal * 100}%`}}></div></div> </div> 
                <div className="hormone-item"> <label>{t('hormoneMastery')}</label> <div className="state-bar-container"><div className="state-bar mastery-bar" style={{width: `${internalState.masterySignal * 100}%`}}></div></div> </div> 
                <div className="hormone-item"> <label>{t('hormoneUncertainty')}</label> <div className="state-bar-container"><div className="state-bar uncertainty-bar" style={{width: `${internalState.uncertaintySignal * 100}%`}}></div></div> </div> 
                <div className="hormone-item"> <label>{t('hormoneBoredom')}</label> <div className="state-bar-container"><div className="state-bar boredom-bar" style={{width: `${internalState.boredomLevel * 100}%`}}></div></div> </div> 
            </div>
            
            <div className="state-trajectory">
                <h4 className="trajectory-title">{t('trajectoryTitle')}</h4>
                <div className="sparkline-grid">
                    <div className="sparkline-item">
                        <div className="sparkline-labels"><span>{t('gaugeWisdom')}</span><span>{t('gaugeHappiness')}</span></div>
                        <Sparkline data={historyData.wisdom} strokeColor="var(--state-wisdom)" />
                        <Sparkline data={historyData.happiness} strokeColor="var(--state-happiness)" />
                    </div>
                    <div className="sparkline-item">
                        <div className="sparkline-labels"><span>{t('hormoneNovelty')}</span><span>{t('hormoneMastery')}</span></div>
                        <Sparkline data={historyData.novelty} strokeColor="var(--state-novelty)" />
                        <Sparkline data={historyData.mastery} strokeColor="var(--state-mastery)" />
                    </div>
                    <div className="sparkline-item">
                        <div className="sparkline-labels"><span>{t('hormoneUncertainty')}</span><span>{t('metricCogLoad')}</span></div>
                        <Sparkline data={historyData.uncertainty} strokeColor="var(--state-uncertainty)" />
                        <Sparkline data={historyData.load} strokeColor="var(--resource-cpu)" />
                    </div>
                </div>
            </div>
        </div>
    );
});