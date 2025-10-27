// i18n.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
// FIX: Corrected import path for translations to resolve module error.
import { translations } from './localization.ts';

/**
 * Initializes and configures the i18next instance for the application.
 * This setup uses static resources from localization.ts and does not make
 * any external API calls for translations.
 */
i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: translations,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already protects from XSS
        },
    });

export default i18next;