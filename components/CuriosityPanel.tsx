import React from 'react';
import { useCoreState } from '../context/AuraContext';
import { KnownUnknown } from '../types';

export const CuriosityPanel = React.memo(() => {
    const { curiosityState: state, knownUnknowns } = useCoreState();
    const informationGaps = state.informationGaps
        .map(id => knownUnknowns.find(ku => ku.id === id))
        .filter(Boolean) as KnownUnknown[];

    return (
        <div className="side-panel curiosity-panel">
            <div className="state-item">
                <label>Curiosity Level</label>
                <div className="state-bar-container">
                    <div className="state-bar curiosity-bar" style={{ width: `${state.level * 100}%` }}></div>
                </div>
            </div>
            
            <div className="panel-subsection-title">Active Inquiry</div>
            {state.activeInquiry ? (
                <div className="active-inquiry-item">
                    <div className="spinner-small"></div>
                    <span>{state.activeInquiry}</span>
                </div>
            ) : (
                 <div className="kg-placeholder">No active autonomous inquiry.</div>
            )}

            <div className="panel-subsection-title">Information Gaps</div>
             {informationGaps.length === 0 ? (
                <div className="kg-placeholder">No specific knowledge gaps identified.</div>
            ) : (
                informationGaps.map(item => (
                    <div key={item.id} className="veto-log-item">
                        <p className="veto-action">{item.question}</p>
                    </div>
                ))
            )}
        </div>
    );
});