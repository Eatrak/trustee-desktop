import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Validator from "validatorjs";
//@ts-ignore
import validatorEn from "validatorjs/src/lang/en";
//@ts-ignore
import validatorIt from "validatorjs/src/lang/it";
import dayjs from "dayjs";
// Dayjs locale imports
import "dayjs/locale/it";

import { FieldName, TranslationLanguage } from "@shared/ts-types/generic/translations";
import en from "./translations/en";
import it from "./translations/it";
import { Utils } from "@shared/services/utils";

const translations = {
    [TranslationLanguage.EN]: en,
    [TranslationLanguage.IT]: it,
};

export const updateLanguage = (language: TranslationLanguage) => {
    i18n.use(initReactI18next).init({
        resources: translations,
        lng: language,
        fallbackLng: TranslationLanguage.EN,
    });

    dayjs.locale(i18n.language);

    Validator.useLang(i18n.language);
};

updateLanguage(TranslationLanguage.EN);

Validator.setMessages("en", validatorEn);
Validator.setMessages("it", validatorIt);

Validator.setAttributeFormatter((attribute: FieldName) => {
    return Utils.getInstance().translateFieldName(attribute);
});

export default i18n;
