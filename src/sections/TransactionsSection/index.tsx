import "./style.css";

import { useEffect, useState } from "react";

import { Transaction } from "@models/transactions";
import TransactionsService from "@services/transactions";
import TransactionItem from "./TransactionItem";
import TransactionsHeader from "./TransactionsHeader";

const TransactionsSection = () => {
    let [ transactions, changeTransactions ] = useState<Transaction[]>([]);

    useEffect(() => {
        TransactionsService.getInstance().transactions$.subscribe(transactions => {
            changeTransactions(transactions);
        });
        TransactionsService.getInstance().getTransactionsByCreationRange();
    }, []);

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
            </div>
            <div className="transactions-section--details"></div>
        </div>
    );
};

export default TransactionsSection;