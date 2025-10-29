// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './i18n'; // Initialize i18next

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Failed to find the root element.");
}

// The initial self-diagnostic command that ran on startup has been removed to improve loading performance.
