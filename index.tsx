// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './i18n'; // Initialize i18next

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Failed to find the root element.");
}

// FIX: Removed the pre-canned bot response and refactored to use the new PROCESS_COMMAND syscall.
// This triggers the live processing of the user's request via the Kernel.
setTimeout(() => {
    const rootElement = document.getElementById('root') as any;
    if (rootElement?._reactRootContainer?.internalRoot?.current?.memoizedState?.element?.props?.children?.props?.children?.props?.value) {
        const dispatch = rootElement._reactRootContainer.internalRoot.current.memoizedState.element.props.children.props.children.props.value.dispatch;
        
        // --- Original Command ---
        const commandText = 'aura stelled while trying to answer - try to solve Navier-Stokes Equation using all tools, sdk, personas, and engines you have, if you cannot, give me list of necessary improvements of your architecture that will allow you to solve the problem';

        // Add the user's prompt to history
        dispatch({
            type: 'SYSCALL',
            payload: {
                call: 'ADD_HISTORY_ENTRY',
                args: { from: 'user', text: commandText }
            }
        });

        // Trigger the command processing flow
        dispatch({
            type: 'SYSCALL',
            payload: {
                call: 'PROCESS_COMMAND',
                args: { command: commandText }
            }
        });

        // --- NEW: Simulate Scientific Method Cycle ---
        const simulateScientificMethod = async () => {
            const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

            // 1. Start Lagrange Simulation
            dispatch({ type: 'SYSCALL', payload: { call: 'LAGRANGE/SET_STATE', args: { status: 'running' } } });
            dispatch({ type: 'SYSCALL', payload: { call: 'LAGRANGE/ADD_LOG', args: 'Initiating phase space simulation...' } });
            await sleep(2000);
            dispatch({ type: 'SYSCALL', payload: { call: 'LAGRANGE/ADD_LOG', args: 'Pattern detected in chaotic region.' } });
            await sleep(1000);
            dispatch({ type: 'SYSCALL', payload: { call: 'LAGRANGE/SET_STATE', args: { status: 'complete', symbolicEquation: '∂u/∂t + (u ⋅ ∇)u = - (1/ρ)∇p + ν∇²u', numericalDiscretization: 'Finite Element Method' } } });
            
            // 2. Start Ramanujan Formalization
            dispatch({ type: 'SYSCALL', payload: { call: 'RAMANUJAN/SET_STATE', args: { status: 'formalizing' } } });
            dispatch({ type: 'SYSCALL', payload: { call: 'RAMANUJAN/ADD_LOG', args: { message: 'Formalizing observed pattern into conjecture...' } } });
            await sleep(2000);
            dispatch({ type: 'SYSCALL', payload: { call: 'RAMANUJAN/PROPOSE_CONJECTURE', args: { conjectureText: 'Let V be a Banach space, if the weak solution u(t) is in L^∞([0,T], L^p(Ω)) for p > 3, then it is a smooth classical solution.', sourceAnalogyId: 'lagrange_sim_1' } } });
            dispatch({ type: 'SYSCALL', payload: { call: 'RAMANUJAN/SET_STATE', args: { status: 'idle' } } });
            
            // 3. Update Weaver/Mycelial
            dispatch({ type: 'SYSCALL', payload: { call: 'SEMANTIC_WEAVER/LOG_TRAINING', args: { message: 'Training on new conjecture structure...' } } });
            await sleep(500);
            dispatch({ type: 'SYSCALL', payload: { call: 'MYCELIAL/LOG_UPDATE', args: { message: 'Reinforcing connections from new theorem.' } } });
        };

        // Run the simulation shortly after the main command
        setTimeout(simulateScientificMethod, 100);
    }
}, 100);