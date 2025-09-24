

import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { SkillTemplate } from '../types';
import { useArchitectureState } from '../context/AuraContext';

export const CognitiveForgePanel = React.memo(() => {
    const { cognitiveForgeState: state } = useArchitectureState();
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
