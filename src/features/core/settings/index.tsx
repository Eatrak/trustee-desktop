import { FC, useEffect, useState } from "react";
import { Subscription } from "rxjs";

import "./style.css";
import SettingsHeader from "./SettingsHeader";
import InputTextField from "@shared/components/InputTextField";
import AuthService from "@shared/services/auth";
import { FieldName, TranslationKey } from "@shared/ts-types/generic/translations";
import { Utils } from "@shared/services/utils";

const SettingsPage: FC = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");

    let personalInfoSubscription: Subscription;

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.MODULES, TranslationKey.SETTINGS, ...translationKeys],
            params,
        );
    };

    useEffect(() => {
        personalInfoSubscription = AuthService.getInstance().personalInfo$.subscribe(
            (personalInfo) => {
                setName(personalInfo.name);
                setSurname(personalInfo.surname);
                setEmail(personalInfo.email);
            },
        );
    }, []);

    useEffect(
        () => () => {
            personalInfoSubscription.unsubscribe();
        },
        [],
    );

    return (
        <div className="section section--main-content settings-section">
            <SettingsHeader></SettingsHeader>
            <div className="section__settings-card card">
                <div className="section__settings-card__content-container">
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
        </div>
    );
};

export default SettingsPage;
