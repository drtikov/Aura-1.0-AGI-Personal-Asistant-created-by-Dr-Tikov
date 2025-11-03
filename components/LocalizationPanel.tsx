// components/LocalizationPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

const languages = [
    { code: 'en', name: 'English' },
    // Add other languages here in the future
];

export const LocalizationPanel = () => {
    const { language } = useLocalization();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        syscall('SET_LANGUAGE', e.target.value);
    };

    return (
         <div className="localization-panel-inline">
            <label htmlFor="language-switcher">{t('languageSwitcher')}</label>
            <div className="theme-switcher-container">
                <select id="language-switcher" value={language} onChange={handleLanguageChange}>
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};