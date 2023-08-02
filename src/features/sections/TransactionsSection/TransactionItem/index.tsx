import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import { MdDeleteOutline } from "react-icons/md";
import "./style.css";

import { Transaction } from "@shared/schema";
import dayjs from "dayjs";

interface IProps {
    transaction: Transaction;
    currencySymbol: string;
    onDeleteButtonClicked: Function;
    onClick: Function;
}

const TransactionItem = ({
    transaction,
    onDeleteButtonClicked,
    onClick,
    currencySymbol,
}: IProps) => {
    const getAmountDirectionSymbol = () => {
        return transaction.isIncome ? "+" : "-";
    };

    const getTransactionItemClasses = () => {
        return `transaction-item ${
            transaction.isIncome ? "transaction-item--is-income" : ""
        }`;
    };

    return (
        <div className={getTransactionItemClasses()} onClick={() => onClick()}>
            <div className="transaction-item--text-container">
                <p className="paragraph--regular paragraph--bold transaction-item--text-container__transaction-name">
                    {transaction.name}
                </p>
                <p className="paragraph--small transaction-item--text-container__transaction-date">
                    {dayjs.unix(transaction.carriedOut).format("MM-DD-YYYY")}
                </p>
            </div>
            <p className="paragraph--regular transaction-item__amount">
                {getAmountDirectionSymbol()} {transaction.amount} {currencySymbol}
            </p>
            <RoundedTextIconButton
                Icon={MdDeleteOutline}
                state="danger"
                clickEvent={(e) => {
                    // Avoid to open the transaction item
                    e.stopPropagation();

                    onDeleteButtonClicked();
                }}
            />
        </div>
    );
};

export default TransactionItem;
