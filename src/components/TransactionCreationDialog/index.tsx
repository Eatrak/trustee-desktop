import { RefObject, useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";
import { Dayjs } from "dayjs";

import "./style.css";
import Dialog from "@components/Dialog";
import InputTextField from "@components/InputTextField";
import { Currency, TransactionCategory, Wallet } from "@models/transactions";
import TransactionsService from "@services/transactions";
import NormalButton from "@components/NormalButton";
import TextButton from "@components/TextButton";
import Select, { SelectOption } from "@components/Select";
import DatePicker from "@components/DatePicker";
import MiniSelect from "@components/MiniSelect";
import { createTransactionBodyRules } from "@crudValidators/transactions";
import Checkbox from "@components/Checkbox";
import { CreateTransactionBody } from "src/shared/bodies/transactions/createTransaction";

interface IProps {
    close: Function
}

const TransactionCreationDialog = ({ close }: IProps) => {
    let currencySelect = useRef<React.ElementRef<typeof MiniSelect>>(null);
    let [ wallets, setWallets ] = useState<Wallet[]>([]);
    let [ currencies, setCurrencies ] = useState<Currency[]>([]);
    let [ transactionCategories, setTransactionCategories ] = useState<TransactionCategory[]>([]);
    let [isDatePickerOpened, setIsDatePickerOpened] = useState<boolean>(false);
    let [ isCreatingNewWallet, setIsCreatingNewWallet ] = useState<boolean>(false);
    let [ isCreatingTransactionCategory, setIsCreatingTransactionCategory ] = useState<boolean>(false);
    let [ isCreatingTransaction, setIsCreatingTransaction ] = useState<boolean>(false);

    // Form data
    let [ name, setName ] = useState<string>();
    let [ walletOption, setWalletOption ] = useState<SelectOption>();
    let [ selectedNewWalletCurrency, setSelectedNewWalletCurrency ] = useState<SelectOption>();
    let [ categoryOption, setCategoryOption ] = useState<SelectOption>();
    let [ creationDate, setCreationDate ] = useState<Dayjs>();
    let [ value, setValue ] = useState<number>();
    let [ isIncome, setIsIncome ] = useState<boolean>(false);

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

    const getTransactionCategoryOptions = (): SelectOption[] => {
        return transactionCategories.map(({
            transactionCategoryId,
            transactionCategoryName
        }) => ({
            name: transactionCategoryName,
            value: transactionCategoryId
        }));
    };

    const getFormValidator = () => {
        const formData: CreateTransactionBody = {
            transactionName: name!,
            walletId: walletOption?.value!,
            categoryId: categoryOption?.value!,
            transactionTimestamp: creationDate?.unix()!,
            transactionAmount: value!,
            isIncome
        };

        return new Validator(formData, createTransactionBodyRules);
    };

    const createTransaction = async () => {
        const formValidator = getFormValidator();
        if (formValidator.fails()) return;
        
        setIsCreatingTransaction(true);
        const isNewTransactionCreated = await TransactionsService.getInstance().createTransaction(
            formValidator.input as any // The form data aren't undefined due to the passed validation
        );

        if (isNewTransactionCreated) {
            close();
            return;
        }

        setIsCreatingTransaction(false);
    };

    const createWallet = async (newWalletName: string) => {
        setIsCreatingNewWallet(true);
        await TransactionsService.getInstance().createWallet({
            walletName: newWalletName,
            currencyCode: selectedNewWalletCurrency!.value
        });
        setIsCreatingNewWallet(false);
    };

    const createTransactionCategory = async (
        nameOfTransactionCategoryToCreate: string
    ) => {
        setIsCreatingTransactionCategory(true);
        await TransactionsService.getInstance().createTransactionCategory({
            transactionCategoryName: nameOfTransactionCategoryToCreate
        });
        setIsCreatingTransactionCategory(false);
    };

    const getCreateTransactionCategoryButtonText = (
        nameOfTransactionCategoryToCreate: string
    ) => {
        return `Create "${nameOfTransactionCategoryToCreate}" wallet`;
    };

    useEffect(() => {
        TransactionsService.getInstance().wallets$.subscribe(setWallets);
        TransactionsService.getInstance().currencies$.subscribe((currencies) => {
            setCurrencies(currencies);

            if (currencies.length == 0) {
                return;
            }

            // Set default currency option
            const { currencyCode, currencySymbol } = currencies[0];
            currencySelect.current?.setSelectedOption({
                name: `${currencySymbol} ${currencyCode}`,
                value: currencyCode
            });
        });
        TransactionsService.getInstance().transactionCategories$.subscribe(setTransactionCategories);

        TransactionsService.getInstance().getWallets();
        TransactionsService.getInstance().getCurrencies();
        TransactionsService.getInstance().getTransactionCategories();
    }, []);

    return (
        <Dialog title="Transaction creation">
            <div className="transaction-creation-dialog__content">
                {/* Name */}
                <InputTextField
                    title="Name"
                    validatorAttributeName="name"
                    validatorRule={createTransactionBodyRules.transactionName}
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
                    validatorRule={createTransactionBodyRules.walletId}
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
                    options={getTransactionCategoryOptions()}
                    createNewOption={createTransactionCategory}
                    isCreatingNewOption={isCreatingTransactionCategory}
                    getCreateNewOptionButtonText={getCreateTransactionCategoryButtonText}
                    validatorRule={createTransactionBodyRules.categoryId}
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
                    min={0}
                    validatorAttributeName="value"
                    validatorRule={createTransactionBodyRules.transactionAmount}
                    onInput={(value) => setValue(Number.parseFloat(value))} />
                {/* It's income */}
                <Checkbox
                    className="transaction-creation-dialog__content__is-income"
                    text="It's income"
                    checked={isIncome}
                    setChecked={setIsIncome} />
            </div>
            <div className="transaction-creation-dialog__footer">
                <TextButton
                    text="Exit"
                    size="large"
                    clickEvent={() => close()} />
                <NormalButton
                    className="transaction-creation-dialog__footer__confirmation-button"
                    Icon={MdAdd}
                    text="Create"
                    isLoading={isCreatingTransaction}
                    event={createTransaction}
                    disabled={!getFormValidator().passes() || isCreatingTransaction} />
            </div>
        </Dialog>
    );
};

export default TransactionCreationDialog;
