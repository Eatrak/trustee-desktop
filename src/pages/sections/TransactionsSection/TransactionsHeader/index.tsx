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
    onDatePickerRangeChanged: (event: OnRangeDatePickerRangeChangedEvent) => any,
    openTransactionCreationDialog: Function
}

const TransactionsHeader = ({
    onDatePickerRangeChanged,
    initialStartDate,
    initialEndDate,
    openTransactionCreationDialog
}: IProps) => {
    let [isDatePickerOpened, changeIsDatePickerOpened] = useState<boolean>(false);
    let [startDate, changeStartDate] = useState<Dayjs>(initialStartDate);
    let [endDate, changeEndDate] = useState<Dayjs>(initialEndDate);

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
                <h5 className="header--bold app-layout__header__texts_container__title">Transactions</h5>
                <p className="paragraph--sub-title">
                    {startDate.format("MM/DD/YYYY")} - {endDate.format("MM/DD/YYYY")}
                </p>
            </div>
            <div className="app-layout__header__actions-container">
                <RoundedTextIconButton Icon={MdRefresh}/>
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
                <RoundedIconButton Icon={MdAdd} clickEvent={() => openTransactionCreationDialog()} />
            </div>
        </div>
    );
};

export default TransactionsHeader;