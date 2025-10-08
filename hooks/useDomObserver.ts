// hooks/useDomObserver.ts
import { useEffect, useRef } from 'react';

// Debounce function to batch mutations
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    return function(this: any, ...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(later, wait);
    };
}


export const useDomObserver = (onMutationSummary: (summary: string) => void) => {
    const observer = useRef<MutationObserver | null>(null);

    useEffect(() => {
        const processMutations = debounce((mutations: MutationRecord[]) => {
            if (mutations.length === 0) return;
            
            let summary = '';
            if (mutations.length > 5) {
                summary = `${mutations.length} DOM changes detected.`;
            } else {
                const details = mutations.map(m => {
                    if (m.type === 'childList') {
                        return `${m.addedNodes.length} nodes added, ${m.removedNodes.length} removed.`;
                    }
                    if (m.type === 'attributes') {
                        return `Attribute '${m.attributeName}' changed on ${(m.target as HTMLElement).tagName}.`;
                    }
                    return 'DOM changed.';
                }).join('; ');
                summary = details;
            }
            onMutationSummary(summary);
        }, 500); // Batch mutations every 500ms

        observer.current = new MutationObserver((mutations) => {
            processMutations(mutations);
        });

        const config = {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class', 'style'] // Only observe common style changes
        };

        const targetNode = document.body;
        observer.current.observe(targetNode, config);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [onMutationSummary]);
};
