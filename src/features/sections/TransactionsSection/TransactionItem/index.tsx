import RoundedTextIconButton from "@components/RoundedTextIconButton";
import { MdDeleteOutline } from "react-icons/md";
import "./style.css";

import { Transaction } from '@ts-types/models/transactions';
import dayjs from "dayjs";

interface IProps {
    transaction: Transaction,
    onDeleteButtonClicked: Function,
    onClick: Function
}

const TransactionItem = ({ transaction, onDeleteButtonClicked, onClick }: IProps) => {
    const getAmountDirectionSymbol = () => {
        return transaction.isIncome ? "+" : "-";
    };

    const getTransactionItemClasses = () => {
        return `transaction-item ${transaction.isIncome ? "transaction-item--is-income" : ""}`;
    };

    return (
        <div className={getTransactionItemClasses()} onClick={() => onClick()}>
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
            <RoundedTextIconButton
                Icon={MdDeleteOutline}
                danger
                clickEvent={() => onDeleteButtonClicked()} />
        </div>
    );
};

export default TransactionItem;