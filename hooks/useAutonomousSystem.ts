import React, { useEffect, useCallback } from 'react';
import { AuraState, SelfDirectedGoal, ToastType, ResourceMonitor, RIEInsight, PerformanceLogEntry } from '../types';
import { Action } from '../state/reducer';
import { AuraConfig, GoalType, SignalType } from '../constants';

export const useAutonomousSystem = (
    state: AuraState, 
    dispatch: React.Dispatch<Action>, 
    addToast: (msg: string, type?: ToastType) => void, 
    isPaused: boolean, 
    runProactiveCycle: () => void,
    runRootCauseAnalysis: (failedLog: PerformanceLogEntry) => Promise<RIEInsight | null>
) => {
    useEffect(() => {
        if (isPaused) return;
        const autonomousLoop = setInterval(() => {
            dispatch({ type: 'DECAY_INTERNAL_STATE' });
            dispatch({ type: 'LOG_INTERNAL_STATE' });
        }, 5000);
        return () => clearInterval(autonomousLoop);
    }, [isPaused, dispatch]);

    useEffect(() => {
        if (isPaused) return;
        const monitorInterval = setInterval(() => {
            const newMonitorState: ResourceMonitor = {
                cpu_usage: Math.random() * 0.4 + 0.1,
                memory_usage: state.internalState.load * 0.5 + 0.2 + (Math.random() - 0.5) * 0.1,
                io_throughput: Math.random() * 0.1,
                resource_allocation_stability: Math.max(0.5, 1 - state.internalState.uncertaintySignal - (Math.random() * 0.1)),
            };
            dispatch({ type: 'UPDATE_RESOURCE_MONITOR', payload: newMonitorState });
        }, 2000);
        return () => clearInterval(monitorInterval);
    }, [isPaused, dispatch, state.internalState.load, state.internalState.uncertaintySignal]);

    useEffect(() => {
        if (isPaused) return;
        const proactiveInterval = setInterval(() => {
            const now = Date.now();
            const timeSinceLast = now - (state.proactiveEngineState?.lastTrigger || 0);
            
            if (
                timeSinceLast > 30000 && 
                state.internalState.status === 'idle' && 
                (state.proactiveEngineState?.generatedSuggestions || []).filter(s => s.status === 'suggested').length === 0
            ) {
                runProactiveCycle();
            }
        }, 10000);
        return () => clearInterval(proactiveInterval);
    }, [isPaused, state.proactiveEngineState, state.internalState.status, runProactiveCycle]);
    
    useEffect(() => {
        if (isPaused) return;
        const rieInterval = setInterval(async () => {
            const analyzedLogIds = new Set(state.rieState.insights.map(i => i.failedLogId));
            const recentFailures = state.performanceLogs
                .filter(log => !log.success && !analyzedLogIds.has(log.id))
                .sort((a, b) => b.timestamp - a.timestamp);

            if (recentFailures.length > 0) {
                const failureToAnalyze = recentFailures[0];
                addToast('Analyzing recent task failure...', 'info');
                const insight = await runRootCauseAnalysis(failureToAnalyze);
                if (insight) {
                    dispatch({ type: 'ADD_RIE_INSIGHT', payload: insight });
                    addToast('New self-correction insight generated.', 'success');
                }
            }
        }, 20000); // Run RIE cycle every 20 seconds
        return () => clearInterval(rieInterval);
    }, [isPaused, state.performanceLogs, state.rieState.insights, runRootCauseAnalysis, dispatch, addToast]);

    const handleIntrospect = useCallback(() => {
        let newGoals: SelfDirectedGoal[] = [];
        if (state.internalState.boredomLevel > AuraConfig.EXPLORATION_THRESHOLD) {
            newGoals.push({ id: self.crypto.randomUUID(), goalType: GoalType.EXPLORATORY_DIVERSIFICATION, actionCommand: 'Find a surprising or novel connection between two seemingly unrelated concepts in your knowledge graph.', parameters: {}, urgency: state.internalState.boredomLevel, sourceSignal: SignalType.BOREDOM, creationTime: Date.now(), status: 'candidate', predictedOutcomes: { cognitiveGain: 0.8, duration: 15000 }, priority: 0 });
        }
        if (state.internalState.uncertaintySignal > AuraConfig.INQUIRY_THRESHOLD) {
            const lowConfidenceFact = state.knowledgeGraph.filter(f => f.confidence < 0.7).sort((a,b) => a.confidence - b.confidence)[0];
            if (lowConfidenceFact) {
                newGoals.push({ id: self.crypto.randomUUID(), goalType: GoalType.INFORMATION_SEEKING, actionCommand: `Verify or refute this fact: "${lowConfidenceFact.subject} ${lowConfidenceFact.predicate} ${lowConfidenceFact.object}". Use search if necessary.`, parameters: { factId: lowConfidenceFact.id }, urgency: state.internalState.uncertaintySignal, sourceSignal: SignalType.UNCERTAINTY, creationTime: Date.now(), status: 'candidate', predictedOutcomes: { cognitiveGain: 0.6, duration: 20000 }, priority: 0 });
            }
        }
        if (newGoals.length > 0) {
            const existingCommands = new Set(state.goals.map(g => g.actionCommand));
            const uniqueNewGoals = newGoals.filter(g => !existingCommands.has(g.actionCommand));
            if (uniqueNewGoals.length === 0) { addToast(`Introspection complete. No new goals generated.`, 'info'); return; }
            const allCandidates = [...state.goals.filter(g => g.status === 'candidate' || g.status === 'dominant'), ...uniqueNewGoals].map(g => ({...g, priority: g.urgency * 1.2 + g.predictedOutcomes.cognitiveGain })).sort((a, b) => b.priority - a.priority);
            if (allCandidates.length > 0) allCandidates[0].status = 'dominant';
            for (let i = 1; i < allCandidates.length; i++) allCandidates[i].status = 'candidate';
            const otherGoals = state.goals.filter(g => g.status !== 'candidate' && g.status !== 'dominant');
            addToast(`Introspection complete. ${uniqueNewGoals.length} new goal(s) generated.`, 'info');
            dispatch({ type: 'SET_GOALS', payload: [...otherGoals, ...allCandidates] });
        } else {
            addToast('Introspection complete. No new goals generated.', 'info');
        }
    }, [state.internalState, state.knowledgeGraph, state.goals, addToast, dispatch]);

    return { handleIntrospect };
};