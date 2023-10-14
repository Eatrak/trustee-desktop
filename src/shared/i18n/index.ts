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

const currentLanguage = TranslationLanguage.IT;

i18n.use(initReactI18next).init({
    resources: translations,
    lng: currentLanguage,
    fallbackLng: TranslationLanguage.EN,
});

dayjs.locale(currentLanguage);

Validator.setMessages("en", validatorEn);
Validator.setMessages("it", validatorIt);

Validator.setAttributeFormatter((attribute: FieldName) => {
    return Utils.getInstance().translateFieldName(attribute);
});

Validator.useLang(i18n.language);

export default i18n;
