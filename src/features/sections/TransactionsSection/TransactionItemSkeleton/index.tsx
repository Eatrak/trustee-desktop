import "./style.css";
import TextSkeleton from "@shared/components/TextSkeleton";

const TransactionItemSkeleton = () => {
    return (
        <div className="transaction-item-skeleton">
            <div className="transaction-item-skeleton--text-container">
                <TextSkeleton
                    className="transaction-item-skeleton--text-container__transaction-name"
                    width="30%"
                    size="regular-paragraph"
                />
                <TextSkeleton
                    className="transaction-item-skeleton--text-container__transaction-date"
                    width="100px"
                    size="small-paragraph"
                />
            </div>
            <TextSkeleton width="100px" size="regular-paragraph" />
        </div>
    );
};

export default TransactionItemSkeleton;
