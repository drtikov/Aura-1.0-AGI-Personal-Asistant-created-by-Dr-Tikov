import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './i18n'; // Initialize i18next
import './core/hostBridgeMock'; // Installs the mock Host Bridge on window object

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Failed to find the root element.");
}