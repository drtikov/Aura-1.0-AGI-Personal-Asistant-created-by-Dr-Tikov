import React, { useState, useId } from 'react';

export const Accordion = ({ title, children, defaultOpen = false, summary }: { title: string, children: React.ReactNode, defaultOpen?: boolean, summary?: string }) => {
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
                    {summary && <span className="accordion-summary">{summary}</span>}
                </div>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div
                className="accordion-content"
                id={contentId}
                role="region"
            >
                {children}
            </div>
        </div>
    );
};
