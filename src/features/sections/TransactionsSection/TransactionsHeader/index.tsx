import "./style.css";

import { useState } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";
import { Dayjs } from "dayjs";

import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import RoundedIconButton from "@shared/components/RoundedIconButton";
import RangeDatePicker, {
    OnRangeDatePickerRangeChangedEvent,
} from "@shared/components/RangeDatePicker";
import { Utils } from "@shared/services/utils";
import { TranslationKey } from "@shared/ts-types/generic/translations";

interface IProps {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    lastStartDate: Dayjs;
    lastEndDate: Dayjs;
    onDatePickerRangeChanged: (event: OnRangeDatePickerRangeChangedEvent) => any;
    openTransactionCreationDialog: Function;
    setStartDate: Function;
    setEndDate: Function;
    reloadTransactions: Function;
}

const TransactionsHeader = ({
    reloadTransactions,
    onDatePickerRangeChanged,
    lastStartDate,
    lastEndDate,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    openTransactionCreationDialog,
}: IProps) => {
    let [isDatePickerOpened, changeIsDatePickerOpened] = useState<boolean>(false);

    const changeTimeRangeOfTransactionsToShow = ({
        startDate,
        endDate,
    }: OnRangeDatePickerRangeChangedEvent) => {
        setStartDate(startDate);
        setEndDate(endDate);

        onDatePickerRangeChanged({ startDate, endDate });
    };

    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold app-layout__header__texts_container__title">
                    {Utils.getInstance().translate([
                        TranslationKey.MODULES,
                        TranslationKey.TRANSACTIONS,
                        TranslationKey.HEADER,
                        TranslationKey.TITLE,
                    ])}
                </h5>
                <p className="paragraph--sub-title">
                    {lastStartDate.format("MM/DD/YYYY")} -{" "}
                    {lastEndDate.format("MM/DD/YYYY")}
                </p>
            </div>
            <div className="app-layout__header__actions-container">
                <RoundedTextIconButton
                    Icon={MdRefresh}
                    clickEvent={() => reloadTransactions()}
                />
                <RangeDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    onRangeChanged={changeTimeRangeOfTransactionsToShow}
                    isOpened={isDatePickerOpened}
                    setOpened={changeIsDatePickerOpened}
                    style={{
                        left: "50%",
                        top: "50px",
                        transform: "translate(-50%)",
                    }}
                />
                <RoundedIconButton
                    Icon={MdAdd}
                    clickEvent={() => openTransactionCreationDialog()}
                />
            </div>
        </div>
    );
};

export default TransactionsHeader;
