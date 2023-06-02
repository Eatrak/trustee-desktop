import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import dayjs, { Dayjs } from "dayjs";

import { Currency, Transaction, Wallet } from "@models/transactions";
import TransactionsService from "@services/transactions";
import TextButton from "@components/TextButton";
import { OnRangeDatePickerRangeChangedEvent } from "@components/RangeDatePicker";
import MultiSelect, { MultiSelectOption } from "@components/MultiSelect";
import Statistic from "@components/Statistic";
import { TotalIncomeByCurrency } from "@genericTypes/currencies";
import TransactionItem from "./TransactionItem";
import TransactionsHeader from "./TransactionsHeader";
import MiniSelect, { SelectOption } from "@components/MiniSelect";
import TransactionCreationDialog from "./TransactionCreationDialog";

const TransactionsSection = () => {
    let currencySelect = useRef<React.ElementRef<typeof MiniSelect>>(null);
    let [ transactions, changeTransactions ] = useState<Transaction[]>([]);
    let [ wallets, changeWallets ] = useState<Wallet[]>([]);
    let [ cursor, changeCursor ] = useState<DocumentClientTypes.Key | undefined>();
    let [ isLoadingTransactions, changeTransactionsLoading ] = useState<boolean>(false);
    let [ isCreatingNewWallet, setIsCreatingNewWallet ] = useState<boolean>(false);
    let [ isTransactionCreationDialogOpened, setIsTransactionCreationDialogOpened ] = useState<boolean>(false);
    let [ currencies, setCurrencies ] = useState<Currency[]>([]);
    let [ totalIncomeByCurrency, setTotalIncomeByCurrency ] = useState<TotalIncomeByCurrency>({});
    let [ selectedCurrencyCode, setSelectedCurrencyCode ] = useState<string>("");

    let [selectedWallets, setSelectedWallets] = useState<MultiSelectOption[]>([]);
    let [ selectedNewWalletCurrency, setSelectedNewWalletCurrency ] = useState<SelectOption>();

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
        TransactionsService.getInstance().wallets$.subscribe(wallets => {
            changeWallets(wallets);
            
            const defaultSelectedWallets: MultiSelectOption[] = wallets.map(wallet => ({
                name: wallet.walletName,
                value: wallet.walletId
            }));
            walletsMultiSelectRef.current?.setSelectedOptions(defaultSelectedWallets);
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
        TransactionsService.getInstance().getWallets();
        TransactionsService.getInstance().getCurrencies();
        TransactionsService.getInstance().getTotalIncomeByCurrency();
    }, []);

    let getTransactionsByCreationRange = async (startDate: Dayjs, endDate: Dayjs) => {
        const newCursor = await TransactionsService.getInstance().getTransactionsByCreationRange(
            startDate,
            endDate
        );
        changeCursor(newCursor);
    };

    let getNextTransactions = async () => {
        if (cursor) {
            changeTransactionsLoading(true);
            const newCursor = await TransactionsService.getInstance().getNextTransactionsByCreationRange(cursor);
            changeTransactionsLoading(false);
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
            currencyCode: selectedNewWalletCurrency!.value
        });
        setIsCreatingNewWallet(false);
    };

    return(
        <div className="section transactions-section">
            {
                isTransactionCreationDialogOpened &&
                <TransactionCreationDialog close={() => setIsTransactionCreationDialogOpened(false)} />
            }
            <div className="transactions-section--main">
                <TransactionsHeader
                    setSelectedCurrencyCode={setSelectedCurrencyCode}
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
                    options={wallets.map(wallet => ({ name: wallet.walletName, value: wallet.walletId }))}
                    onSelect={(newSelectedWallets) => setSelectedWallets([ ...newSelectedWallets ])} 
                >
                    <MiniSelect
                        ref={currencySelect}
                        className="currency-select"
                        options={getCurrencyOptions()}
                        entityName="currency"
                        onSelect={setSelectedNewWalletCurrency} />
                </MultiSelect>
                <div className="transactions-section--main__statistic-container">
                    <div className="transactions-section--main__statistic-container__left">
                        <Statistic
                            title="Total Income"
                            value={`${getSelectedCurrencySymbol()} ${totalIncomeByCurrency[selectedCurrencyCode] || 0}`} />
                    </div>
                    <div className="transactions-section--main__statistic-container__right">
                    </div>
                </div>
                <div className="transactions-section--main--container">
                    <div>
                        {
                            transactions
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
                                        transaction={transaction}/>
                                );
                            })
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