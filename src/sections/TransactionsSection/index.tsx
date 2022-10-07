import "./style.css";

import TransactionsHeader from "./TransactionsHeader";

const TransactionsSection = () => {
    return(
        <div className="section transactions-section">
            <div className="transactions-section--main">
                <TransactionsHeader/>
                <div className="transactions-section--main--container"></div>
            </div>
            <div className="transactions-section--details"></div>
        </div>
    );
};

export default TransactionsSection;