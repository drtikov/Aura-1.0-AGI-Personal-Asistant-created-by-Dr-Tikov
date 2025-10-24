// components/Modal.tsx
import React from 'react';

declare const anime: any;

// --- Simple Error Boundary for Modal Content ---
interface ErrorBoundaryProps {
    children?: React.ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
class ModalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    // FIX: Reverted to a standard constructor to ensure `this.props` is correctly initialized, as class properties were causing an issue.
    constructor(props: ErrorBoundaryProps) {
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
                <div className="failure-reason-display">
                    <strong>Modal Content Error</strong>
                    <p>There was an error rendering the content of this modal.</p>
                    <pre><code>{this.state.error?.message}</code></pre>
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

export const Modal = ({ isOpen, onClose, title, children, footer, className }: ModalProps) => {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const lastActiveElement = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            lastActiveElement.current = document.activeElement as HTMLElement;
            
            // Animate in using anime.js
            if (typeof anime !== 'undefined') {
                anime.remove([overlayRef.current, modalRef.current]); // Clear any previous animations
                anime({
                    targets: overlayRef.current,
                    opacity: [0, 1],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
                anime({
                    targets: modalRef.current,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 300,
                    easing: 'easeOutQuad',
                    complete: () => {
                        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                            `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
                        );
                        if (focusableElements && focusableElements.length > 0) {
                            (focusableElements[0] as HTMLElement).focus();
                        }
                    }
                });
            }

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
                if (event.key === 'Tab' && modalRef.current) {
                    const focusable = (Array.from(modalRef.current.querySelectorAll<HTMLElement>(
                        `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
                    )) as HTMLElement[]).filter(el => el.offsetParent !== null);
                    
                    if (focusable.length === 0) return;

                    const firstElement = focusable[0];
                    const lastElement = focusable[focusable.length - 1];
                    
                    if (event.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            (lastElement as HTMLElement).focus();
                            event.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            (firstElement as HTMLElement).focus();
                            event.preventDefault();
                        }
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                lastActiveElement.current?.focus();
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={overlayRef} className="modal-overlay" onMouseDown={onClose} style={{ opacity: 0 }}>
            <div 
                ref={modalRef}
                className={`modal-content-inner ${className || ''}`} 
                onMouseDown={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                style={{ opacity: 0 }}
            >
                <header className="modal-header">
                    {title}
                </header>
                <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
                
                <main className="modal-body">
                    <ModalErrorBoundary>
                        {children}
                    </ModalErrorBoundary>
                </main>

                {footer && (
                    <footer className="modal-footer">
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
};