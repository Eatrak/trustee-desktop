import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";
import dayjs, { Dayjs } from "dayjs";

import "./style.css";
import Dialog from "@shared/components/Dialog";
import InputTextField from "@shared/components/InputTextField";
import TransactionsService from "@shared/services/transactions";
import NormalButton from "@shared/components/NormalButton";
import TextButton from "@shared/components/TextButton";
import Select, { SelectOption } from "@shared/components/Select";
import DatePicker from "@shared/components/DatePicker";
import Checkbox from "@shared/components/Checkbox";
import { createTransactionBodyRules } from "@shared/validatorRules/transactions";
import { Transaction, TransactionCategory, Wallet } from "@shared/schema";
import { CreateTransactionBody } from "@shared/ts-types/APIs/input/transactions/createTransaction";
import MultiSelect, {
    MultiSelectOptionProprieties,
} from "@shared/components/MultiSelect";

interface IProps {
    close: Function;
    isCreationMode: boolean;
    selectedCurrencyId: string;
    openedTransaction?: Transaction;
    onSuccess?: (createdTransaction: Transaction) => any;
    wallets: Wallet[];
}

const TransactionDialog = ({
    close,
    isCreationMode,
    openedTransaction,
    onSuccess,
    wallets,
}: IProps) => {
    if (!isCreationMode && !openedTransaction) {
        throw new Error(
            "The transaction dialog in update mode must receive a transaction to open",
        );
    }

    let [transactionCategories, setTransactionCategories] = useState<
        TransactionCategory[]
    >([]);
    let [isDatePickerOpened, setIsDatePickerOpened] = useState<boolean>(false);
    let [isCreatingTransactionCategory, setIsCreatingTransactionCategory] =
        useState<boolean>(false);
    let [isSubmittingTransaction, setIsSubmittingTransaction] = useState<boolean>(false);

    // Form data
    let [name, setName] = useState<string>(isCreationMode ? "" : openedTransaction!.name);
    let [walletOption, setWalletOption] = useState<SelectOption | null>(null);
    let [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
    let [creationDate, setCreationDate] = useState<Dayjs>(
        isCreationMode ? dayjs() : dayjs.unix(openedTransaction!.carriedOut),
    );
    let [value, setValue] = useState<number>(
        isCreationMode ? 0 : openedTransaction!.amount,
    );
    let [isIncome, setIsIncome] = useState<boolean>(
        isCreationMode ? false : openedTransaction!.isIncome,
    );

    const getWalletOptions = (): MultiSelectOptionProprieties[] => {
        return wallets.map((wallet) => ({ name: wallet.name, value: wallet.id }));
    };

    const getTransactionCategoryOptions = (): SelectOption[] => {
        return transactionCategories.map(({ id, name }) => ({
            name: name,
            value: id,
        }));
    };

    const getFormValidator = () => {
        const formData: CreateTransactionBody = {
            name,
            walletId: walletOption?.value!,
            categories: categoryOptions?.map((categoryOption) => categoryOption.value),
            carriedOut: creationDate?.unix()!,
            amount: value!,
            isIncome,
        };

        return new Validator(formData, createTransactionBodyRules);
    };

    const createTransaction = async () => {
        const formValidator = getFormValidator();
        if (formValidator.fails()) return;

        setIsSubmittingTransaction(true);
        const createdTransaction =
            await TransactionsService.getInstance().createTransaction(
                formValidator.input as any, // The form data aren't undefined due to the passed validation
            );

        if (createdTransaction) {
            onSuccess && onSuccess(createdTransaction);
            close();
            return;
        }

        setIsSubmittingTransaction(false);
    };

    const createTransactionCategory = async (
        nameOfTransactionCategoryToCreate: string,
    ) => {
        setIsCreatingTransactionCategory(true);
        await TransactionsService.getInstance().createTransactionCategory({
            name: nameOfTransactionCategoryToCreate,
        });
        setIsCreatingTransactionCategory(false);
    };

    const getCreateTransactionCategoryButtonText = (
        nameOfTransactionCategoryToCreate: string,
    ) => {
        return `Create "${nameOfTransactionCategoryToCreate}" wallet`;
    };

    const initTransactionCategories = async () => {
        const transactionCategories =
            await TransactionsService.getInstance().getTransactionCategories();

        if (!transactionCategories) return;

        setTransactionCategories(transactionCategories);
    };

    useEffect(() => {
        initWallets(wallets);
        initTransactionCategories();
    }, []);

    const initWallets = (wallets: Wallet[]) => {
        // When in update mode, set the wallet of the opened transaction as selected wallet
        if (!isCreationMode) {
            const openedTransactionWallet = wallets.find(
                (wallet) => wallet.id == openedTransaction!.walletId,
            );
            if (openedTransactionWallet) {
                setWalletOption({
                    name: openedTransactionWallet.name,
                    value: openedTransactionWallet.id,
                });
            } else {
                // Show to the user that the wallet of the transaction doesn't exist
                setWalletOption({
                    name: "Unexisting wallet",
                    value: "",
                });
            }
        }
    };

    return (
        <Dialog
            title={
                isCreationMode
                    ? "Transaction creation"
                    : `"${openedTransaction!.name}" transaction`
            }
            content={
                <div className="transaction-creation-dialog__content">
                    {/* Name */}
                    <InputTextField
                        title="Name"
                        value={name}
                        validatorAttributeName="name"
                        validatorRule={createTransactionBodyRules.name}
                        onInput={setName}
                    />
                    {/* Wallet */}
                    <Select
                        entityName="wallet"
                        text="Wallet"
                        filterInputPlaceholder="Search by typing a name"
                        options={getWalletOptions()}
                        validatorRule={createTransactionBodyRules.walletId}
                        selectedOption={walletOption}
                        onSelect={setWalletOption}
                    />
                    {/* Category */}
                    <MultiSelect
                        text="Category"
                        filterInputPlaceholder="Search or create by typing a name"
                        createNewOption={createTransactionCategory}
                        isCreatingNewOption={isCreatingTransactionCategory}
                        getCreateNewOptionButtonText={
                            getCreateTransactionCategoryButtonText
                        }
                        onSelect={setCategoryOptions}
                        creationValidatorRule="required|string"
                        optionsValidatorRule={"required|array"}
                        options={getTransactionCategoryOptions()}
                        entityName="categories"
                    />
                    {/* Creation date */}
                    <DatePicker
                        isOpened={isDatePickerOpened}
                        setOpened={setIsDatePickerOpened}
                        validatorAttributeName="creation date"
                        validatorRule="required"
                        selectedDate={creationDate}
                        onDateChanged={setCreationDate}
                    />
                    {/* Value */}
                    <InputTextField
                        title="Value"
                        type="number"
                        min={0}
                        validatorAttributeName="value"
                        validatorRule={createTransactionBodyRules.amount}
                        value={value}
                        onInput={(value) => setValue(Number.parseFloat(value))}
                    />
                    {/* It's income */}
                    <Checkbox
                        className="transaction-creation-dialog__content__is-income"
                        text="It's income"
                        checked={isIncome}
                        setChecked={setIsIncome}
                    />
                </div>
            }
            footer={
                <div className="transaction-creation-dialog__footer">
                    <TextButton text="Exit" size="large" clickEvent={() => close()} />
                    <NormalButton
                        className="transaction-creation-dialog__footer__confirmation-button"
                        Icon={isCreationMode ? MdAdd : undefined}
                        text={isCreationMode ? "Create" : "Update"}
                        isLoading={isSubmittingTransaction}
                        event={() => isCreationMode && createTransaction()}
                        disabled={!getFormValidator().passes() || isSubmittingTransaction}
                    />
                </div>
            }
        />
    );
};

export default TransactionDialog;
