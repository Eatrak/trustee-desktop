import { FC, useEffect, useState } from "react";
import { Subscription } from "rxjs";

import "./style.css";
import SettingsHeader from "./SettingsHeader";
import InputTextField from "@shared/components/InputTextField";
import AuthService from "@shared/services/auth";
import {
    FieldName,
    TranslationKey,
    TranslationLanguage,
    getCompleteLanguageName,
} from "@shared/ts-types/generic/translations";
import { Utils } from "@shared/services/utils";
import Select, { SelectOption } from "@shared/components/Select";
import { MultiSelectOptionProprieties } from "@shared/components/MultiSelect";
import { Currency } from "@shared/schema";
import TransactionsService from "@shared/services/transactions";
import NormalButton from "@shared/components/NormalButton";
import SettingsService from "@shared/services/settings";
import { updateUserSettingsBodyRules } from "@shared/validatorRules/user";
import { UpdateUserSettingsBody } from "@shared/ts-types/APIs/input/user/updateUserSettings";
import Validator from "validatorjs";

const SettingsPage: FC = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [isSavingChanges, setIsSavingChanges] = useState(false);
    let [selectedCurrencyOption, setSelectedCurrencyOption] =
        useState<SelectOption | null>(null);
    let [selectedLanguageOption, setSelectedLanguageOption] =
        useState<SelectOption | null>(null);
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    let getPersonalInfoSubscription: Subscription;
    let getCurrenciesSubscription: Subscription;

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.MODULES, TranslationKey.SETTINGS, ...translationKeys],
            params,
        );
    };

    const getCurrencyOptions = (): MultiSelectOptionProprieties[] => {
        return currencies.map((currency) => ({
            name: `${currency.symbol} ${currency.code}`,
            value: currency.id,
        }));
    };

    const getLanguageOptions = (): MultiSelectOptionProprieties[] => {
        return Object.values(TranslationLanguage).map((language) => ({
            name: getCompleteLanguageName(language),
            value: language,
        }));
    };

    const hasErrors = () => {
        const body: UpdateUserSettingsBody = {
            updateInfo: {
                currencyId: selectedCurrencyOption?.value || "",
                language: (selectedLanguageOption?.value as TranslationLanguage) || "",
            },
        };

        // Validate data
        const validator = new Validator(body, updateUserSettingsBodyRules);
        return validator.fails();
    };

    const saveChanges = async () => {
        setIsSavingChanges(true);

        try {
            await SettingsService.getInstance().updateSettings({
                updateInfo: {
                    currencyId: selectedCurrencyOption?.value || "",
                    language:
                        (selectedLanguageOption?.value as TranslationLanguage) || "",
                },
            });
        } catch (err) {}

        setIsSavingChanges(false);
    };

    useEffect(() => {
        getPersonalInfoSubscription = AuthService.getInstance().personalInfo$.subscribe(
            (personalInfo) => {
                setName(personalInfo.name);
                setSurname(personalInfo.surname);
                setEmail(personalInfo.email);

                // Set current user currency
                const { id, code, symbol } = personalInfo.settings.currency;
                setSelectedCurrencyOption({
                    value: id,
                    name: `${symbol} ${code}`,
                });

                const { language } = personalInfo.settings;
                setSelectedLanguageOption({
                    name: getCompleteLanguageName(language),
                    value: language,
                });
            },
        );

        getCurrenciesSubscription =
            TransactionsService.getInstance().currencies$.subscribe((currencies) => {
                setCurrencies(currencies);
            });
    }, []);

    useEffect(
        () => () => {
            getPersonalInfoSubscription.unsubscribe();
            getCurrenciesSubscription.unsubscribe();
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
                    {/* Language field */}
                    <Select
                        entityName={FieldName.LANGUAGE}
                        text={translate([
                            TranslationKey.FIELDS,
                            TranslationKey.LANGUAGE,
                            TranslationKey.TITLE,
                        ])}
                        filterInputPlaceholder={translate([
                            TranslationKey.FIELDS,
                            TranslationKey.LANGUAGE,
                            TranslationKey.FILTER_PLACEHOLDER,
                        ])}
                        options={getLanguageOptions()}
                        selectedOption={selectedLanguageOption}
                        onSelect={setSelectedLanguageOption}
                    />
                    {/* Currency field */}
                    <Select
                        entityName={FieldName.CURRENCY}
                        text={translate([
                            TranslationKey.FIELDS,
                            TranslationKey.CURRENCY,
                            TranslationKey.TITLE,
                        ])}
                        filterInputPlaceholder={translate([
                            TranslationKey.FIELDS,
                            TranslationKey.CURRENCY,
                            TranslationKey.FILTER_PLACEHOLDER,
                        ])}
                        options={getCurrencyOptions()}
                        selectedOption={selectedCurrencyOption}
                        onSelect={setSelectedCurrencyOption}
                    />
                </div>
                <div className="section__settings-card__footer">
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
        </div>
    );
};

export default SettingsPage;
