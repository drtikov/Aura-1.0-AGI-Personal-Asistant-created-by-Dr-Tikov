

import React, { useEffect, useRef, Component, ReactNode } from 'react';

// --- Simple Error Boundary for Modal Content ---
interface ErrorBoundaryProps {
    // FIX: Made children optional as the Modal component can be used without children, which would cause a type error here.
    children?: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
class ModalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        // FIX: Added 'this.' to correctly initialize state in the class constructor.
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Modal content crashed:", error, errorInfo);
    }

    render() {
        // FIX: Used 'this.state' to access the component's state.
        if (this.state.hasError) {
            return (
                <div className="failure-reason-display">
                    <strong>Modal Content Error</strong>
                    <p>There was an error rendering the content of this modal.</p>
                    {/* FIX: Used 'this.state' to access the error message. */}
                    <pre><code>{this.state.error?.message}</code></pre>
                </div>
            );
        }
        // FIX: Used 'this.props' to access the component's children.
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
    const modalRef = useRef<HTMLDivElement>(null);
    const lastActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            lastActiveElement.current = document.activeElement as HTMLElement;
            
            // Delay focus to allow for animation
            setTimeout(() => {
                const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                    `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
                );
                if (focusableElements && focusableElements.length > 0) {
                    (focusableElements[0] as HTMLElement).focus();
                }
            }, 300); // Should match animation duration

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
        <div className="modal-overlay" onMouseDown={onClose}>
            <div 
                ref={modalRef}
                className={`modal-content-inner ${className || ''}`} 
                onMouseDown={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
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