import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";
import dayjs, { Dayjs } from "dayjs";
import { Subscription } from "rxjs";

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
import { Currency, Transaction, TransactionCategory, Wallet } from "@shared/schema";
import { CreateTransactionBody } from "@shared/ts-types/APIs/input/transactions/createTransaction";
import { MultiSelectOptionProprieties } from "@shared/components/MultiSelect";

interface IProps {
    close: Function;
    isCreationMode: boolean;
    selectedCurrencyId: string;
    openedTransaction?: Transaction;
    onSuccess?: (createdTransaction: Transaction) => any;
}

const TransactionDialog = ({
    close,
    isCreationMode,
    selectedCurrencyId,
    openedTransaction,
    onSuccess,
}: IProps) => {
    if (!isCreationMode && !openedTransaction) {
        throw new Error(
            "The transaction dialog in update mode must receive a transaction to open",
        );
    }

    // Subscriptions
    let walletsSubscription: Subscription | null = null;
    let transactionCategoriesSubscription: Subscription | null = null;

    let [wallets, setWallets] = useState<Wallet[]>([]);
    let [transactionCategories, setTransactionCategories] = useState<
        TransactionCategory[]
    >([]);
    let [isDatePickerOpened, setIsDatePickerOpened] = useState<boolean>(false);
    let [isCreatingNewWallet, setIsCreatingNewWallet] = useState<boolean>(false);
    let [isCreatingTransactionCategory, setIsCreatingTransactionCategory] =
        useState<boolean>(false);
    let [isSubmittingTransaction, setIsSubmittingTransaction] = useState<boolean>(false);

    // Form data
    let [name, setName] = useState<string>(isCreationMode ? "" : openedTransaction!.name);
    let [walletOption, setWalletOption] = useState<SelectOption | null>(null);
    let [categoryOption, setCategoryOption] = useState<SelectOption | null>(null);
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
            categoryId: categoryOption?.value!,
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

    const createWallet = async (newWalletName: string) => {
        setIsCreatingNewWallet(true);
        await TransactionsService.getInstance().createWallet({
            name: newWalletName,
            currencyId: selectedCurrencyId,
        });
        setIsCreatingNewWallet(false);
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

    useEffect(() => {
        walletsSubscription = TransactionsService.getInstance().wallets$.subscribe(
            (wallets) => {
                setWallets(wallets);

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
            },
        );
        transactionCategoriesSubscription =
            TransactionsService.getInstance().transactionCategories$.subscribe(
                (transactionCategories) => {
                    setTransactionCategories(transactionCategories);

                    // When in update mode, set the transaction-category of the
                    // opened transaction as selected transaction-category
                    if (!isCreationMode) {
                        const categoryOfOpenedTransaction = transactionCategories.find(
                            (transactionCategory) => {
                                return (
                                    transactionCategory.id ==
                                    openedTransaction!.categoryId
                                );
                            },
                        );
                        if (categoryOfOpenedTransaction) {
                            setCategoryOption({
                                name: categoryOfOpenedTransaction.name,
                                value: categoryOfOpenedTransaction.id,
                            });
                        } else {
                            // Show to the user that the wallet of the transaction doesn't exist
                            setWalletOption({
                                name: "",
                                value: "",
                            });
                        }
                    }
                },
            );

        TransactionsService.getInstance().getTransactionCategories();
    }, []);

    useEffect(
        () => () => {
            walletsSubscription?.unsubscribe();
            transactionCategoriesSubscription?.unsubscribe();
        },
        [],
    );

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
                        filterInputPlaceholder="Search or create by typing a name"
                        options={getWalletOptions()}
                        createNewOption={createWallet}
                        isCreatingNewOption={isCreatingNewWallet}
                        getCreateNewOptionButtonText={(nameOfWalletToCreate) =>
                            `Create "${nameOfWalletToCreate}" wallet`
                        }
                        validatorRule={createTransactionBodyRules.walletId}
                        selectedOption={walletOption}
                        onSelect={setWalletOption}
                    />
                    {/* Category */}
                    <Select
                        entityName="category"
                        text="Category"
                        filterInputPlaceholder="Search or create by typing a name"
                        options={getTransactionCategoryOptions()}
                        createNewOption={createTransactionCategory}
                        isCreatingNewOption={isCreatingTransactionCategory}
                        getCreateNewOptionButtonText={
                            getCreateTransactionCategoryButtonText
                        }
                        validatorRule={createTransactionBodyRules.categoryId}
                        selectedOption={categoryOption}
                        onSelect={setCategoryOption}
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
