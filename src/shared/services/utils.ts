import { getErrorType } from "@/shared/errors";
import ErrorType from "@/shared/errors/list";
import { toast } from "react-toastify";

import i18n from "@/shared/i18n";
import { FieldName, TranslationKey } from "@/shared/ts-types/generic/translations";

export class Utils {
    private static instance = new Utils();
    private locale: string;

    protected constructor() {
        this.locale =
            navigator.languages && navigator.languages.length
                ? navigator.languages[0]
                : navigator.language;
    }

    static getInstance() {
        return this.instance;
    }

    getAPIEndpoint(path: string) {
        const { VITE_APP_API_BASE_URL, VITE_APP_STAGE } = import.meta.env;

        if (!VITE_APP_API_BASE_URL || !VITE_APP_STAGE) return "";

        return VITE_APP_API_BASE_URL + VITE_APP_STAGE + path;
    }

    getFormattedAmount = (currencyCode: string, amount: number) => {
        return Intl.NumberFormat(this.locale, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    };

    getMultiQueryParams(name: string, values: string[]) {
        return values.reduce((accumulator, value, index) => {
            let queryParam = "";

            if (index > 0) queryParam = "&";

            queryParam += `${name}=${value}`;

            return (accumulator += queryParam);
        }, "");
    }

    getErrorMessage(status: number, code: string) {
        return [getErrorType(status, code)];
    }

    showErrorMessage(errorType: ErrorType) {
        const { ERRORS } = TranslationKey;

        return toast.error(this.translate([ERRORS, errorType]));
    }

    translate(translationKeys: (TranslationKey | ErrorType)[], params?: Object) {
        return i18n.t(translationKeys.join("."), params);
    }

    translateFieldName(fieldNameKey: FieldName) {
        return i18n.t(`${TranslationKey.FIELD_NAMES}.${fieldNameKey}`);
    }
}
