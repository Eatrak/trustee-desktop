import "./style.css";

import { Transaction } from '@models/transactions';
import dayjs from "dayjs";

interface IProps {
    transaction: Transaction
}

const TransactionItem = ({ transaction }: IProps) => {
    const getAmountDirectionSymbol = () => {
        return transaction.isIncome ? "+" : "-";
    };

    const getTransactionItemClasses = () => {
        return `transaction-item ${transaction.isIncome ? "transaction-item--is-income" : ""}`;
    };

    return (
        <div className={getTransactionItemClasses()}>
            <div className="transaction-item--text-container">
                <p className="paragraph--regular paragraph--bold transaction-item--text-container__transaction-name">
                    {transaction.transactionName}
                </p>
                <p className="paragraph--small transaction-item--text-container__transaction-date">
                    {dayjs.unix(transaction.transactionTimestamp).format("MM-DD-YYYY")}
                </p>
            </div>
            <p className="paragraph--regular transaction-item__amount">
                {getAmountDirectionSymbol()} {transaction.transactionAmount}€
            </p>
        </div>
    );
};

export default TransactionItem;