import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import dayjs, { Dayjs } from "dayjs";

import { Transaction, Wallet } from "@models/transactions";
import TransactionsService from "@services/transactions";
import TextButton from "@components/TextButton";
import { OnDatePickerRangeChangedEvent } from "@components/DatePicker";
import MultiSelect, { MultiSelectOption } from "@components/MultiSelect";
import TransactionItem from "./TransactionItem";
import TransactionsHeader from "./TransactionsHeader";

const TransactionsSection = () => {
    let [ transactions, changeTransactions ] = useState<Transaction[]>([]);
    let [ wallets, changeWallets ] = useState<Wallet[]>([]);
    let [ cursor, changeCursor ] = useState<DocumentClientTypes.Key | undefined>();
    let [ isLoadingTransactions, changeTransactionsLoading ] = useState<boolean>(false);
    let [ isCreatingNewWallet, setIsCreatingNewWallet ] = useState<boolean>(false);

    let [selectedWallets, setSelectedWallets] = useState<MultiSelectOption[]>([]);

    const firstDayOfTheCurrentMonthTimestamp = dayjs().startOf("month");
    const lastDayOfTheCurrentMonthTimestamp = dayjs().endOf("month");

    const walletsMultiSelectRef = useRef<React.ElementRef<typeof MultiSelect>>(null);

    useEffect(() => {
        TransactionsService.getInstance().transactions$.subscribe(transactions => {
            changeTransactions(transactions);
        });
        TransactionsService.getInstance().wallets$.subscribe(wallets => {
            changeWallets(wallets);
            
            const defaultSelectedWallets: MultiSelectOption[] = wallets.map(wallet => ({
                name: wallet.walletName,
                value: wallet.walletId
            }));
            walletsMultiSelectRef.current?.setSelectedOptions(defaultSelectedWallets);
        });
        
        getTransactionsByCreationRange(firstDayOfTheCurrentMonthTimestamp, lastDayOfTheCurrentMonthTimestamp);
        TransactionsService.getInstance().getWallets();
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

    const changeTimeRangeOfTransactionsToShow = async ({ startDate, endDate }: OnDatePickerRangeChangedEvent) => {
        await getTransactionsByCreationRange(startDate, endDate);
    };

    const createWallet = async (newWalletName: string) => {
        setIsCreatingNewWallet(true);
        await TransactionsService.getInstance().createWallet({
            walletName: newWalletName
        });
        setIsCreatingNewWallet(false);
    };

    return(
        <div className="section transactions-section">
            <div className="transactions-section--main">
                <TransactionsHeader
                    initialStartDate={firstDayOfTheCurrentMonthTimestamp}
                    initialEndDate={lastDayOfTheCurrentMonthTimestamp}
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
                    onSelect={(newSelectedWallets) => setSelectedWallets([ ...newSelectedWallets ])} />
                <div className="transactions-section--main--container">
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
                {cursor && <TextButton Icon={MdAdd} text="Load more" clickEvent={getNextTransactions} isLoading={isLoadingTransactions}/>}
            </div>
            <div className="transactions-section--details"></div>
        </div>
    );
};

export default TransactionsSection;