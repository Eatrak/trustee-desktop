import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight, MdDateRange } from "react-icons/md";
import dayjs, { Dayjs } from "dayjs";

import MiniRoundedIconButton from "@shared/components/MiniRoundedIconButton";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";

export interface OnRangeDatePickerRangeChangedEvent {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
}

interface IProps {
    style: React.CSSProperties;
    isOpened: boolean;
    setOpened: Function;
    setStartDate: Function;
    setEndDate: Function;
    onRangeChanged: (event: OnRangeDatePickerRangeChangedEvent) => any;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
}

const RangeDatePicker = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    style,
    isOpened,
    setOpened,
    onRangeChanged,
}: IProps) => {
    let datePickerFrame = useRef<HTMLDivElement>(null);

    const NUMBER_OF_DAYS_TO_SHOW = 42;
    const currentYearAndMonth = dayjs().format("YYYY-MM");

    let [hasNeverBeenOpened, setHasNeverBeenOpened] = useState<boolean>(true);
    let [canBeOpened, setCanBeOpened] = useState<boolean>(true);
    let [selectedYearAndMonth, changeYearAndMonth] =
        useState<string>(currentYearAndMonth);
    let [endDateCandidate, changeEndDateCandidate] = useState<Dayjs | null>();
    let [firstWeekDay, setFirstWeekDay] = useState<dayjs.Dayjs>(
        dayjs(selectedYearAndMonth).startOf("week"),
    );

    const selectPreviousMonth = () => {
        const previousMonthYear = dayjs(selectedYearAndMonth).subtract(1, "month");
        const updatedSelectedYearAndMonth = previousMonthYear.format("YYYY-MM");

        changeYearAndMonth(updatedSelectedYearAndMonth);
        setFirstWeekDay(dayjs(updatedSelectedYearAndMonth).startOf("week"));
    };

    const selectNextMonth = () => {
        const nextMonthYear = dayjs(selectedYearAndMonth).add(1, "month");
        const updatedSelectedYearAndMonth = nextMonthYear.format("YYYY-MM");

        changeYearAndMonth(updatedSelectedYearAndMonth);
        setFirstWeekDay(dayjs(updatedSelectedYearAndMonth).startOf("week"));
    };

    const getMonthDayCSSClass = (date: Dayjs) => {
        let cssClass = "range-date-picker__panel__month-day-list__month-day";

        if (
            date.get("month") != dayjs(selectedYearAndMonth).get("month") ||
            date.get("year") != dayjs(selectedYearAndMonth).get("year")
        ) {
            cssClass +=
                " range-date-picker__panel__month-day-list__month-day--is-of-another-month";
        }

        // If no days have been selected, all the days are start-day candidates
        if (startDate == null && endDate == null) {
            cssClass +=
                " range-date-picker__panel__month-day-list__month-day--start-day-candidate";
        }

        // If the start-day has been selected
        if (startDate != null) {
            // If the days range has been selected, the days out of the range are start-day candidates
            if (endDate != null && (date.isBefore(startDate) || date.isAfter(endDate))) {
                cssClass +=
                    " range-date-picker__panel__month-day-list__month-day--start-day-candidate";
            }

            const isDateInCandidateRange =
                date.isAfter(startDate) &&
                endDateCandidate != null &&
                endDate == null &&
                date.isBefore(endDateCandidate);
            const isDateInRange =
                date.isAfter(startDate) && endDate != null && date.isBefore(endDate);
            // If the day is in the candidate range or in the selected range
            if (isDateInCandidateRange || isDateInRange) {
                cssClass +=
                    " range-date-picker__panel__month-day-list__month-day--selected-range-day";
            }

            const isDateTheEndDateCandidate =
                endDateCandidate != null &&
                endDate == null &&
                date.isSame(endDateCandidate);
            const isDateTheStartDate = date.isSame(startDate);
            const isDateTheEndDate = endDate != null && date.isSame(endDate);
            // If the day is an extreme of the candidate range or selected range
            if (isDateTheStartDate || isDateTheEndDateCandidate || isDateTheEndDate) {
                cssClass +=
                    " range-date-picker__panel__month-day-list__month-day--selected-range-extreme-day";
            }
        }

        return cssClass;
    };

    const changeInterval = (date: Dayjs) => {
        if (
            (startDate == null && endDate == null) ||
            (startDate != null && date.isBefore(startDate))
        ) {
            setStartDate(date);
        } else if (startDate != null && endDate == null) {
            setEndDate(date);
            onRangeChanged({ startDate, endDate: date });
            setOpened(false);
        }

        if (startDate != null && endDate != null) {
            setStartDate(date);
            setEndDate(null);
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

    const openPanel = () => {
        if (canBeOpened) {
            setHasNeverBeenOpened(false);
            setOpened(true);
            setCanBeOpened(false);
        }
    };

    const setPanelOpenable = ({ animationName }: AnimationEvent) => {
        if (animationName == "fade-closing") {
            setCanBeOpened(true);
        }
    };

    useEffect(() => {
        onRangeChanged({
            startDate,
            endDate,
        });

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

    return (
        <div className="range-date-picker">
            <RoundedTextIconButton Icon={MdDateRange} clickEvent={openPanel} />
            <div
                ref={datePickerFrame}
                className={
                    "range-date-picker__panel range-date-picker__panel--" +
                    (isOpened ? "opened" : "closed") +
                    (hasNeverBeenOpened
                        ? " range-date-picker__panel--has-never-been-opened"
                        : "")
                }
                style={style}
            >
                <div className="range-date-picker__panel__header">
                    <MiniRoundedIconButton
                        Icon={MdChevronLeft}
                        clickEvent={selectPreviousMonth}
                    />
                    <p className="range-date-picker__panel__header__month-name paragraph--sub-title paragraph--small">
                        {dayjs(selectedYearAndMonth).format("MMMM")}{" "}
                        {dayjs(selectedYearAndMonth).get("year")}
                    </p>
                    <MiniRoundedIconButton
                        Icon={MdChevronRight}
                        clickEvent={selectNextMonth}
                    />
                </div>
                <div className="range-date-picker__panel__content">
                    <div className="range-date-picker__panel__weekday-list">
                        {dayjs
                            .localeData()
                            .weekdaysShort()
                            .map((dayName) => {
                                return (
                                    <p
                                        key={dayName}
                                        className="paragraph--small paragraph--bold range-date-picker__panel__weekday-list__weekday"
                                    >
                                        {dayName}
                                    </p>
                                );
                            })}
                    </div>
                    <div className="range-date-picker__panel__month-day-list">
                        {[...Array(NUMBER_OF_DAYS_TO_SHOW).keys()].map((index) => {
                            const date = firstWeekDay.add(index, "day");

                            return (
                                <div
                                    key={date.toString()}
                                    className={getMonthDayCSSClass(date)}
                                    onClick={() => changeInterval(date)}
                                    onMouseEnter={() => changeEndDateCandidate(date)}
                                >
                                    <p className="paragraph--small paragraph--bold range-date-picker__panel__month-day-list__month-day__text">
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

export default RangeDatePicker;
