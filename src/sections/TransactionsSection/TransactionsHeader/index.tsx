import "./style.css";

import { useState } from "react";
import { MdAdd, MdDateRange, MdRefresh } from "react-icons/md";
import { Dayjs } from "dayjs";

import RoundedTextIconButton from "@components/RoundedTextIconButton";
import RoundedIconButton from "@components/RoundedIconButton";
import RangeDatePicker, { OnRangeDatePickerRangeChangedEvent } from "@components/RangeDatePicker";

interface IProps {
    initialStartDate: Dayjs,
    initialEndDate: Dayjs
    onDatePickerRangeChanged: (event: OnRangeDatePickerRangeChangedEvent) => any
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
    }: OnRangeDatePickerRangeChangedEvent) => {
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
                <RangeDatePicker
                    initialStartDate={initialStartDate}
                    initialEndDate={initialEndDate}
                    onRangeChanged={changeTimeRangeOfTransactionsToShow}
                    isOpened={isDatePickerOpened}
                    setOpened={changeIsDatePickerOpened}
                    style={{
                        left: "50%",
                        top: "50px",
                        transform: "translate(-50%)"
                    }}/>
                <RoundedIconButton Icon={MdAdd}/>
            </div>
        </div>
    );
};

export default TransactionsHeader;