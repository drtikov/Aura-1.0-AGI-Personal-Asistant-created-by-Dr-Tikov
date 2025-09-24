

import React, { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    // FIX: Made children prop optional to resolve errors in components using Modal without explicit children.
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
            
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
            );
            
            if (focusableElements && focusableElements.length > 0) {
                // FIX: Cast to HTMLElement to ensure .focus() is available.
                (focusableElements[0] as HTMLElement).focus();
            }

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
                if (event.key === 'Tab' && modalRef.current) {
                    // FIX: Cast querySelectorAll result to HTMLElement array to fix type errors on el.offsetParent.
                    const focusable = (Array.from(modalRef.current.querySelectorAll<HTMLElement>(
                        `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
                    )) as HTMLElement[]).filter(el => el.offsetParent !== null);
                    
                    if (focusable.length === 0) return;

                    const firstElement = focusable[0];
                    const lastElement = focusable[focusable.length - 1];
                    
                    if (event.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            // FIX: Cast lastElement to HTMLElement to ensure .focus() is available.
                            (lastElement as HTMLElement).focus();
                            event.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            // FIX: Cast firstElement to HTMLElement to ensure .focus() is available.
                            (firstElement as HTMLElement).focus();
                            event.preventDefault();
                        }
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        } else {
            lastActiveElement.current?.focus();
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                ref={modalRef}
                className={`modal-content ${className || ''}`} 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <h3>{title}</h3>
                <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
                
                <div className="modal-body">
                    {children}
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