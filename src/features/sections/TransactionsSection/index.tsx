import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import dayjs, { Dayjs } from "dayjs";

import { Currency, Transaction, Wallet } from "@shared/schema";
import TransactionsService from "@shared/services/transactions";
import TextButton from "@shared/components/TextButton";
import { OnRangeDatePickerRangeChangedEvent } from "@shared/components/RangeDatePicker";
import MultiSelect, { MultiSelectOption } from "@shared/components/MultiSelect";
import Statistic from "@shared/components/Statistic";
import TransactionItem from "./TransactionItem";
import TransactionsHeader from "./TransactionsHeader";
import TransactionDialog from "./TransactionDialog";
import TransactionItemSkeleton from "./TransactionItemSkeleton";
import ConfirmationDialog from "@shared/components/ConfirmationDialog";

const TransactionsSection = () => {
    let [transactions, changeTransactions] = useState<Transaction[]>([]);
    let [totalIncome, setTotalIncome] = useState<number>(0);
    let [totalExpense, setTotalExpense] = useState<number>(0);
    let [wallets, changeWallets] = useState<Wallet[]>([]);
    let [cursor, changeCursor] = useState<DocumentClientTypes.Key | undefined>();
    let [isLoadingTransactions, changeTransactionsLoading] = useState<boolean>(false);
    let [isCreatingNewWallet, setIsCreatingNewWallet] = useState<boolean>(false);
    let [isDeletingTransaction, setIsDeletingTransaction] = useState<boolean>(false);
    let [isTransactionCreationDialogOpened, setIsTransactionCreationDialogOpened] =
        useState<boolean>(false);
    let [isTransactionDeletionDialogOpened, setIsTransactionDeletionDialogOpened] =
        useState(false);
    let [isTransactionUpdateDialogOpened, setIsTransactionUpdateDialogOpened] =
        useState(false);
    let [currencies, setCurrencies] = useState<Currency[]>([]);
    let [selectedCurrency, setSelectedCurrency] = useState<string>("");
    let openedTransaction = useRef<Transaction>();
    let idOfTransactionToDelete = useRef<string | null>(null);

    let [selectedWallets, setSelectedWallets] = useState<MultiSelectOption[]>([]);

    const firstDayOfTheCurrentMonthTimestamp = dayjs().startOf("month");
    const lastDayOfTheCurrentMonthTimestamp = dayjs(
        dayjs().endOf("month").format("YYYY-MM-DD"),
    );

    const walletsMultiSelectRef = useRef<React.ElementRef<typeof MultiSelect>>(null);

    const getSelectedCurrencySymbol = (): string => {
        const currencySymbol = currencies.find(
            ({ id }) => id == selectedCurrency,
        )?.symbol;

        return currencySymbol ? currencySymbol : "";
    };

    useEffect(() => {
        TransactionsService.getInstance().transactions$.subscribe((transactions) => {
            changeTransactions(transactions);
        });
        TransactionsService.getInstance().totalIncome$.subscribe((totalIncome) => {
            setTotalIncome(totalIncome);
        });
        TransactionsService.getInstance().totalExpense$.subscribe((totalExpense) => {
            setTotalExpense(totalExpense);
        });
        TransactionsService.getInstance().wallets$.subscribe((wallets) => {
            changeWallets(wallets);
        });
        TransactionsService.getInstance().currencies$.subscribe((currencies) => {
            setCurrencies(currencies);

            if (currencies.length == 0) {
                return;
            }

            // Set default currency option
            const { id } = currencies[0];
            changeCurrencyCodeInstantly(id);
        });
    }, []);

    let getTransactionsByCreationRange = async (startDate: Dayjs, endDate: Dayjs) => {
        changeTransactionsLoading(true);
        // Get transactions by both selected currency and creation range
        await TransactionsService.getInstance().getTransactionsByCurrencyAndCreationRange(
            selectedCurrency,
            startDate,
            endDate,
        );
        changeTransactionsLoading(false);
    };

    const changeTimeRangeOfTransactionsToShow = async ({
        startDate,
        endDate,
    }: OnRangeDatePickerRangeChangedEvent) => {
        if (!selectedCurrency) return;
        await getTransactionsByCreationRange(startDate, endDate);
    };

    const createWallet = async (newWalletName: string) => {
        setIsCreatingNewWallet(true);
        await TransactionsService.getInstance().createWallet({
            name: newWalletName,
            currencyId: selectedCurrency,
        });
        setIsCreatingNewWallet(false);
    };

    const openTransactionDeletionDialog = (transactionId: string) => {
        setIsTransactionDeletionDialogOpened(true);
        idOfTransactionToDelete.current = transactionId;
    };

    const deleteTransaction = async () => {
        setIsDeletingTransaction(true);

        try {
            if (!idOfTransactionToDelete.current) {
                // TODO: Give feedback to the user
                return;
            }

            const transactionHasBeenDeleted =
                await TransactionsService.getInstance().deleteTransaction(
                    idOfTransactionToDelete.current,
                );

            if (transactionHasBeenDeleted) {
                setIsTransactionDeletionDialogOpened(false);
            }
        } catch (err) {}

        setIsDeletingTransaction(false);
    };

    const openTransaction = (transactionToOpen: Transaction) => {
        openedTransaction.current = transactionToOpen;
        setIsTransactionUpdateDialogOpened(true);
    };

    const getTransactionItemsToRender = () => {
        const transactionItemsToRender = transactions
            .filter((transaction) => {
                for (const selectedWallet of selectedWallets) {
                    if (transaction.walletId == selectedWallet.value) {
                        return true;
                    }
                }

                return false;
            })
            .map((transaction) => {
                return (
                    <TransactionItem
                        key={transaction.id}
                        onClick={() => openTransaction(transaction)}
                        onDeleteButtonClicked={() =>
                            openTransactionDeletionDialog(transaction.id)
                        }
                        transaction={transaction}
                    />
                );
            });

        if (isLoadingTransactions) {
            return Array.from(Array(4).keys()).map((index) => {
                return <TransactionItemSkeleton key={index} />;
            });
        }

        return transactionItemsToRender;
    };

    const changeCurrencyCodeInstantly = (newSelectedCurrency: string) => {
        // Make sure the new selected currency-code is available instantly
        selectedCurrency = newSelectedCurrency;
        // Re-render by setting the new state
        setSelectedCurrency(newSelectedCurrency);
    };

    const getWalletOptions = () => {
        return TransactionsService.getInstance().getOptionsOfWalletsWithSelectedCurrency(
            wallets,
            selectedCurrency,
        );
    };

    useEffect(() => {
        if (!selectedCurrency) return;

        // Select all wallets with the selected currency
        walletsMultiSelectRef.current?.setSelectedOptions(
            TransactionsService.getInstance().getOptionsOfWalletsWithSelectedCurrency(
                wallets,
                selectedCurrency,
            ),
        );

        getTransactionsByCreationRange(
            firstDayOfTheCurrentMonthTimestamp,
            lastDayOfTheCurrentMonthTimestamp,
        );
    }, [selectedCurrency]);

    return (
        <div className="section transactions-section">
            {
                // Transaction deletion dialog
                isTransactionDeletionDialogOpened && (
                    <ConfirmationDialog
                        title="Transaction deletion"
                        description={<p>Are you sure to delete the transaction?</p>}
                        isConfirming={isDeletingTransaction}
                        confirm={() => deleteTransaction()}
                        close={() => setIsTransactionDeletionDialogOpened(false)}
                    />
                )
            }
            {isTransactionCreationDialogOpened && (
                <TransactionDialog
                    isCreationMode
                    currencyId={selectedCurrency}
                    close={() => setIsTransactionCreationDialogOpened(false)}
                />
            )}
            {isTransactionUpdateDialogOpened && (
                <TransactionDialog
                    isCreationMode={false}
                    openedTransaction={openedTransaction.current}
                    currencyId={selectedCurrency}
                    close={() => setIsTransactionUpdateDialogOpened(false)}
                />
            )}
            <div className="transactions-section--main">
                <TransactionsHeader
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrencyCode={changeCurrencyCodeInstantly}
                    initialStartDate={firstDayOfTheCurrentMonthTimestamp}
                    initialEndDate={lastDayOfTheCurrentMonthTimestamp}
                    openTransactionCreationDialog={() =>
                        setIsTransactionCreationDialogOpened(true)
                    }
                    onDatePickerRangeChanged={changeTimeRangeOfTransactionsToShow}
                />
                <MultiSelect
                    ref={walletsMultiSelectRef}
                    className="transactions-section--main__wallets-multi-select"
                    text="Wallets"
                    createNewOption={createWallet}
                    isCreatingNewOption={isCreatingNewWallet}
                    getCreateNewOptionButtonText={(filterValue) =>
                        `Create "${filterValue}" wallet`
                    }
                    filterInputPlaceholder="Search or create a wallet by typing a name"
                    options={getWalletOptions()}
                    onSelect={(newSelectedWallets) =>
                        setSelectedWallets([...newSelectedWallets])
                    }
                />
                <div className="transactions-section--main__statistic-container">
                    <div className="transactions-section--main__statistic-container__left">
                        <Statistic
                            title="Total Income"
                            value={`${getSelectedCurrencySymbol()} ${totalIncome}`}
                        />
                        <Statistic
                            title="Total Expense"
                            value={`${getSelectedCurrencySymbol()} ${totalExpense}`}
                        />
                    </div>
                    <div className="transactions-section--main__statistic-container__right">
                        <Statistic
                            title="Total Balance"
                            value={`
                                ${getSelectedCurrencySymbol()} 
                                ${totalIncome - totalExpense}`}
                            size="large"
                        />
                    </div>
                </div>
                <div className="transactions-section--main--container">
                    <div>{getTransactionItemsToRender()}</div>
                </div>
                {cursor && (
                    <TextButton
                        Icon={MdAdd}
                        text="Load more"
                        isLoading={isLoadingTransactions}
                    />
                )}
            </div>
            <div className="transactions-section--details"></div>
        </div>
    );
};

export default TransactionsSection;
