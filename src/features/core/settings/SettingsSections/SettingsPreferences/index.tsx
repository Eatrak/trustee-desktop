import { FC, useEffect, useState } from "react";
import { Subscription } from "rxjs";
import Validator from "validatorjs";

import { MultiSelectOptionProprieties } from "@shared/components/MultiSelect";
import Select, { SelectOption } from "@shared/components/Select";
import { Currency } from "@shared/schema";
import SettingsService from "@shared/services/settings";
import { Utils } from "@shared/services/utils";
import { UpdateUserPreferencesBody } from "@shared/ts-types/APIs/input/user/updateUserPreferences";
import {
    FieldName,
    TranslationKey,
    TranslationLanguage,
    getCompleteLanguageName,
} from "@shared/ts-types/generic/translations";
import { updateUserPreferencesBodyRules } from "@shared/validatorRules/user";
import TransactionsService from "@shared/services/transactions";
import NormalButton from "@shared/components/NormalButton";
import AuthService from "@shared/services/auth";

const SettingsPreferences: FC = () => {
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
            [
                TranslationKey.MODULES,
                TranslationKey.SETTINGS,
                TranslationKey.TABS,
                TranslationKey.PREFERENCES,
                ...translationKeys,
            ],
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
        const body: UpdateUserPreferencesBody = {
            updateInfo: {
                currencyId: selectedCurrencyOption?.value || "",
                language: (selectedLanguageOption?.value as TranslationLanguage) || "",
            },
        };

        // Validate data
        const validator = new Validator(body, updateUserPreferencesBodyRules);
        return validator.fails();
    };

    const saveChanges = async () => {
        setIsSavingChanges(true);

        try {
            await SettingsService.getInstance().updateSettingsPreferences({
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
        <div className="settings-tab">
            <div className="settings-tab__content">
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

export default SettingsPreferences;
