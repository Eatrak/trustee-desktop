import { Err, Ok, Result } from "ts-results";
import { toast } from "react-toastify";

import { Utils } from "./utils";
import ErrorType from "@shared/errors/list";
import { getErrorType } from "@shared/errors";
import { ErrorResponseBodyAttributes } from "@shared/errors/types";
import {
    TranslationKey,
    TranslationLanguage,
} from "@shared/ts-types/generic/translations";
import { UpdateUserPreferencesBody } from "@shared/ts-types/APIs/input/user/updateUserPreferences";
import { UpdateUserPreferencesResponse } from "@shared/ts-types/APIs/output/user/updateUserPreferences";
import { setCurrentLanguage } from "@shared/i18n";
import AuthService from "./auth";
import TransactionsService from "./transactions";
import { UpdatePasswordBody } from "@shared/ts-types/APIs/input/user/updatePassword";

export default class SettingsService {
    static instance: SettingsService = new SettingsService();

    private constructor() {}

    static getInstance() {
        return this.instance;
    }

    translate(translationKeys: (TranslationKey | ErrorType)[]) {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.SETTINGS,
            ...translationKeys,
        ]);
    }

    async updatePassword(body: UpdatePasswordBody) {}

    async updateSettingsPreferences(
        body: UpdateUserPreferencesBody,
    ): Promise<Result<undefined, ErrorResponseBodyAttributes | undefined>> {
        try {
            // Initialize request URL
            const requestURL = Utils.getInstance().getAPIEndpoint(`/user/settings`);

            // Send request
            const response = await fetch(requestURL, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(body),
            });

            const { data, error }: UpdateUserPreferencesResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            // Update settings preferences in local
            const personalInfo = AuthService.getInstance().personalInfo$.getValue();
            const newCurrentCurrency = TransactionsService.getInstance().getCurrency(
                body.updateInfo.currencyId,
            );
            AuthService.getInstance().personalInfo$.next({
                ...personalInfo,
                settings: {
                    currency: newCurrentCurrency || personalInfo.settings.currency,
                    language: body.updateInfo.language,
                },
            });

            // Set new current language
            await setCurrentLanguage(body.updateInfo.language);

            toast.success(
                this.translate([
                    TranslationKey.TABS,
                    TranslationKey.PREFERENCES,
                    TranslationKey.TOAST_MESSAGES,
                    TranslationKey.SUCCESSFUL_SETTINGS_UPDATE,
                ]),
            );

            return Ok(undefined);
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return Err(undefined);
        }
    }

    getBrowserLanguage(): TranslationLanguage {
        return navigator.language.slice(0, 2) as TranslationLanguage;
    }
}
