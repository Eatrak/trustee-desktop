import "./style.css";

import { useState } from "react";
import { MdAdd, MdDateRange, MdRefresh } from "react-icons/md";

import RoundedTextIconButton from "@components/RoundedTextIconButton";
import RoundedIconButton from "@components/RoundedIconButton";
import DatePicker from "@components/DatePicker";

const TransactionsHeader = () => {
    let [isDatePickerOpened, changeIsDatePickerOpened] = useState<boolean>(false);

    const openDatePicker = () => {
        changeIsDatePickerOpened(true);
    };

    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold">Monthly transactions</h5>
                <p className="paragraph--sub-title">Current month</p>
            </div>
            <div className="app-layout__header__actions-container">
                <RoundedTextIconButton Icon={MdRefresh}/>
                <RoundedTextIconButton
                    Icon={MdDateRange}
                    clickEvent={openDatePicker}/>
                <DatePicker
                    setOpened={changeIsDatePickerOpened}
                    style={{
                        left: "50%",
                        top: "50px",
                        transform: "translate(-50%)",
                        display: isDatePickerOpened ? "unset": "none"
                    }}/>
                <RoundedIconButton Icon={MdAdd}/>
            </div>
        </div>
    );
};

export default TransactionsHeader;