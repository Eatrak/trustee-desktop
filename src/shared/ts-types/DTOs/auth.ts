import { Currency } from "@shared/schema";
import { TranslationLanguage } from "../generic/translations";

interface PersonalInfoSettings {
    currency: Currency;
    language: TranslationLanguage;
}

export interface PersonalInfo {
    name: string;
    surname: string;
    email: string;
    settings: PersonalInfoSettings;
}
