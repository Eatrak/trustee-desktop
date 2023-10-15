import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight, MdDateRange } from "react-icons/md";
import dayjs, { Dayjs } from "dayjs";
import Validator, { Rules, TypeCheckingRule } from "validatorjs";

import MiniRoundedIconButton from "@shared/components/MiniRoundedIconButton";

interface IProps {
    title: string;
    style?: React.CSSProperties;
    isOpened: boolean;
    setOpened: Function;
    onDateChanged?: (selectedDate: Dayjs) => any;
    selectedDate: Dayjs;
    validatorAttributeName: string;
    validatorRule?: string | Array<string | TypeCheckingRule> | Rules;
}

const DatePicker = ({
    title,
    style,
    isOpened,
    setOpened,
    onDateChanged,
    selectedDate,
    validatorAttributeName,
    validatorRule,
}: IProps) => {
    let datePickerFrame = useRef<HTMLDivElement>(null);

    const NUMBER_OF_DAYS_TO_SHOW = 42;
    const currentYearAndMonth = dayjs().format("YYYY-MM");

    const isFirstRender = useRef(true);
    let [hasNeverBeenOpened, setHasNeverBeenOpened] = useState<boolean>(true);
    let [canBeOpened, setCanBeOpened] = useState<boolean>(true);
    let [selectedYearAndMonth, setYearAndMonth] = useState<string>(currentYearAndMonth);
    let [errors, setErrors] = useState<string[]>([]);
    let [firstWeekDay, setFirstWeekDay] = useState<dayjs.Dayjs>(
        dayjs(selectedYearAndMonth).startOf("week"),
    );

    const selectPreviousMonth = () => {
        const previousMonthYear = dayjs(selectedYearAndMonth).subtract(1, "month");
        const updatedSelectedYearAndMonth = previousMonthYear.format("YYYY-MM");

        setYearAndMonth(updatedSelectedYearAndMonth);
        setFirstWeekDay(dayjs(updatedSelectedYearAndMonth).startOf("week"));
    };

    const selectNextMonth = () => {
        const nextMonthYear = dayjs(selectedYearAndMonth).add(1, "month");
        const updatedSelectedYearAndMonth = nextMonthYear.format("YYYY-MM");

        setYearAndMonth(updatedSelectedYearAndMonth);
        setFirstWeekDay(dayjs(updatedSelectedYearAndMonth).startOf("week"));
    };

    const selectDate = (dateToSelect: Dayjs) => {
        onDateChanged && onDateChanged(dateToSelect);
        setOpened(false);
    };

    const getMonthDayCSSClass = (date: Dayjs) => {
        let cssClass = "date-picker__panel__month-day-list__month-day";

        // Set a certain class to a day that doesn't belong to the selected year and month
        if (
            date.get("month") != dayjs(selectedYearAndMonth).get("month") ||
            date.get("year") != dayjs(selectedYearAndMonth).get("year")
        ) {
            cssClass +=
                " date-picker__panel__month-day-list__month-day--is-of-another-month";
        }

        if (date.isSame(selectedDate)) {
            cssClass += " date-picker__panel__month-day-list__month-day--selected";
        } else {
            cssClass += " date-picker__panel__month-day-list__month-day--not-selected";
        }

        return cssClass;
    };

    const openPanel = () => {
        if (canBeOpened) {
            setHasNeverBeenOpened(false);
            setOpened(true);
            setCanBeOpened(false);
        }
    };

    // Event used to close the date picker when touching outside of it
    const closeDatePickerWhenTouchingOutsideEvent = (e: MouseEvent) => {
        const hasDatePickerBeenClicked = e.target == datePickerFrame.current;
        const haveDatePickerChildsBeenClicked = datePickerFrame.current?.contains(
            e.target as HTMLElement,
        );
        if (!hasDatePickerBeenClicked && !haveDatePickerChildsBeenClicked) {
            setOpened(false);
        }
    };

    const setPanelOpenable = ({ animationName }: AnimationEvent) => {
        if (animationName == "fade-closing") {
            setCanBeOpened(true);
        }
    };

    const checkErrors = () => {
        if (!validatorRule) return;

        const validation = new Validator(
            { [validatorAttributeName]: selectedDate?.format() },
            { [validatorAttributeName]: validatorRule },
        );
        validation.check();

        const errors = validation.errors.get(validatorAttributeName);
        setErrors(errors);
    };

    const renderErrors = () => {
        let id = 0;

        return errors.map((error) => {
            return (
                <p key={id++} className="paragraph--small text--error">
                    {error}
                </p>
            );
        });
    };

    useEffect(() => {
        datePickerFrame.current?.addEventListener("animationend", setPanelOpenable);
        document.addEventListener("mousedown", closeDatePickerWhenTouchingOutsideEvent);
    }, []);

    useEffect(
        () => () => {
            document.removeEventListener(
                "mousedown",
                closeDatePickerWhenTouchingOutsideEvent,
            );
        },
        [],
    );

    useEffect(() => {
        // Exit if it is the first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!isOpened) {
            checkErrors();
        }
    }, [isOpened]);

    return (
        <div
            className={`date-picker ${errors.length > 0 ? "date-picker--in-error" : ""}`}
        >
            <div className="date-picker-selector">
                <p className="paragraph--small paragraph--sub-title date-picker-selector__title">
                    {title}
                </p>
                <div
                    className="date-picker-selector__body"
                    onTimeUpdate={() => openPanel()}
                    onClick={() => openPanel()}
                >
                    <p className="paragraph--small date-picker-selector__body__text">
                        {selectedDate?.format("YYYY/MM/DD")}
                    </p>
                    <MdDateRange className="date-picker-selector__body__icon" />
                </div>
            </div>
            {renderErrors()}
            <div
                ref={datePickerFrame}
                className={
                    "date-picker__panel date-picker__panel--" +
                    (isOpened ? "opened" : "closed") +
                    (hasNeverBeenOpened
                        ? " date-picker__panel--has-never-been-opened"
                        : "")
                }
                style={style}
            >
                <div className="date-picker__panel__header">
                    <MiniRoundedIconButton
                        Icon={MdChevronLeft}
                        clickEvent={selectPreviousMonth}
                    />
                    <p className="date-picker__panel__header__month-name paragraph--sub-title paragraph--small">
                        {dayjs(selectedYearAndMonth).format("MMMM")}{" "}
                        {dayjs(selectedYearAndMonth).get("year")}
                    </p>
                    <MiniRoundedIconButton
                        Icon={MdChevronRight}
                        clickEvent={selectNextMonth}
                    />
                </div>
                <div className="date-picker__panel__content">
                    <div className="date-picker__panel__weekday-list">
                        {dayjs.weekdaysShort(true)
                            .map((dayName) => {
                                return (
                                    <p
                                        key={dayName}
                                        className="paragraph--small paragraph--bold date-picker__panel__weekday-list__weekday"
                                    >
                                        {dayName}
                                    </p>
                                );
                            })}
                    </div>
                    <div className="date-picker__panel__month-day-list">
                        {[...Array(NUMBER_OF_DAYS_TO_SHOW).keys()].map((index) => {
                            const date = firstWeekDay.add(index, "day");

                            return (
                                <div
                                    key={date.toString()}
                                    className={getMonthDayCSSClass(date)}
                                    onClick={() => selectDate(date)}
                                >
                                    <p className="paragraph--small paragraph--bold date-picker__panel__month-day-list__month-day__text">
                                        {date.get("date")}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
