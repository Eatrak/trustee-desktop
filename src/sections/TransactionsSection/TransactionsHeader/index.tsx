import "./style.css";

import { MdAdd, MdRefresh } from "react-icons/md";

import RoundedTextIconButton from "@components/RoundedTextIconButton";
import RoundedIconButton from "@components/RoundedIconButton";

const TransactionsHeader = () => {
    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold">Monthly transactions</h5>
                <p className="paragraph--sub-title">Current month</p>
            </div>
            <div className="app-layout__header__actions-container">
                <RoundedTextIconButton Icon={MdRefresh}/>
                <RoundedIconButton Icon={MdAdd}/>
            </div>
        </div>
    );
};

export default TransactionsHeader;