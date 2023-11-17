import { TranslationLanguage } from "@shared/ts-types/generic/translations";

export interface UpdateUserPreferencesBody {
    updateInfo: {
        currencyId: string;
        language: TranslationLanguage;
    };
}

export interface UpdateUserPreferencesInput extends UpdateUserPreferencesBody {
    userId: string;
}
