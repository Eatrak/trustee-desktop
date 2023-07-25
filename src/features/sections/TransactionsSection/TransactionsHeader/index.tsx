import "./style.css";

import { useEffect, useRef, useState } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";
import { Dayjs } from "dayjs";

import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import RoundedIconButton from "@shared/components/RoundedIconButton";
import RangeDatePicker, {
    OnRangeDatePickerRangeChangedEvent,
} from "@shared/components/RangeDatePicker";
import MiniSelect, { SelectOption } from "@shared/components/MiniSelect";
import { Currency } from "@shared/ts-types/schema";
import TransactionsService from "@shared/services/transactions";

interface IProps {
    initialStartDate: Dayjs;
    initialEndDate: Dayjs;
    onDatePickerRangeChanged: (event: OnRangeDatePickerRangeChangedEvent) => any;
    openTransactionCreationDialog: Function;
    selectedCurrency: string;
    setSelectedCurrencyCode: (selectedCurrencyCode: string) => any;
}

const TransactionsHeader = ({
    onDatePickerRangeChanged,
    initialStartDate,
    initialEndDate,
    openTransactionCreationDialog,
    selectedCurrency,
    setSelectedCurrencyCode: setSelectedCurrency,
}: IProps) => {
    let currencySelect = useRef<React.ElementRef<typeof MiniSelect>>(null);
    let [currencies, setCurrencies] = useState<Currency[]>([]);
    let [isDatePickerOpened, changeIsDatePickerOpened] = useState<boolean>(false);
    let [startDate, changeStartDate] = useState<Dayjs>(initialStartDate);
    let [endDate, changeEndDate] = useState<Dayjs>(initialEndDate);

    const changeTimeRangeOfTransactionsToShow = ({
        startDate,
        endDate,
    }: OnRangeDatePickerRangeChangedEvent) => {
        changeStartDate(startDate);
        changeEndDate(endDate);

        onDatePickerRangeChanged({ startDate, endDate });
    };

    const getCurrencyOptions = (): SelectOption[] => {
        return currencies.map(({ id, code, symbol }) => ({
            name: `${symbol} ${code}`,
            value: id,
        }));
    };

    useEffect(() => {
        TransactionsService.getInstance().getCurrencies();
        TransactionsService.getInstance().currencies$.subscribe((currencies) => {
            setCurrencies(currencies);

            if (currencies.length == 0) {
                return;
            }

            // Set default currency option
            const { id, code, symbol } = currencies[0];
            currencySelect.current?.setSelectedOption({
                name: `${symbol} ${code}`,
                value: id,
            });
        });
    }, []);

    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold app-layout__header__texts_container__title">
                    Transactions
                </h5>
                <p className="paragraph--sub-title">
                    {startDate.format("MM/DD/YYYY")} - {endDate.format("MM/DD/YYYY")}
                </p>
            </div>
            <div className="app-layout__header__actions-container">
                <MiniSelect
                    ref={currencySelect}
                    className="currency-select"
                    options={getCurrencyOptions()}
                    entityName="currency"
                    selectedOption={
                        getCurrencyOptions().find(
                            (currency) => currency.value == selectedCurrency,
                        )!
                    }
                    onSelect={({ value }) => setSelectedCurrency(value)}
                />
                <RoundedTextIconButton Icon={MdRefresh} />
                <RangeDatePicker
                    initialStartDate={initialStartDate}
                    initialEndDate={initialEndDate}
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
