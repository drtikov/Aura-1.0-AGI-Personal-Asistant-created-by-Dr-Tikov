
import React, { useState, useId } from 'react';

interface AccordionProps {
    title: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
    summary?: string;
    hasNotifications?: boolean;
}

// Wrapped in React.memo for performance optimization to prevent re-rendering when props have not changed.
export const Accordion = React.memo(({ title, children, defaultOpen = false, summary, hasNotifications = false }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentId = useId();
    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button
                className="accordion-header"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                <div className="accordion-title-container">
                    <span className="accordion-title-text">{title}</span>
                    {summary && <span className={`accordion-summary ${hasNotifications ? 'has-notifications' : ''}`}>{summary}</span>}
                </div>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div
                className="accordion-content"
                id={contentId}
                role="region"
                style={{
                    maxHeight: isOpen ? '1000px' : '0',
                    paddingTop: isOpen ? '0.8rem' : '0',
                    paddingBottom: isOpen ? '0.8rem' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.5s ease-in-out, padding 0.5s ease-in-out',
                }}
            >
                {children}
            </div>
        </div>
    );
});