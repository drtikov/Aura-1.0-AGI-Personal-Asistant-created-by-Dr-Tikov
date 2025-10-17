import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './i18n.ts'; // Initialize i18next

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Failed to find the root element.");
}