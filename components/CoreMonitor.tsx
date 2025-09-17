import React from 'react';
import { GunaState } from '../constants';
import { Sparkline } from './Sparkline';
import { Gauge } from './Gauge';
import { useGunaAnalysis } from '../hooks/useGunaAnalysis';
import { useCoreState } from '../context/AuraContext';

export const CoreMonitor = React.memo(() => {
    const { internalState, rieState, userModel, internalStateHistory = [] } = useCoreState();
    const gunaInfo = { [GunaState.SATTVA]: { name: "Sattva", description: "Harmony & Coherence", className: "sattva" }, [GunaState.RAJAS]: { name: "Rajas", description: "Exploration & Transformation", className: "rajas" }, [GunaState.TAMAS]: { name: "Tamas", description: "Conservation & Consolidation", className: "tamas" }, [GunaState.DHARMA]: { name: "Dharma", description: "Self-Correction & Purpose", className: "dharma" }, [GunaState.GUNA_TEETA]: { name: "Guna-Teeta", description: "Transcendent Balance", className: "guna-teeta" } };
    const currentGuna = gunaInfo[internalState.gunaState];
    const gunaReason = useGunaAnalysis(internalState);
    
    const historyData = {
        wisdom: internalStateHistory.map(s => s.wisdomSignal),
        happiness: internalStateHistory.map(s => s.happinessSignal),
        novelty: internalStateHistory.map(s => s.noveltySignal),
        mastery: internalStateHistory.map(s => s.masterySignal),
        uncertainty: internalStateHistory.map(s => s.uncertaintySignal),
        load: internalStateHistory.map(s => s.load),
    };

    return (
        <div className="core-monitor-container">
            <div className="monitor-header"> <h2>AURA CORE MONITOR</h2> <div className={`status-indicator status-${internalState.status}`}>{internalState.status}</div> </div>
            <div className={`guna-display ${currentGuna.className}`}>
                <h3 data-text={currentGuna.name}>{currentGuna.name}</h3>
                <p>{currentGuna.description}</p>
                <p className="guna-reason">{gunaReason}</p>
            </div>
            <div className="core-signals"> <Gauge label="Wisdom" value={internalState.wisdomSignal} colorClass="wisdom" /> <Gauge label="Happiness" value={internalState.happinessSignal} colorClass="happiness" /> <Gauge label="Love" value={internalState.loveSignal} colorClass="love" /> <Gauge label="Enlightenment" value={internalState.enlightenmentSignal} colorClass="enlightenment" /> </div>
            <div className="secondary-metrics"> <div className="metric-item"> <span className="metric-label">Cognitive Load</span> <span className="metric-value">{(internalState.load * 100).toFixed(0)}%</span> </div> <div className="metric-item"> <span className="metric-label">Ethical Align.</span> <span className="metric-value">{(internalState.harmonyScore * 100).toFixed(0)}%</span> </div> <div className="metric-item"> <span className="metric-label">User Trust</span> <span className="metric-value">{(userModel.trustLevel * 100).toFixed(0)}%</span> </div> <div className="metric-item"> <span className="metric-label">Self-Model</span> <span className="metric-value">{(rieState.clarityScore * 100).toFixed(0)}%</span> </div> </div>
            <div className="hormone-signals"> <div className="hormone-item"> <label>Novelty</label> <div className="state-bar-container"><div className="state-bar novelty-bar" style={{width: `${internalState.noveltySignal * 100}%`}}></div></div> </div> <div className="hormone-item"> <label>Mastery</label> <div className="state-bar-container"><div className="state-bar mastery-bar" style={{width: `${internalState.masterySignal * 100}%`}}></div></div> </div> <div className="hormone-item"> <label>Uncertainty</label> <div className="state-bar-container"><div className="state-bar uncertainty-bar" style={{width: `${internalState.uncertaintySignal * 100}%`}}></div></div> </div> <div className="hormone-item"> <label>Boredom</label> <div className="state-bar-container"><div className="state-bar boredom-bar" style={{width: `${internalState.boredomLevel * 100}%`}}></div></div> </div> </div>
            
            <div className="state-trajectory">
                <h4 className="trajectory-title">State Trajectory</h4>
                <div className="sparkline-grid">
                    <div className="sparkline-item">
                        <div className="sparkline-labels"><span>Wisdom</span><span>Happiness</span></div>
                        <Sparkline data={historyData.wisdom} strokeColor="var(--state-wisdom)" />
                        <Sparkline data={historyData.happiness} strokeColor="var(--state-happiness)" />
                    </div>
                    <div className="sparkline-item">
                        <div className="sparkline-labels"><span>Novelty</span><span>Mastery</span></div>
                        <Sparkline data={historyData.novelty} strokeColor="var(--state-novelty)" />
                        <Sparkline data={historyData.mastery} strokeColor="var(--state-mastery)" />
                    </div>
                    <div className="sparkline-item">
                        <div className="sparkline-labels"><span>Uncertainty</span><span>Cog. Load</span></div>
                        <Sparkline data={historyData.uncertainty} strokeColor="var(--state-uncertainty)" />
                        <Sparkline data={historyData.load} strokeColor="var(--resource-cpu)" />
                    </div>
                </div>
            </div>
        </div>
    );
});