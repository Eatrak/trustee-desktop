import { FC, useState } from "react";
import Validator from "validatorjs";

import SettingsService from "@shared/services/settings";
import { Utils } from "@shared/services/utils";
import { FieldName, TranslationKey } from "@shared/ts-types/generic/translations";
import { updatePasswordBodyRules } from "@shared/validatorRules/user";
import NormalButton from "@shared/components/NormalButton";
import { UpdatePasswordBody } from "@shared/ts-types/APIs/input/user/updatePassword";
import InputTextField from "@shared/components/InputTextField";

const SettingsChangePassword: FC = () => {
    const [isSavingChanges, setIsSavingChanges] = useState(false);
    let [password, setPassword] = useState<string>("");
    let [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [
                TranslationKey.MODULES,
                TranslationKey.SETTINGS,
                TranslationKey.TABS,
                TranslationKey.CHANGE_PASSWORD,
                ...translationKeys,
            ],
            params,
        );
    };

    const hasErrors = () => {
        const body: UpdatePasswordBody = {
            updateInfo: {
                password,
                repeatedPassword,
            },
        };

        // Validate data
        const validator = new Validator(body, updatePasswordBodyRules);
        return validator.fails();
    };

    const saveChanges = async () => {
        setIsSavingChanges(true);

        try {
            await SettingsService.getInstance().updatePassword({
                updateInfo: {
                    password,
                    repeatedPassword,
                },
            });
        } catch (err) {}

        setIsSavingChanges(false);
    };

    return (
        <div className="settings-tab">
            <div className="settings-tab__content">
                {/* Password field */}
                <InputTextField
                    value={password}
                    onInput={setPassword}
                    validatorAttributeName={FieldName.PASSWORD}
                    title={translate([TranslationKey.FIELDS, TranslationKey.PASSWORD])}
                    type="password"
                />
                {/* Repeated password field */}
                <InputTextField
                    value={repeatedPassword}
                    onInput={setRepeatedPassword}
                    validatorRule={updatePasswordBodyRules}
                    validatorAttributeName={FieldName.REPEATED_PASSWORD}
                    title={translate([
                        TranslationKey.FIELDS,
                        TranslationKey.REPEATED_PASSWORD,
                    ])}
                    type="password"
                />
            </div>
            <div className="settings-tab__footer">
                <NormalButton
                    className="transaction-creation-dialog__footer__confirmation-button"
                    text={translate([TranslationKey.FOOTER, TranslationKey.CONFIRM])}
                    isLoading={isSavingChanges}
                    event={saveChanges}
                    state="success"
                    disabled={hasErrors() || isSavingChanges}
                />
            </div>
        </div>
    );
};

export default SettingsChangePassword;
