// components/ThemeSwitcher.tsx
import React from 'react';
import { useAuraDispatch, useCoreState, useLocalization } from '../context/AuraContext.tsx';

const themes = [
    { id: 'ui-1', nameKey: 'theme_cyberpunk' },
    { id: 'ui-2', nameKey: 'theme_solarizedLight' },
    { id: 'ui-3', nameKey: 'theme_business' },
    { id: 'ui-4', nameKey: 'theme_vaporwave' },
    { id: 'ui-5', nameKey: 'theme_8bit' },
    { id: 'ui-6', nameKey: 'theme_steampunk' },
    { id: 'ui-7', nameKey: 'theme_organic' },
    { id: 'ui-8', nameKey: 'theme_blackAndWhite' },
    { id: 'ui-9', nameKey: 'theme_psychedelic' },
    { id: 'ui-10', nameKey: 'theme_raver' },
    { id: 'ui-11', nameKey: 'theme_tokyo' },
    { id: 'ui-12', nameKey: 'theme_gravitational' },
];

export const ThemeSwitcher = () => {
    const { theme } = useCoreState();
    const { dispatch } = useAuraDispatch();
    const { t } = useLocalization();

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'SYSCALL', payload: { call: 'SET_THEME', args: e.target.value } });
    };

    return (
        <div className="localization-panel"> {/* Reusing style for consistency */}
            <label htmlFor="theme-switcher">{t('themeSwitcher')}</label>
            <div className="theme-switcher-container">
                <select id="theme-switcher" value={theme} onChange={handleThemeChange}>
                    {themes.map(themeOption => (
                        <option key={themeOption.id} value={themeOption.id}>
                            {t(themeOption.nameKey)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};