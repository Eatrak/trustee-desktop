import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { TranslationLanguage } from "@shared/ts-types/generic/translations";
import en from "./translations/en";

const resources = {
    [TranslationLanguage.EN]: en,
};

i18n.use(initReactI18next).init({
    resources,
    lng: TranslationLanguage.EN,
    fallbackLng: TranslationLanguage.EN,
});

export default i18n;
