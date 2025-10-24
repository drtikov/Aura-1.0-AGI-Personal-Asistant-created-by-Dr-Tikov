// components/ThirdPartyLibrariesPanel.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

export const ThirdPartyLibrariesPanel = () => {
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <p className="reason-text">
                This panel lists the key third-party libraries that form the foundation of Aura's user interface and core functionalities.
            </p>
            <ul className="ethical-principles-list" style={{ marginTop: '1rem' }}>
                <li><strong>React:</strong> For building the user interface.</li>
                <li><strong>i18next:</strong> For internationalization and localization.</li>
                <li><strong>pdf.js:</strong> For processing PDF documents in the Wisdom Ingestion panel.</li>
                <li><strong>jsPDF:</strong> For generating PDF documents in the Document Forge.</li>
                <li><strong>KaTeX:</strong> For rendering mathematical formulas in the UI.</li>
            </ul>
        </div>
    );
};
