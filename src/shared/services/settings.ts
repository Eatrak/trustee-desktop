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
import { UpdateUserSettingsBody } from "@shared/ts-types/APIs/input/user/updateUserSettings";
import { UpdateUserSettingsResponse } from "@shared/ts-types/APIs/output/user/updateUserSettings";
import { updateLanguage } from "@shared/i18n";

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
            TranslationKey.TOAST_MESSAGES,
            ...translationKeys,
        ]);
    }

    async updateSettings(
        body: UpdateUserSettingsBody,
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

            const { data, error }: UpdateUserSettingsResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            updateLanguage(body.updateInfo.language);
            toast.success(this.translate([TranslationKey.SUCCESSFUL_SETTINGS_UPDATE]));

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
