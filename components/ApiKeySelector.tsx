// components/ApiKeySelector.tsx
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    // The openSelectKey function from the host environment opens the dialog.
    await window.aistudio.openSelectKey();
    // We assume the user successfully selected a key to proceed.
    // This avoids race conditions where hasSelectedApiKey might not be updated immediately.
    onKeySelected();
  };

  return (
    <div className="api-key-selector-overlay">
      <div className="api-key-selector-content">
        <h2>API Key Required for Video Generation</h2>
        <p>
          The Veo video generation model requires you to select your own Google AI Studio API key. 
          Please ensure your project is configured for billing.
        </p>
        <p>
          For more information, please see the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer">
            billing documentation
          </a>.
        </p>
        <button onClick={handleSelectKey}>Select API Key</button>
      </div>
    </div>
  );
};