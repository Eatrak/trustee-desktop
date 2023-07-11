import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import dayjs, { Dayjs } from "dayjs";

import { Currency, Transaction, Wallet } from "@ts-types/models/transactions";
import TransactionsService from "@services/transactions";
import TextButton from "@components/TextButton";
import { OnRangeDatePickerRangeChangedEvent } from "@components/RangeDatePicker";
import MultiSelect, { MultiSelectOption } from "@components/MultiSelect";
import Statistic from "@components/Statistic";
import { TotalExpenseByCurrency, TotalIncomeByCurrency } from "@ts-types/generic/currencies";
import TransactionItem from "./TransactionItem";
import TransactionsHeader from "./TransactionsHeader";
import MiniSelect, { SelectOption } from "@components/MiniSelect";
import TransactionDialog from "./TransactionDialog";
import TransactionItemSkeleton from "./TransactionItemSkeleton";
import ConfirmationDialog from "@components/ConfirmationDialog";

const TransactionsSection = () => {
    let currencySelect = useRef<React.ElementRef<typeof MiniSelect>>(null);
    let [ transactions, changeTransactions ] = useState<Transaction[]>([]);
    let [ wallets, changeWallets ] = useState<Wallet[]>([]);
    let [ cursor, changeCursor ] = useState<DocumentClientTypes.Key | undefined>();
    let [ isLoadingTransactions, changeTransactionsLoading ] = useState<boolean>(false);
    let [ isCreatingNewWallet, setIsCreatingNewWallet ] = useState<boolean>(false);
    let [ isDeletingTransaction, setIsDeletingTransaction ] = useState<boolean>(false);
    let [ isTransactionCreationDialogOpened, setIsTransactionCreationDialogOpened ] = useState<boolean>(false);
    let [ isTransactionDeletionDialogOpened, setIsTransactionDeletionDialogOpened ] = useState(false);
    let [ isTransactionUpdateDialogOpened, setIsTransactionUpdateDialogOpened ] = useState(false);
    let [ currencies, setCurrencies ] = useState<Currency[]>([]);
    let [ totalIncomeByCurrency, setTotalIncomeByCurrency ] = useState<TotalIncomeByCurrency>({});
    let [ totalExpenseByCurrency, setTotalExpenseByCurrency ] = useState<TotalExpenseByCurrency>({});
    let [ selectedCurrencyCode, setSelectedCurrencyCode ] = useState<string>("");
    let openedTransaction = useRef<Transaction>();
    let idOfTransactionToDelete = useRef<string | null>(null);

    let [selectedWallets, setSelectedWallets] = useState<MultiSelectOption[]>([]);

    const firstDayOfTheCurrentMonthTimestamp = dayjs().startOf("month");
    const lastDayOfTheCurrentMonthTimestamp = dayjs(dayjs().endOf("month").format("YYYY-MM-DD"));

    const walletsMultiSelectRef = useRef<React.ElementRef<typeof MultiSelect>>(null);

    const getCurrencyOptions = (): SelectOption[] => {
        return currencies.map(({ currencyCode, currencySymbol }) => ({
            name: `${currencySymbol} ${currencyCode}`,
            value: currencyCode
        }));
    };

    const getSelectedCurrencySymbol = (): string => {
        const currencySymbol = currencies.find(({ currencyCode }) => (
            currencyCode == selectedCurrencyCode
        ))?.currencySymbol;

        return currencySymbol ? currencySymbol : "";
    };

    useEffect(() => {
        TransactionsService.getInstance().transactions$.subscribe(transactions => {
            changeTransactions(transactions);
        });
        TransactionsService.getInstance().totalIncomeByCurrency$.subscribe(totalIncomeByCurrency => {
            setTotalIncomeByCurrency(totalIncomeByCurrency);
        });
        TransactionsService.getInstance().totalExpenseByCurrency$.subscribe(totalExpenseByCurrency => {
            setTotalExpenseByCurrency(totalExpenseByCurrency);
            console.log(totalExpenseByCurrency);
        });
        TransactionsService.getInstance().wallets$.subscribe(wallets => {
            changeWallets(wallets);
        });
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
        
        getTransactionsByCreationRange(firstDayOfTheCurrentMonthTimestamp, lastDayOfTheCurrentMonthTimestamp);
    }, []);

    let getTransactionsByCreationRange = async (startDate: Dayjs, endDate: Dayjs) => {
        changeTransactionsLoading(true);
        // Get transactions by both selected currency and creation range
        const newCursor = await TransactionsService.getInstance().getTransactionsByCurrencyAndCreationRange(
            selectedCurrencyCode,
            startDate,
            endDate
        );
        changeTransactionsLoading(false);
        changeCursor(newCursor);
    };

    let getNextTransactions = async () => {
        if (cursor) {
            const newCursor = await TransactionsService.getInstance().getNextTransactionsByCreationRange(cursor);
            changeCursor(newCursor);
        }
    };

    const changeTimeRangeOfTransactionsToShow = async ({ startDate, endDate }: OnRangeDatePickerRangeChangedEvent) => {
        await getTransactionsByCreationRange(startDate, endDate);
    };

    const createWallet = async (newWalletName: string) => {
        setIsCreatingNewWallet(true);
        await TransactionsService.getInstance().createWallet({
            walletName: newWalletName,
            currencyCode: selectedCurrencyCode
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
            const transactionToDelete = TransactionsService
                .getInstance()
                .transactions$.getValue()
                .find(transaction => {
                    console.log(transaction.transactionId, idOfTransactionToDelete.current);
                    return transaction.transactionId == idOfTransactionToDelete.current
                });

            if (!transactionToDelete) {
                // TODO: Give feedback to the user
                return;
            }

            const {
                walletId,
                transactionId,
                transactionTimestamp,
                transactionAmount,
                isIncome
            } = transactionToDelete;

            const transactionHasBeenDeleted = await TransactionsService
                .getInstance()
                .deleteTransaction(
                    walletId,
                    selectedCurrencyCode,
                    transactionId,
                    transactionTimestamp.toString(),
                    -transactionAmount,
                    isIncome
                );

            if (transactionHasBeenDeleted) {
                setIsTransactionDeletionDialogOpened(false);
            }
        }
        catch (err) {}

        setIsDeletingTransaction(false);
    };

    const openTransaction = (transactionToOpen: Transaction) => {
        openedTransaction.current = transactionToOpen;
        setIsTransactionUpdateDialogOpened(true);
    };

    const getTransactionItemsToRender = () => {
        const transactionItemsToRender = transactions
        .filter(transaction => {
            for (const selectedWallet of selectedWallets) {
                if (transaction.walletId == selectedWallet.value) {
                    return true;
                }
            }

            return false;
        })
        .map(transaction => {
            return (
                <TransactionItem
                    key={transaction.transactionId}
                    onClick={() => openTransaction(transaction)}
                    onDeleteButtonClicked={() => openTransactionDeletionDialog(transaction.transactionId)}
                    transaction={transaction}/>
            );
        });

        if (isLoadingTransactions) {
            return Array.from(Array(4).keys()).map(index => {
                return <TransactionItemSkeleton key={index} />;
            });
        }

        return transactionItemsToRender;
    };

    const changeCurrencyCodeInstantly = (newSelectedCurrencyCode: string) => {
        // Make sure the new selected currency-code is available instantly
        selectedCurrencyCode = newSelectedCurrencyCode;
        // Re-render by setting the new state
        setSelectedCurrencyCode(newSelectedCurrencyCode);
    };

    const getWalletOptions = () => {
        return TransactionsService.getInstance().getOptionsOfWalletsWithSelectedCurrency(
            wallets,
            selectedCurrencyCode
        );
    };

    useEffect(() => {
        // Select all wallets with the selected currency
        walletsMultiSelectRef.current?.setSelectedOptions(
            TransactionsService.getInstance().getOptionsOfWalletsWithSelectedCurrency(
                wallets,
                selectedCurrencyCode
            )
        );
        
        getTransactionsByCreationRange(
            firstDayOfTheCurrentMonthTimestamp,
            lastDayOfTheCurrentMonthTimestamp
        );
    }, [selectedCurrencyCode]);

    return(
        <div className="section transactions-section">
            {
                // Transaction deletion dialog
                isTransactionDeletionDialogOpened &&
                <ConfirmationDialog
                    title="Transaction deletion"
                    description={<p>Are you sure to delete the transaction?</p>}
                    isConfirming={isDeletingTransaction}
                    confirm={() => deleteTransaction()}
                    close={() => setIsTransactionDeletionDialogOpened(false)}
                />
            }
            {
                isTransactionCreationDialogOpened &&
                <TransactionDialog
                    isCreationMode
                    currencyCode={selectedCurrencyCode}
                    close={() => setIsTransactionCreationDialogOpened(false)} />
            }
            {
                isTransactionUpdateDialogOpened &&
                <TransactionDialog
                    isCreationMode={false}
                    openedTransaction={openedTransaction.current}
                    currencyCode={selectedCurrencyCode}
                    close={() => setIsTransactionUpdateDialogOpened(false)} />
            }
            <div className="transactions-section--main">
                <TransactionsHeader
                    setSelectedCurrencyCode={changeCurrencyCodeInstantly}
                    initialStartDate={firstDayOfTheCurrentMonthTimestamp}
                    initialEndDate={lastDayOfTheCurrentMonthTimestamp}
                    openTransactionCreationDialog={() => setIsTransactionCreationDialogOpened(true)}
                    onDatePickerRangeChanged={changeTimeRangeOfTransactionsToShow}/>
                <MultiSelect
                    ref={walletsMultiSelectRef}
                    className="transactions-section--main__wallets-multi-select"
                    text="Wallets"
                    createNewOption={createWallet}
                    isCreatingNewOption={isCreatingNewWallet}
                    getCreateNewOptionButtonText={(filterValue) => `Create "${filterValue}" wallet`}
                    filterInputPlaceholder="Search or create a wallet by typing a name"
                    options={getWalletOptions()}
                    onSelect={(newSelectedWallets) => setSelectedWallets([ ...newSelectedWallets ])} 
                />
                <div className="transactions-section--main__statistic-container">
                    <div className="transactions-section--main__statistic-container__left">
                        <Statistic
                            title="Total Income"
                            value={`${getSelectedCurrencySymbol()} ${totalIncomeByCurrency[selectedCurrencyCode] || 0}`} />
                        <Statistic
                            title="Total Expense"
                            value={`${getSelectedCurrencySymbol()} ${totalExpenseByCurrency[selectedCurrencyCode] || 0}`} />
                    </div>
                    <div className="transactions-section--main__statistic-container__right">
                        <Statistic
                            title="Total Balance"
                            value={`
                                ${getSelectedCurrencySymbol()} 
                                ${
                                    totalIncomeByCurrency[selectedCurrencyCode] -
                                    totalExpenseByCurrency[selectedCurrencyCode]
                                    || 0
                                }`
                            }
                            size="large" />
                    </div>
                </div>
                <div className="transactions-section--main--container">
                    <div>
                        {
                            getTransactionItemsToRender()
                        }
                    </div>
                </div>
                {cursor && <TextButton Icon={MdAdd} text="Load more" clickEvent={getNextTransactions} isLoading={isLoadingTransactions}/>}
            </div>
            <div className="transactions-section--details"></div>
        </div>
    );
};

export default TransactionsSection;