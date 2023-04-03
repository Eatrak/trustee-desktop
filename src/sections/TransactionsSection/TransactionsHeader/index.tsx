import "./style.css";

import { useState } from "react";
import { MdAdd, MdDateRange, MdRefresh } from "react-icons/md";
import { Dayjs } from "dayjs";

import RoundedTextIconButton from "@components/RoundedTextIconButton";
import RoundedIconButton from "@components/RoundedIconButton";
import DatePicker, { OnDatePickerRangeChangedEvent } from "@components/DatePicker";

interface IProps {
    initialStartDate: Dayjs,
    initialEndDate: Dayjs
    onDatePickerRangeChanged: (event: OnDatePickerRangeChangedEvent) => any
}

const TransactionsHeader = ({
    onDatePickerRangeChanged,
    initialStartDate,
    initialEndDate
}: IProps) => {
    let [isDatePickerOpened, changeIsDatePickerOpened] = useState<boolean>(false);
    let [startDate, changeStartDate] = useState<Dayjs>(initialStartDate);
    let [endDate, changeEndDate] = useState<Dayjs>(initialEndDate);

    const openDatePicker = () => {
        changeIsDatePickerOpened(true);
    };

    const changeTimeRangeOfTransactionsToShow = ({
        startDate, endDate
    }: OnDatePickerRangeChangedEvent) => {
        changeStartDate(startDate);
        changeEndDate(endDate);

        onDatePickerRangeChanged({ startDate, endDate });
    };

    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold">Monthly transactions</h5>
                <p className="paragraph--sub-title">
                    {startDate.format("MM/DD/YYYY")} - {endDate.format("MM/DD/YYYY")}
                </p>
            </div>
            <div className="app-layout__header__actions-container">
                <RoundedTextIconButton Icon={MdRefresh}/>
                <RoundedTextIconButton
                    Icon={MdDateRange}
                    clickEvent={openDatePicker}/>
                <DatePicker
                    initialStartDate={initialStartDate}
                    initialEndDate={initialEndDate}
                    onRangeChanged={changeTimeRangeOfTransactionsToShow}
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