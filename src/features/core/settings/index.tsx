import { FC, useEffect, useState } from "react";
import { Subscription } from "rxjs";

import "./style.css";
import SettingsHeader from "./SettingsHeader";
import InputTextField from "@shared/components/InputTextField";
import AuthService from "@shared/services/auth";

const SettingsPage: FC = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");

    let personalInfoSubscription: Subscription;

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
                        validatorAttributeName="name"
                        title="Name"
                        placeholder="John"
                        disabled
                    />
                    {/* Surname field */}
                    <InputTextField
                        value={surname}
                        validatorAttributeName="surname"
                        title="Surname"
                        placeholder="Doe"
                        disabled
                    />
                    {/* Email field */}
                    <InputTextField
                        value={email}
                        validatorAttributeName="email"
                        title="Email"
                        placeholder="johndoe@test.com"
                        disabled
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
