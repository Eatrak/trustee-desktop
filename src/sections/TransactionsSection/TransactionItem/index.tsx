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

    return (
        <div className="transaction-item">
            <div className="transaction-item--text-container">
                <p className="paragraph--regular paragraph--bold">
                    {transaction.transactionName}
                </p>
                <p className="paragraph--small">
                    {dayjs.unix(Number.parseInt(transaction.transactionTimestamp)).format("MM-DD-YYYY")}
                </p>
            </div>
            <p className="paragraph--regular">
                {getAmountDirectionSymbol()} {transaction.transactionAmount}€
            </p>
        </div>
    );
};

export default TransactionItem;