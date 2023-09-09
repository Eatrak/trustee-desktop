import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { TranslationLanguage } from "@shared/ts-types/generic/translations";
import en from "./translations/en";
import it from "./translations/it";

const translations = {
    [TranslationLanguage.EN]: en,
    [TranslationLanguage.IT]: it,
};

i18n.use(initReactI18next).init({
    resources: translations,
    lng: TranslationLanguage.IT,
    fallbackLng: TranslationLanguage.EN,
});

export default i18n;
