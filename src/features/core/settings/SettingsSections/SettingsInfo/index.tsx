import { FC, useEffect, useState } from "react";
import { Subscription } from "rxjs";

import InputTextField from "@shared/components/InputTextField";
import { FieldName, TranslationKey } from "@shared/ts-types/generic/translations";
import { Utils } from "@shared/services/utils";
import AuthService from "@shared/services/auth";

const SettingsInfo: FC = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    let getPersonalInfoSubscription: Subscription;

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [
                TranslationKey.MODULES,
                TranslationKey.SETTINGS,
                TranslationKey.TABS,
                TranslationKey.INFO,
                ...translationKeys,
            ],
            params,
        );
    };

    useEffect(() => {
        getPersonalInfoSubscription = AuthService.getInstance().personalInfo$.subscribe(
            (personalInfo) => {
                setName(personalInfo.name);
                setSurname(personalInfo.surname);
                setEmail(personalInfo.email);
            },
        );
    }, []);

    useEffect(
        () => () => {
            getPersonalInfoSubscription.unsubscribe();
        },
        [],
    );

    return (
        <div className="settings-tab">
            <div className="settings-tab__content">
                {/* Name field */}
                <InputTextField
                    value={name}
                    validatorAttributeName={FieldName.NAME}
                    title={translate([TranslationKey.FIELDS, TranslationKey.NAME])}
                    placeholder="John"
                    disabled
                />
                {/* Surname field */}
                <InputTextField
                    value={surname}
                    validatorAttributeName={FieldName.SURNAME}
                    title={translate([TranslationKey.FIELDS, TranslationKey.SURNAME])}
                    placeholder="Doe"
                    disabled
                />
                {/* Email field */}
                <InputTextField
                    value={email}
                    validatorAttributeName={FieldName.EMAIL}
                    title={translate([TranslationKey.FIELDS, TranslationKey.EMAIL])}
                    placeholder="johndoe@test.com"
                    disabled
                />
            </div>
        </div>
    );
};

export default SettingsInfo;
