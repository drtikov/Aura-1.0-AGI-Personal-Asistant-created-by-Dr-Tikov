import React, { useState } from 'react';

export const Accordion = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}> <span>{title}</span> <span className="accordion-icon">{isOpen ? '-' : '+'}</span> </button>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};
