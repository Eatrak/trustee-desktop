import "./style.css";

import { useEffect, useState } from "react";
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

    let [selectedWallets, changeSelectedWallets] = useState<MultiSelectOption[]>([]);

    const firstDayOfTheCurrentMonthTimestamp = dayjs().startOf("month");
    const lastDayOfTheCurrentMonthTimestamp = dayjs().endOf("month");

    useEffect(() => {
        TransactionsService.getInstance().transactions$.subscribe(transactions => {
            changeTransactions(transactions);
        });
        TransactionsService.getInstance().wallets$.subscribe(wallets => {
            changeWallets(wallets);
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

    return(
        <div className="section transactions-section">
            <div className="transactions-section--main">
                <TransactionsHeader
                    initialStartDate={firstDayOfTheCurrentMonthTimestamp}
                    initialEndDate={lastDayOfTheCurrentMonthTimestamp}
                    onDatePickerRangeChanged={changeTimeRangeOfTransactionsToShow}/>
                <MultiSelect
                    className="transactions-section--main__wallets-multi-select"
                    text="Wallets"
                    filterInputPlaceholder="Search or create a wallet by typing a name"
                    options={wallets.map(wallet => ({ name: wallet.walletName, value: wallet.walletId }))}
                    selectedOptions={selectedWallets}
                    setSelectedOptions={changeSelectedWallets}/>
                <div className="transactions-section--main--container">
                    {transactions.map(transaction => {
                        return (
                            <TransactionItem
                                key={transaction.transactionId}
                                transaction={transaction}/>
                        );
                    })}
                </div>
                {cursor && <TextButton Icon={MdAdd} clickEvent={getNextTransactions} isLoading={isLoadingTransactions}/>}
            </div>
            <div className="transactions-section--details"></div>
        </div>
    );
};

export default TransactionsSection;