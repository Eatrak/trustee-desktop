import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import dayjs, { Dayjs } from "dayjs";
import { Subscription } from "rxjs";

import { Currency, Transaction, Wallet } from "@shared/schema";
import TransactionsService from "@shared/services/transactions";
import TextButton from "@shared/components/TextButton";
import { OnRangeDatePickerRangeChangedEvent } from "@shared/components/RangeDatePicker";
import MultiSelect, {
    MultiSelectOptionProprieties,
} from "@shared/components/MultiSelect";
import Statistic from "@shared/components/Statistic/Statistic";
import TransactionsHeader from "./TransactionsHeader";
import TransactionDialog from "./TransactionDialog";
import TransactionsTable, { TransactionsTableItem } from "./TransactionsTable";
import ConfirmationDialog from "@shared/components/ConfirmationDialog";
import StatisticSkeleton from "@shared/components/Statistic/StatisticSkeleton";
import { Utils } from "@shared/services/utils";
import AuthService from "@shared/services/auth";
import DetailsPieChart from "@features/sections/TransactionsSection/DetailsPieChart";
import { TransactionCategoryBalance } from "@shared/ts-types/DTOs/transactions";

const TransactionsSection = () => {
    let [transactions, setTransactions] = useState<Transaction[]>([]);
    let [transactionCategories, setTransactionCategories] = useState<
        TransactionCategoryBalance[]
    >([]);
    let [totalIncome, setTotalIncome] = useState<number>(0);
    let [totalExpense, setTotalExpense] = useState<number>(0);
    let [wallets, changeWallets] = useState<Wallet[]>([]);
    let [cursor, changeCursor] = useState<DocumentClientTypes.Key | undefined>();
    let [isLoadingTransactions, changeTransactionsLoading] = useState<boolean>(false);
    let [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
    let [isCreatingNewWallet, setIsCreatingNewWallet] = useState<boolean>(false);
    let [isDeletingTransaction, setIsDeletingTransaction] = useState<boolean>(false);
    let [isTransactionCreationDialogOpened, setIsTransactionCreationDialogOpened] =
        useState<boolean>(false);
    let [isTransactionDeletionDialogOpened, setIsTransactionDeletionDialogOpened] =
        useState(false);
    let [isTransactionUpdateDialogOpened, setIsTransactionUpdateDialogOpened] =
        useState(false);
    let [currencies, setCurrencies] = useState<Currency[]>([]);
    let [selectedCurrency, setSelectedCurrency] = useState<Currency>(
        AuthService.getInstance().personalInfo$.getValue().settings.currency,
    );

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

    let [selectedWallets, setSelectedWallets] = useState<MultiSelectOptionProprieties[]>(
        [],
    );

    const walletsMultiSelectRef = useRef<React.ElementRef<typeof MultiSelect>>(null);

    // Subscriptions
    let walletsSubscription: Subscription | null = null;
    let personalInfoSubscription: Subscription | null = null;

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

        personalInfoSubscription = AuthService.getInstance().personalInfo$.subscribe(
            ({ settings }) => {
                setSelectedCurrency(settings.currency);
            },
        );
    }, []);

    async function fetchTransactionCategories() {
        console.log("Called");
        const response =
            await TransactionsService.getInstance().getTransactionCategoryBalances(
                {
                    startDate: lastStartCarriedOut.unix(),
                    endDate: lastEndCarriedOut.unix(),
                },
                { wallets: wallets.map((wallet) => wallet.id) },
            );

        if (response.ok) {
            setTransactionCategories(response.val);
            return;
        }

        // TODO: handle error and use try catch
    }

    let getTransactionsByCreationRange = async (startDate: Dayjs, endDate: Dayjs) => {
        await fetchTransactionCategories();

        changeTransactionsLoading(true);
        setIsBalanceLoading(true);
        const [transactions, balance] = await Promise.all([
            // Get transactions by both selected currency and creation range
            TransactionsService.getInstance().getTransactionsByCurrencyAndCreationRange(
                selectedCurrency.id,
                startDate,
                endDate,
            ),
            // Get balance of transactions to get
            TransactionsService.getInstance().getBalance(
                selectedCurrency.id,
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

    const openTransactionDeletionDialog = (
        transactionsTableItem: TransactionsTableItem,
    ) => {
        setIsTransactionDeletionDialogOpened(true);
        idOfTransactionToDelete.current = transactionsTableItem.id;
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
        return Utils.getInstance().getFormattedAmount(selectedCurrency.code, amount);
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

    const getTransactionsTableData = (): TransactionsTableItem[] => {
        return getTransactionsToShow().map(
            ({ id, name, amount, isIncome, categoryId, carriedOut }) => ({
                id,
                name,
                amount,
                isIncome,
                category: categoryId
                    ? getTransactionCategoryNameById(categoryId) || "unknown"
                    : "",
                currencyCode: selectedCurrency.code,
                creationDate: dayjs.unix(carriedOut),
                onDeleteButtonClicked: openTransactionDeletionDialog,
            }),
        );
    };

    const getWalletOptions = (wallets: Wallet[]): MultiSelectOptionProprieties[] => {
        return wallets.map((wallet) => ({ name: wallet.name, value: wallet.id }));
    };

    const reloadTransactions = async () => {
        await getTransactionsByCreationRange(lastStartCarriedOut, lastEndCarriedOut);
    };

    const updateWallet = async (updatedWallet: MultiSelectOptionProprieties) => {
        await TransactionsService.getInstance().updateWallet(updatedWallet.value, {
            name: updatedWallet.name,
        });
    };

    const getChartTransactionCategoriesIncome = () => {
        return transactionCategories
            .filter(({ income }) => income > 0)
            .map(({ name, income }) => ({
                name,
                value: income,
            }));
    };

    const getChartTransactionCategoriesExpense = () => {
        return transactionCategories
            .filter(({ expense }) => expense > 0)
            .map(({ name, expense }) => ({
                name,
                value: expense,
            }));
    };

    useEffect(() => {
        if (!selectedCurrency) return;

        reloadTransactions();
    }, [selectedCurrency]);

    useEffect(() => {
        fetchTransactionCategories();
    }, [wallets]);

    useEffect(
        () => () => {
            walletsSubscription?.unsubscribe();
            personalInfoSubscription?.unsubscribe();
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
            {isTransactionCreationDialogOpened && (
                <TransactionDialog
                    isCreationMode
                    selectedCurrencyId={selectedCurrency.id}
                    onSuccess={() => {
                        reloadTransactions();
                    }}
                    close={() => setIsTransactionCreationDialogOpened(false)}
                />
            )}
            {isTransactionUpdateDialogOpened && (
                <TransactionDialog
                    isCreationMode={false}
                    selectedCurrencyId={selectedCurrency.id}
                    onSuccess={reloadTransactions}
                    openedTransaction={openedTransaction.current}
                    close={() => setIsTransactionUpdateDialogOpened(false)}
                />
            )}
            <div className="transactions-section--main">
                <TransactionsHeader
                    reloadTransactions={reloadTransactions}
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
                    filterInputPlaceholder="Search a wallet by typing a name"
                    options={getWalletOptions(wallets)}
                    onSelect={(newSelectedWallets) =>
                        setSelectedWallets([...newSelectedWallets])
                    }
                />
                <div className="card transactions-section--main__statistic-container">
                    <div className="transactions-section--main__statistic-container__left">
                        {isBalanceLoading ? (
                            <StatisticSkeleton title="Income" width="180px" />
                        ) : (
                            <Statistic
                                className="transactions-section--main__total-income"
                                title="Income"
                                value={getFormattedAmount(totalIncome)}
                            />
                        )}
                        {isBalanceLoading ? (
                            <StatisticSkeleton title="Expense" width="180px" />
                        ) : (
                            <Statistic
                                className="transactions-section--main__total-expense"
                                title="Expense"
                                value={getFormattedAmount(totalExpense)}
                            />
                        )}
                    </div>
                    <div className="transactions-section--main__statistic-container__right">
                        {isBalanceLoading ? (
                            <StatisticSkeleton title="Net" width="180px" size="large" />
                        ) : (
                            <Statistic
                                className="transactions-section--main__total-balance"
                                title="Net"
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
            <div className="transactions-section--details">
                <DetailsPieChart
                    className="transactions-section--details__transaction-categories-statistic"
                    title="Categories income"
                    currencySymbol={selectedCurrency.symbol}
                    data={getChartTransactionCategoriesIncome()}
                />
                <DetailsPieChart
                    className="transactions-section--details__transaction-categories-statistic"
                    title="Categories expense"
                    currencySymbol={selectedCurrency.symbol}
                    data={getChartTransactionCategoriesExpense()}
                />
            </div>
        </div>
    );
};

export default TransactionsSection;
