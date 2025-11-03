// components/Modal.tsx
import React, { ReactNode } from 'react';
// FIX: File 'core/sdkLoader.ts' is not a module. Assuming it should be a module and exporting 'loadSdk'. Adding a placeholder export to make it a module.
import { loadSdk } from '../core/sdkLoader.ts';

declare const anime: any;

// --- Simple Error Boundary for Modal Content ---
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ModalErrorBoundaryProps {
    children?: ReactNode;
}

class ModalErrorBoundary extends React.Component<ModalErrorBoundaryProps, ErrorBoundaryState> {
    // FIX: Replaced property initializer with a constructor to ensure `this.state` and `this.props` are correctly typed and accessible, resolving compiler errors.
    constructor(props: ModalErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Modal content crashed:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="modal-error-fallback" style={{ padding: '1rem', background: 'rgba(255,0,0,0.1)', border: '1px solid var(--failure-color)' }}>
                    <h4 style={{ color: 'var(--failure-color)'}}>Error</h4>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Something went wrong while rendering this modal's content.</p>
                    <pre style={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto', marginTop: '0.5rem' }}>
                        <code>{this.state.error?.message}</code>
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- Main Modal Component ---

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, footer, className = '' }: ModalProps) => {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const animeRef = React.useRef<any>(null);

    React.useEffect(() => {
        loadSdk('anime').then(() => {
             animeRef.current = anime;
        });
    }, []);

    React.useEffect(() => {
        if (!modalRef.current || !animeRef.current) return;

        if (isOpen) {
            animeRef.current({
                targets: modalRef.current,
                opacity: [0, 1],
                scale: [0.95, 1],
                duration: 300,
                easing: 'easeOutQuad',
            });
        }
    }, [isOpen]);

    const handleClose = React.useCallback(() => {
        if (!modalRef.current || !animeRef.current) {
            onClose();
            return;
        };

        animeRef.current({
            targets: modalRef.current,
            opacity: [1, 0],
            scale: [1, 0.95],
            duration: 200,
            easing: 'easeInQuad',
            complete: onClose
        });
    }, [onClose]);
    
    // Close on escape key
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
            <div ref={modalRef} className={`modal-content-inner ${className}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={handleClose} className="modal-close">&times;</button>
                </div>
                <div className="modal-body">
                    <ModalErrorBoundary>
                        {children}
                    </ModalErrorBoundary>
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};