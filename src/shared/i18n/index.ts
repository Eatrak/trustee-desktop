import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { TRANSLATION_LANGUAGE } from "@shared/ts-types/generic/translations";
import en from "./translations/en";

const resources = {
    [TRANSLATION_LANGUAGE.EN]: en,
};

i18n.use(initReactI18next).init({
    resources,
    lng: TRANSLATION_LANGUAGE.EN,
    fallbackLng: TRANSLATION_LANGUAGE.EN,
});

export default i18n;
