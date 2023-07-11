import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";
import dayjs, { Dayjs } from "dayjs";

import "./style.css";
import Dialog from "@components/Dialog";
import InputTextField from "@components/InputTextField";
import TransactionsService from "@services/transactions";
import NormalButton from "@components/NormalButton";
import TextButton from "@components/TextButton";
import Select, { SelectOption } from "@components/Select";
import DatePicker from "@components/DatePicker";
import Checkbox from "@components/Checkbox";
import { createTransactionBodyRules } from "@validatorRules/transactions";
import { Transaction, TransactionCategory, Wallet } from "@ts-types/models/transactions";
import { CreateTransactionBody } from "@ts-types/APIs/input/transactions/createTransaction";

interface IProps {
    close: Function,
    currencyCode: string,
    isCreationMode: boolean,
    openedTransaction?: Transaction
}

const TransactionDialog = ({ close, currencyCode, isCreationMode, openedTransaction }: IProps) => {
    if (!isCreationMode && !openedTransaction) {
        throw new Error("The transaction dialog in update mode must receive a transaction to open");
    }

    let [ wallets, setWallets ] = useState<Wallet[]>([]);
    let [ transactionCategories, setTransactionCategories ] = useState<TransactionCategory[]>([]);
    let [ isDatePickerOpened, setIsDatePickerOpened ] = useState<boolean>(false);
    let [ isCreatingNewWallet, setIsCreatingNewWallet ] = useState<boolean>(false);
    let [ isCreatingTransactionCategory, setIsCreatingTransactionCategory ] = useState<boolean>(false);
    let [ isCreatingTransaction, setIsCreatingTransaction ] = useState<boolean>(false);

    // Form data
    let [ name, setName ] = useState<string>(
        isCreationMode ? "" : openedTransaction!.transactionName
    );
    let [ walletOption, setWalletOption ] = useState<SelectOption | null>(null);
    let [ categoryOption, setCategoryOption ] = useState<SelectOption | null>(null);
    let [ creationDate, setCreationDate ] = useState<Dayjs>(
        isCreationMode ? dayjs() : dayjs.unix(openedTransaction!.transactionTimestamp)
    );
    let [ value, setValue ] = useState<number>(
        isCreationMode ? 0 : openedTransaction!.transactionAmount
    );
    let [ isIncome, setIsIncome ] = useState<boolean>(
        isCreationMode ? false : openedTransaction!.isIncome
    );

    const getWalletOptions = () => {
        return TransactionsService.getInstance().getOptionsOfWalletsWithSelectedCurrency(
            wallets,
            currencyCode
        );
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

    const updateTransaction = async () => {};

    const createWallet = async (newWalletName: string) => {
        setIsCreatingNewWallet(true);
        await TransactionsService.getInstance().createWallet({
            walletName: newWalletName,
            currencyCode
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
        TransactionsService.getInstance().wallets$.subscribe(wallets => {
            setWallets(wallets);

            // When in update mode, set the wallet of the opened transaction as selected wallet
            if (!isCreationMode) {
                const openedTransactionWallet = wallets.find(wallet => wallet.walletId == openedTransaction!.walletId);
                if (openedTransactionWallet) {
                    setWalletOption({
                        name: openedTransactionWallet.walletName,
                        value: openedTransactionWallet.walletId
                    });
                }
                else {
                    // Show to the user that the wallet of the transaction doesn't exist
                    setWalletOption({
                        name: "Unexisting wallet",
                        value: ""
                    });
                }
            }
        });
        TransactionsService.getInstance().transactionCategories$.subscribe(transactionCategories => {
            setTransactionCategories(transactionCategories);

            // When in update mode, set the transaction-category of the
            // opened transaction as selected transaction-category
            if (!isCreationMode) {
                const categoryOfOpenedTransaction = transactionCategories.find(transactionCategory => {
                    return transactionCategory.transactionCategoryId == openedTransaction!.categoryId;
                });
                if (categoryOfOpenedTransaction) {
                    setCategoryOption({
                        name: categoryOfOpenedTransaction.transactionCategoryName,
                        value: categoryOfOpenedTransaction.transactionCategoryId
                    });
                }
                else {
                    // Show to the user that the wallet of the transaction doesn't exist
                    setWalletOption({
                        name: "Unexisting category",
                        value: ""
                    });
                }
            }
        });

        TransactionsService.getInstance().getTransactionCategories();
    }, []);

    return (
        <Dialog
            title={isCreationMode ? "Transaction creation" : `"${openedTransaction!.transactionName}" transaction` }
            content={
                <div className="transaction-creation-dialog__content">
                    {/* Name */}
                    <InputTextField
                        title="Name"
                        value={name}
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
                        selectedOption={walletOption}
                        onSelect={setWalletOption} />
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
                        selectedOption={categoryOption}
                        onSelect={setCategoryOption} />
                    {/* Creation date */}
                    <DatePicker
                        isOpened={isDatePickerOpened}
                        setOpened={setIsDatePickerOpened}
                        validatorAttributeName="creation date"
                        validatorRule="required"
                        selectedDate={creationDate}
                        onDateChanged={setCreationDate} />
                    {/* Value */}
                    <InputTextField
                        title="Value"
                        type="number"
                        min={0}
                        validatorAttributeName="value"
                        validatorRule={createTransactionBodyRules.transactionAmount}
                        value={value}
                        onInput={(value) => setValue(Number.parseFloat(value))} />
                    {/* It's income */}
                    <Checkbox
                        className="transaction-creation-dialog__content__is-income"
                        text="It's income"
                        checked={isIncome}
                        setChecked={setIsIncome} />
                </div>
            }
            footer={
                <div className="transaction-creation-dialog__footer">
                    <TextButton
                        text="Exit"
                        size="large"
                        clickEvent={() => close()} />
                    <NormalButton
                        className="transaction-creation-dialog__footer__confirmation-button"
                        Icon={isCreationMode ? MdAdd : undefined}
                        text={isCreationMode ? "Create" : "Update"}
                        isLoading={isCreatingTransaction}
                        event={() => isCreationMode ? createTransaction() : updateTransaction()}
                        disabled={!getFormValidator().passes() || isCreatingTransaction} />
                </div>
            }
        />
    );
};

export default TransactionDialog;
