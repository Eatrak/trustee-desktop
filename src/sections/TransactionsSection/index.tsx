import "./style.css";

import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";

import { Transaction } from "@models/transactions";
import TransactionsService from "@services/transactions";
import TextButton from "@components/TextButton";
import TransactionItem from "./TransactionItem";
import TransactionsHeader from "./TransactionsHeader";

const TransactionsSection = () => {
    let [ transactions, changeTransactions ] = useState<Transaction[]>([]);
    let [ cursor, changeCursor ] = useState<DocumentClientTypes.Key | undefined>();
    let [ isLoadingTransactions, changeTransactionsLoading ] = useState<boolean>(false);

    useEffect(() => {
        TransactionsService.getInstance().transactions$.subscribe(transactions => {
            changeTransactions(transactions);
        });
        getTransactionsByCreationRange();
    }, []);

    let getTransactionsByCreationRange = async () => {
        const newCursor = await TransactionsService.getInstance().getTransactionsByCreationRange();
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

    return(
        <div className="section transactions-section">
            <div className="transactions-section--main">
                <TransactionsHeader/>
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