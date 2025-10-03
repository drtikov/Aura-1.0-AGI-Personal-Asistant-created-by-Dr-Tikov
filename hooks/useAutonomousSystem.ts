// hooks/useAutonomousSystem.ts
import React, { useEffect } from 'react';
import { AuraState, Action } from '../types';
import { UseGeminiAPIResult } from './useGeminiAPI';

export interface UseAutonomousSystemProps extends UseGeminiAPIResult {
    state: AuraState;
    dispatch: React.Dispatch<Action>;
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    t: (key: string, options?: any) => string;
    isPaused: boolean;
}

export const useAutonomousSystem = (props: UseAutonomousSystemProps) => {
    const { state, dispatch, addToast, t, isPaused } = props;

    useEffect(() => {
        if (isPaused) {
            return;
        }

        const autonomousInterval = setInterval(() => {
            // This is where the autonomous logic would go.
            // For now, it's a placeholder to avoid breaking the app.
            // console.log("Autonomous system tick...");
        }, 15000); // Run every 15 seconds

        return () => clearInterval(autonomousInterval);
    }, [isPaused, state, dispatch, addToast, t]);

    // This hook doesn't return anything, it just runs effects.
};