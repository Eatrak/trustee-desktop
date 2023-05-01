import { RefObject, useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";
import { Dayjs } from "dayjs";

import "./style.css";
import Dialog from "@components/Dialog";
import InputTextField from "@components/InputTextField";
import { Currency, Wallet } from "@models/transactions";
import TransactionsService from "@services/transactions";
import NormalButton from "@components/NormalButton";
import TextButton from "@components/TextButton";
import Select, { SelectOption } from "@components/Select";
import DatePicker from "@components/DatePicker";
import MiniSelect from "@components/MiniSelect";
import { createTransactionRules } from "@crudValidators/transactions";

const TransactionCreationDialog = () => {
    let currencySelect = useRef<React.ElementRef<typeof MiniSelect>>(null);
    let [isSubmitEnabled, setIsSubmitEnabled] = useState<boolean>(false);
    let [ wallets, setWallets ] = useState<Wallet[]>([]);
    let [ currencies, setCurrencies ] = useState<Currency[]>([]);
    let [isDatePickerOpened, setIsDatePickerOpened] = useState<boolean>(false);
    let [ isCreatingNewWallet, setIsCreatingNewWallet ] = useState<boolean>(false);

    // Form data
    let [ name, setName ] = useState<string>();
    let [ walletOption, setWalletOption ] = useState<SelectOption>();
    let [ selectedNewWalletCurrency, setSelectedNewWalletCurrency ] = useState<SelectOption>();
    let [ categoryOption, setCategoryOption ] = useState<SelectOption>();
    let [ creationDate, setCreationDate ] = useState<Dayjs>();
    let [ value, setValue ] = useState<string>();

    const getWalletOptions = (): SelectOption[] => {
        return wallets.map(({ walletId, walletName }) => ({
            name: walletName,
            value: walletId
        }));
    };

    const getCurrencyOptions = (): SelectOption[] => {
        return currencies.map(({ currencyCode, currencySymbol }) => ({
            name: `${currencySymbol} ${currencyCode}`,
            value: currencyCode
        }));
    };

    const isFormValid = (): boolean => {
        const validator = new Validator({
            name,
            wallet: walletOption?.value,
            category: categoryOption?.value,
            creationDate: creationDate?.toISOString(),
            value
        }, createTransactionRules);

        return validator.passes() || false;
    };

    const createWallet = async (newWalletName: string) => {
        setIsCreatingNewWallet(true);
        await TransactionsService.getInstance().createWallet({
            walletName: newWalletName,
            currencyCode: selectedNewWalletCurrency!.value
        });
        setIsCreatingNewWallet(false);
    };

    useEffect(() => {
        TransactionsService.getInstance().wallets$.subscribe(setWallets);
        TransactionsService.getInstance().currencies$.subscribe((currencies) => {
            setCurrencies(currencies);

            // Set default currency option
            const { currencyCode, currencySymbol } = currencies[0];
            currencySelect.current?.setSelectedOption({
                name: `${currencySymbol} ${currencyCode}`,
                value: currencyCode
            });
        });

        TransactionsService.getInstance().getWallets();
        TransactionsService.getInstance().getCurrencies();
    }, []);

    useEffect(() => {
        setIsSubmitEnabled(isFormValid());
    }, [ name, walletOption, selectedNewWalletCurrency, categoryOption, creationDate, value ]);

    return (
        <Dialog title="Transaction creation">
            <div className="transaction-creation-dialog__content">
                {/* Name */}
                <InputTextField
                    title="Name"
                    validatorAttributeName="name"
                    validatorRule="required"
                    onInput={setName} />
                {/* Wallet */}
                <Select
                    entityName="wallet"
                    text="Wallet"
                    filterInputPlaceholder="Search or create by typing a name"
                    options={getWalletOptions()}
                    createNewOption={createWallet}
                    isCreatingNewOption={isCreatingNewWallet}
                    getCreateNewOptionButtonText={(nameOfWalletToCreate) => `Create "${nameOfWalletToCreate}" wallet`}
                    validatorRule="required"
                    onSelect={setWalletOption}
                >
                    <MiniSelect
                        ref={currencySelect}
                        className="currency-select"
                        options={getCurrencyOptions()}
                        entityName="currency"
                        onSelect={setSelectedNewWalletCurrency} />
                </Select>
                {/* Category */}
                <Select
                    entityName="category"
                    text="Category"
                    filterInputPlaceholder="Search or create by typing a name"
                    options={[{ name: "a", value: "a" }]}
                    validatorRule="required"
                    onSelect={setCategoryOption} />
                {/* Creation date */}
                <DatePicker
                    isOpened={isDatePickerOpened}
                    setOpened={setIsDatePickerOpened}
                    validatorAttributeName="creation date"
                    validatorRule="required"
                    onDateChanged={setCreationDate} />
                {/* Value */}
                <InputTextField
                    title="Value"
                    type="number"
                    validatorAttributeName="value"
                    validatorRule="required"
                    onInput={setValue} />
            </div>
            <div className="transaction-creation-dialog__footer">
                <TextButton
                    text="Exit"
                    size="large" />
                <NormalButton
                    className="transaction-creation-dialog__footer__confirmation-button"
                    Icon={MdAdd}
                    text="Create"
                    disabled={!isSubmitEnabled} />
            </div>
        </Dialog>
    );
};

export default TransactionCreationDialog;
