import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import dayjs, { Dayjs } from "dayjs";
import { Subscription } from "rxjs";

import { Currency, Transaction, TransactionCategory, Wallet } from "@shared/schema";
import TransactionsService from "@shared/services/transactions";
import TextButton from "@shared/components/TextButton";
import { OnRangeDatePickerRangeChangedEvent } from "@shared/components/RangeDatePicker";
import MultiSelect, {
    MultiSelectOptionProprieties,
} from "@shared/components/MultiSelect";
import Statistic from "@shared/components/Statistic/Statistic";
import TransactionItem from "./TransactionItem";
import TransactionsHeader from "./TransactionsHeader";
import TransactionDialog from "./TransactionDialog";
import TransactionItemSkeleton from "./TransactionItemSkeleton";
import TransactionsTable from "./TransactionsTable";
import ConfirmationDialog from "@shared/components/ConfirmationDialog";
import StatisticSkeleton from "@shared/components/Statistic/StatisticSkeleton";
import { createWalletInputRules } from "@shared/validatorRules/wallets";
import { Utils } from "@shared/services/utils";

const TransactionsSection = () => {
    let [transactions, setTransactions] = useState<Transaction[]>([]);
    let [transactionCategories, setTransactionCategories] = useState<
        TransactionCategory[]
    >([]);
    let [totalIncome, setTotalIncome] = useState<number>(0);
    let [totalExpense, setTotalExpense] = useState<number>(0);
    let [wallets, changeWallets] = useState<Wallet[]>([]);
    let [cursor, changeCursor] = useState<DocumentClientTypes.Key | undefined>();
    let [isLoadingTransactions, changeTransactionsLoading] = useState<boolean>(false);
    let [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
    let [isCreatingNewWallet, setIsCreatingNewWallet] = useState<boolean>(false);
    let [isDeletingTransaction, setIsDeletingTransaction] = useState<boolean>(false);
    let [isDeletingWallet, setIsDeletingWallet] = useState<boolean>(false);
    let [isTransactionCreationDialogOpened, setIsTransactionCreationDialogOpened] =
        useState<boolean>(false);
    let [isWalletDeletionDialogOpened, setIsWalletDeletionDialogOpened] = useState(false);
    let [isTransactionDeletionDialogOpened, setIsTransactionDeletionDialogOpened] =
        useState(false);
    let [isTransactionUpdateDialogOpened, setIsTransactionUpdateDialogOpened] =
        useState(false);
    let [currencies, setCurrencies] = useState<Currency[]>([]);
    let [selectedCurrency, setSelectedCurrency] = useState<string>("");

    const firstDayOfTheCurrentMonthTimestamp = dayjs().startOf("month");
    const lastDayOfTheCurrentMonthTimestamp = dayjs(
        dayjs().endOf("month").format("YYYY-MM-DD"),
    );

    // Current start and end carried out from the date picker
    let [startCarriedOut, setStartCarriedOut] = useState<Dayjs | null>(
        firstDayOfTheCurrentMonthTimestamp,
    );
    let [endCarriedOut, setEndCarriedOut] = useState<Dayjs | null>(
        lastDayOfTheCurrentMonthTimestamp,
    );

    // Last start and end carried out used to get transactions
    let [lastStartCarriedOut, setLastStartCarriedOut] = useState<Dayjs>(
        firstDayOfTheCurrentMonthTimestamp,
    );
    let [lastEndCarriedOut, setLastEndCarriedOut] = useState<Dayjs>(
        lastDayOfTheCurrentMonthTimestamp,
    );

    let openedTransaction = useRef<Transaction>();
    let idOfTransactionToDelete = useRef<string | null>(null);
    let idOfWalletToDelete = useRef<string | null>(null);

    let [selectedWallets, setSelectedWallets] = useState<MultiSelectOptionProprieties[]>(
        [],
    );

    const walletsMultiSelectRef = useRef<React.ElementRef<typeof MultiSelect>>(null);

    // Subscriptions
    let walletsSubscription: Subscription | null = null;
    let currenciesSubscription: Subscription | null = null;
    let transactionCategoriesSubscription: Subscription | null = null;

    const getSelectedCurrencySymbol = (): string => {
        const currencySymbol = currencies.find(
            ({ id }) => id == selectedCurrency,
        )?.symbol;

        return currencySymbol ? currencySymbol : "";
    };

    const getSelectedCurrencyCode = (): string | null => {
        const currencyCode = currencies.find(({ id }) => id == selectedCurrency)?.code;

        return currencyCode || null;
    };

    const getTransactionCategoryNameById = (id: string) => {
        return transactionCategories.find(
            (transactionCategory) => transactionCategory.id == id,
        )?.name;
    };

    useEffect(() => {
        walletsSubscription = TransactionsService.getInstance().wallets$.subscribe(
            (wallets) => {
                changeWallets(wallets);

                // Select all wallets by default
                walletsMultiSelectRef.current?.setSelectedOptions(
                    getWalletOptions(wallets),
                );
            },
        );
        currenciesSubscription = TransactionsService.getInstance().currencies$.subscribe(
            (currencies) => {
                setCurrencies(currencies);

                if (currencies.length == 0) {
                    return;
                }

                // Set default currency option
                const { id } = currencies[0];
                changeCurrencyCodeInstantly(id);
            },
        );
        transactionCategoriesSubscription =
            TransactionsService.getInstance().transactionCategories$.subscribe(
                (transactionCategories) => {
                    setTransactionCategories(transactionCategories);
                },
            );
    }, []);

    let getTransactionsByCreationRange = async (startDate: Dayjs, endDate: Dayjs) => {
        changeTransactionsLoading(true);
        setIsBalanceLoading(true);
        const [transactions, balance] = await Promise.all([
            // Get transactions by both selected currency and creation range
            TransactionsService.getInstance().getTransactionsByCurrencyAndCreationRange(
                selectedCurrency,
                startDate,
                endDate,
            ),
            // Get balance of transactions to get
            TransactionsService.getInstance().getBalance(
                selectedCurrency,
                startDate,
                endDate,
            ),
        ]);

        // Update transactions
        transactions && setTransactions(transactions);

        // Update total balance
        balance && setTotalIncome(balance.totalIncome);
        balance && setTotalExpense(balance.totalExpense);

        changeTransactionsLoading(false);
        setIsBalanceLoading(false);
    };

    const changeTimeRangeOfTransactionsToShow = async ({
        startDate,
        endDate,
    }: OnRangeDatePickerRangeChangedEvent) => {
        if (!selectedCurrency || !startDate || !endDate) return;
        setLastStartCarriedOut(startDate);
        setLastEndCarriedOut(endDate);
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

    const openWalletDeletionDialog = (walletId: string) => {
        setIsWalletDeletionDialogOpened(true);
        idOfWalletToDelete.current = walletId;
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
                // Update transactions
                getTransactionsByCreationRange(lastStartCarriedOut, lastEndCarriedOut);

                setIsTransactionDeletionDialogOpened(false);
            }
        } catch (err) {}

        setIsDeletingTransaction(false);
    };

    const openTransaction = (transactionToOpen: Transaction) => {
        openedTransaction.current = transactionToOpen;
        setIsTransactionUpdateDialogOpened(true);
    };

    const getFormattedAmount = (amount: number) => {
        const selectedCurrencyCode = getSelectedCurrencyCode();
        if (!selectedCurrencyCode) return "-";

        return Utils.getInstance().getFormattedAmount(selectedCurrencyCode, amount);
    };

    const getTransactionsToShow = () => {
        return transactions.filter((transaction) => {
            for (const selectedWallet of selectedWallets) {
                if (transaction.walletId == selectedWallet.value) {
                    return true;
                }
            }

            return false;
        });
    };

    const getTransactionsTableData = () => {
        const selectedCurrencyCode = getSelectedCurrencyCode();

        return selectedCurrencyCode
            ? getTransactionsToShow().map(
                  ({ id, name, amount, isIncome, categoryId, carriedOut }) => ({
                      id,
                      name,
                      amount,
                      isIncome,
                      category: categoryId
                          ? getTransactionCategoryNameById(categoryId) || "unknown"
                          : "",
                      currencyCode: selectedCurrencyCode,
                      creationDate: dayjs.unix(carriedOut),
                  }),
              )
            : [];
    };

    const changeCurrencyCodeInstantly = (newSelectedCurrency: string) => {
        // Make sure the new selected currency-code is available instantly
        selectedCurrency = newSelectedCurrency;
        // Re-render by setting the new state
        setSelectedCurrency(newSelectedCurrency);
    };

    const getWalletOptions = (wallets: Wallet[]): MultiSelectOptionProprieties[] => {
        return wallets.map((wallet) => ({ name: wallet.name, value: wallet.id }));
    };

    const reloadTransactions = async () => {
        await getTransactionsByCreationRange(lastStartCarriedOut, lastEndCarriedOut);
    };

    const deleteWallet = async () => {
        setIsDeletingWallet(true);

        try {
            if (!idOfWalletToDelete.current) {
                // TODO: Give feedback to the user
                return;
            }

            const hasWalletBeenDeleted =
                await TransactionsService.getInstance().deleteWallet(
                    idOfWalletToDelete.current,
                );

            if (hasWalletBeenDeleted) {
                await reloadTransactions();

                // Close deletion dialog
                setIsWalletDeletionDialogOpened(false);
            }
        } catch (err) {}

        setIsDeletingWallet(false);
    };

    const updateWallet = async (updatedWallet: MultiSelectOptionProprieties) => {
        await TransactionsService.getInstance().updateWallet(updatedWallet.value, {
            name: updatedWallet.name,
        });
    };

    useEffect(() => {
        if (!selectedCurrency) return;

        reloadTransactions();
    }, [selectedCurrency]);

    useEffect(
        () => () => {
            walletsSubscription?.unsubscribe();
            currenciesSubscription?.unsubscribe();
        },
        [],
    );

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
            {
                // Wallet deletion dialog
                isWalletDeletionDialogOpened && (
                    <ConfirmationDialog
                        title="Wallet deletion"
                        description={<p>Are you sure to delete the wallet?</p>}
                        isConfirming={isDeletingWallet}
                        confirm={() => deleteWallet()}
                        close={() => setIsWalletDeletionDialogOpened(false)}
                    />
                )
            }
            {isTransactionCreationDialogOpened && (
                <TransactionDialog
                    isCreationMode
                    selectedCurrencyId={selectedCurrency}
                    onSuccess={() => {
                        reloadTransactions();
                    }}
                    close={() => setIsTransactionCreationDialogOpened(false)}
                />
            )}
            {isTransactionUpdateDialogOpened && (
                <TransactionDialog
                    isCreationMode={false}
                    selectedCurrencyId={selectedCurrency}
                    onSuccess={reloadTransactions}
                    openedTransaction={openedTransaction.current}
                    close={() => setIsTransactionUpdateDialogOpened(false)}
                />
            )}
            <div className="transactions-section--main">
                <TransactionsHeader
                    reloadTransactions={reloadTransactions}
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrencyCode={changeCurrencyCodeInstantly}
                    lastStartDate={lastStartCarriedOut}
                    lastEndDate={lastEndCarriedOut}
                    startDate={startCarriedOut}
                    endDate={endCarriedOut}
                    setStartDate={setStartCarriedOut}
                    setEndDate={setEndCarriedOut}
                    openTransactionCreationDialog={() =>
                        setIsTransactionCreationDialogOpened(true)
                    }
                    onDatePickerRangeChanged={changeTimeRangeOfTransactionsToShow}
                />
                <MultiSelect
                    ref={walletsMultiSelectRef}
                    className="transactions-section--main__wallets-multi-select"
                    text="Wallets"
                    updateOption={updateWallet}
                    deleteOption={(walletOption) =>
                        openWalletDeletionDialog(walletOption.value)
                    }
                    createNewOption={createWallet}
                    isCreatingNewOption={isCreatingNewWallet}
                    getCreateNewOptionButtonText={(filterValue) =>
                        `Create "${filterValue}" wallet`
                    }
                    filterInputPlaceholder="Search or create a wallet by typing a name"
                    options={getWalletOptions(wallets)}
                    onSelect={(newSelectedWallets) =>
                        setSelectedWallets([...newSelectedWallets])
                    }
                    optionsValidatorRule={createWalletInputRules.name}
                    creationErrorMessage="For creating a wallet:"
                />
                <div className="card transactions-section--main__statistic-container">
                    <div className="transactions-section--main__statistic-container__left">
                        {isBalanceLoading ? (
                            <StatisticSkeleton title="Total income" width="180px" />
                        ) : (
                            <Statistic
                                className="transactions-section--main__total-income"
                                title="Total income"
                                value={getFormattedAmount(totalIncome)}
                            />
                        )}
                        {isBalanceLoading ? (
                            <StatisticSkeleton title="Total expense" width="180px" />
                        ) : (
                            <Statistic
                                className="transactions-section--main__total-expense"
                                title="Total expense"
                                value={getFormattedAmount(totalExpense)}
                            />
                        )}
                    </div>
                    <div className="transactions-section--main__statistic-container__right">
                        {isBalanceLoading ? (
                            <StatisticSkeleton
                                title="Total balance"
                                width="180px"
                                size="large"
                            />
                        ) : (
                            <Statistic
                                className="transactions-section--main__total-balance"
                                title="Total balance"
                                value={getFormattedAmount(totalIncome - totalExpense)}
                                size="large"
                            />
                        )}
                    </div>
                </div>
                <TransactionsTable
                    className="transactions-section__main__container__transactions-table"
                    data={getTransactionsTableData()}
                />
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
