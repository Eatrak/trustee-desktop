import "./style.css";

import { useState } from "react";
import { MdAdd, MdOutlineAccountBalanceWallet, MdRefresh } from "react-icons/md";

import RoundedTextIconButton from "@components/RoundedTextIconButton";
import RoundedIconButton from "@components/RoundedIconButton";
import MultiSelect from "@components/MultiSelect";

const TransactionsHeader = () => {
    let [ selectedOptions, setSelectedOptions ] = useState([]);

    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold">Monthly transactions</h5>
                <p className="paragraph--sub-title">Current month</p>
            </div>
            <div className="app-layout__header__actions-container">
                <MultiSelect selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions}
                    options={[{name: "All", value: "*"}]} Icon={MdOutlineAccountBalanceWallet} text="Wallets"/>
                <RoundedTextIconButton Icon={MdRefresh}/>
                <RoundedIconButton Icon={MdAdd}/>
            </div>
        </div>
    );
};

export default TransactionsHeader;