// hooks/useGunaAnalysis.ts
import { useState, useEffect } from 'react';
import { InternalState } from '../types.ts';
import { useLocalization } from '../context/AuraContext.tsx';
import { apaManager } from '../core/apa_manager.ts';

export const useGunaAnalysis = (internalState: InternalState, t: (key: string, options?: any) => string): string => {
    const [gunaReason, setGunaReason] = useState(t('gunaReasonCalculating'));

    useEffect(() => {
        let isCancelled = false;
        
        // Offload the calculation to the APA worker
        apaManager.calculateGunaReason(internalState).then(result => {
            if (!isCancelled && result) {
                // The translation happens back on the main thread
                setGunaReason(t(result.key, result.options));
            }
        });

        // Cleanup function to prevent setting state on an unmounted component
        return () => {
            isCancelled = true;
        };
    }, [internalState, t]);

    return gunaReason;
};