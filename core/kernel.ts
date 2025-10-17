// core/kernel.ts
import React from 'react';
// FIX: Import missing types Action, SyscallCall, and SyscallPayload
import { Action, SyscallCall, SyscallPayload } from '../types';

/**
 * The formal System Call (SYSCALL) interface for Aura's Kernel.
 * This is the *only* legitimate way for "user space" components to request a state change.
 * It ensures all actions are channeled through a single, controlled entry point,
 * mirroring the security and stability model of a real operating system kernel.
 * 
 * @param dispatch The `dispatch` function from the core `useReducer` hook. This represents the kernel's privileged access to modify the state.
 * @param call The specific system call to be executed (e.g., 'ADD_HISTORY_ENTRY').
 * @param args The arguments required for that system call.
 */
const syscall = (
    dispatch: React.Dispatch<Action>, 
    call: SyscallCall, 
    args: any
) => {
    const payload: SyscallPayload = { call, args };
    dispatch({ type: 'SYSCALL', payload });
};

export const Kernel = {
    syscall,
};