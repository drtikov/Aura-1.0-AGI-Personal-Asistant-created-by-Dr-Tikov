import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, footer, className }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
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