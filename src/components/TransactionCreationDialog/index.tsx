import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";
import { Dayjs } from "dayjs";

import "./style.css";
import Dialog from "@components/Dialog";
import InputTextField from "@components/InputTextField";
import { Wallet } from "@models/transactions";
import TransactionsService from "@services/transactions";
import NormalButton from "@components/NormalButton";
import TextButton from "@components/TextButton";
import Select, { SelectOption } from "@components/Select";
import DatePicker from "@components/DatePicker";
import { createTransactionRules } from "@crudValidators/transactions";

const TransactionCreationDialog = () => {
    let [isSubmitEnabled, setIsSubmitEnabled] = useState<boolean>(false);
    let [ wallets, setWallets ] = useState<Wallet[]>([]);
    let [isDatePickerOpened, setIsDatePickerOpened] = useState<boolean>(false);

    // Form data
    let [ name, setName ] = useState<string>();
    let [ walletOption, setWalletOption ] = useState<SelectOption>();
    let [ categoryOption, setCategoryOption ] = useState<SelectOption>();
    let [ creationDate, setCreationDate ] = useState<Dayjs>();
    let [ value, setValue ] = useState<string>();

    const getWalletOptions = (): SelectOption[] => {
        return wallets.map(({ walletId, walletName }) => ({
            name: walletName,
            value: walletId
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

    useEffect(() => {
        TransactionsService.getInstance().wallets$.subscribe(setWallets);

        TransactionsService.getInstance().getWallets();
    }, []);

    useEffect(() => {
        setIsSubmitEnabled(isFormValid());
    }, [ name, walletOption, categoryOption, creationDate, value ]);

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
                    validatorRule="required"
                    onSelect={setWalletOption} />
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
