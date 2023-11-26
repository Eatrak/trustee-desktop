import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import Validator from "validatorjs";
//@ts-ignore
import validatorEn from "validatorjs/src/lang/en";
//@ts-ignore
import validatorIt from "validatorjs/src/lang/it";
import dayjs from "dayjs";
// Dayjs locale imports
import "dayjs/locale/it";

import { FieldName, TranslationLanguage } from "@/shared/ts-types/generic/translations";
import en from "./translations/en";
import it from "./translations/it";
import { Utils } from "@/shared/services/utils";

const translations = {
    [TranslationLanguage.EN]: en,
    [TranslationLanguage.IT]: it,
};

i18n.use(initReactI18next).init({
    resources: translations,
    fallbackLng: TranslationLanguage.EN,
});

z.setErrorMap(zodI18nMap);

i18n.on("languageChanged", (language) => {
    dayjs.locale(language);
    Validator.useLang(language);
});

export const setCurrentLanguage = async (language: TranslationLanguage) => {
    await i18n.changeLanguage(language);
};

setCurrentLanguage(TranslationLanguage.IT);

Validator.setMessages("en", validatorEn);
Validator.setMessages("it", validatorIt);

Validator.setAttributeFormatter((attribute: FieldName) => {
    return Utils.getInstance().translateFieldName(attribute);
});

export default i18n;
