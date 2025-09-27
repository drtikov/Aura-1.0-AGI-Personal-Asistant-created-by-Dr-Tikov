import React from 'react';
import { useLocalization } from '../context/AuraContext';

export const CodeEvolutionPanel = () => {
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="kg-placeholder">{t('codeEvolution_deprecated')}</div>
        </div>
    );
};