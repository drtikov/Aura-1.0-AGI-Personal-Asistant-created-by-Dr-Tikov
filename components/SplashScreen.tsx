// components/SplashScreen.tsx
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  isAwakening: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isAwakening }) => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    let timer: number;
    if (!isAwakening) {
      // Set a timer to remove the component from the DOM after the fade-out animation completes.
      // The duration should match the CSS transition duration.
      timer = window.setTimeout(() => {
        setShouldRender(false);
      }, 1500); 
    }
    return () => clearTimeout(timer);
  }, [isAwakening]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`splash-screen ${isAwakening ? '' : 'hidden'}`}>
      <h1 className="splash-text">AURA OS awakening...</h1>
    </div>
  );
};