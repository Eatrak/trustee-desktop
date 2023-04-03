import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import dayjs, { Dayjs } from "dayjs";

import MiniRoundedIconButton from "@components/MiniRoundedIconButton";

interface IProps {
    style: React.CSSProperties,
    setOpened: Function
}

const DatePicker = ({ style, setOpened }: IProps) => {
    let datePickerFrame = useRef<HTMLDivElement>(null);

    const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];
    const currentYearAndMonth = dayjs().format("YYYY-MM");
    let [selectedYearAndMonth, changeYearAndMonth] = useState<string>(currentYearAndMonth);
    let [startDate, changeStartDate] = useState<Dayjs | null>(null);
    let [endDate, changeEndDate] = useState<Dayjs | null>(null);
    let [endDateCandidate, changeEndDateCandidate] = useState<Dayjs | null>();

    const selectPreviousMonth = () => {
        const previousMonthYear = dayjs(selectedYearAndMonth).subtract(1, "month");
        changeYearAndMonth(previousMonthYear.format("YYYY-MM"));
    };

    const selectNextMonth = () => {
        const nextMonthYear = dayjs(selectedYearAndMonth).add(1, "month");
        changeYearAndMonth(nextMonthYear.format("YYYY-MM"));
    };

    const getMonthDayCSSClass = (date: Dayjs) => {
        let cssClass = "date-picker__month-day-list__month-day";

        // If no days have been selected, all the days are start-day candidates
        if (startDate == null && endDate == null) {
            cssClass += " date-picker__month-day-list__month-day--start-day-candidate";
        }
        
        // If the start-day has been selected
        if (startDate != null) {
            // If the days range has been selected, the days out of the range are start-day candidates
            if (endDate != null && (date.isBefore(startDate) || date.isAfter(endDate))) {
                cssClass += " date-picker__month-day-list__month-day--start-day-candidate";
            }

            const isDateInCandidateRange = date.isAfter(startDate) && endDateCandidate != null && endDate == null && date.isBefore(endDateCandidate);
            const isDateInRange = date.isAfter(startDate) && endDate != null && date.isBefore(endDate);
            // If the day is in the candidate range or in the selected range
            if (isDateInCandidateRange || isDateInRange) {
                cssClass += " date-picker__month-day-list__month-day--selected-range-day";
            }

            const isDateTheEndDateCandidate = endDateCandidate != null && endDate == null && date.isSame(endDateCandidate);
            const isDateTheStartDate = date.isSame(startDate);
            const isDateTheEndDate = endDate != null && date.isSame(endDate);
            // If the day is an extreme of the candidate range or selected range
            if (isDateTheStartDate || isDateTheEndDateCandidate || isDateTheEndDate) {
                cssClass += " date-picker__month-day-list__month-day--selected-range-extreme-day";
            }
        }

        return cssClass;
    };

    const changeInterval = (date: Dayjs) => {
        if ((startDate == null && endDate == null) || (startDate != null && date.isBefore(startDate))) {
            changeStartDate(date);
        }
        else if (startDate != null && endDate == null) {
            changeEndDate(date);
        }

        if (startDate != null && endDate != null) {
            changeStartDate(date);
            changeEndDate(null);
        }
    };

    // Event used to close the date picker when touching outside of it
    const closeDatePickerWhenTouchingOutsideEvent = (e: MouseEvent) => {
        const hasDatePickerBeenClicked = e.target == datePickerFrame.current;
        const haveDatePickerChildsBeenClicked = datePickerFrame.current?.contains(e.target as HTMLElement);
        if (!hasDatePickerBeenClicked && !haveDatePickerChildsBeenClicked) {
            setOpened(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeDatePickerWhenTouchingOutsideEvent);
    }, []);

    useEffect(() => () => {
        document.removeEventListener("mousedown", closeDatePickerWhenTouchingOutsideEvent);
    }, []);

    return (
        <div ref={datePickerFrame} className="date-picker" style={style}>
            <div className="date-picker__header">
                <MiniRoundedIconButton Icon={MdChevronLeft} clickEvent={selectPreviousMonth}/>
                <p
                    className="date-picker__header__month-name paragraph--sub-title paragraph--small">
                    {dayjs(selectedYearAndMonth).format("MMMM")} {dayjs(selectedYearAndMonth).get("year")}
                </p>
                <MiniRoundedIconButton Icon={MdChevronRight} clickEvent={selectNextMonth}/>
            </div>
            <div className="date-picker__content">
                <div className="date-picker__weekday-list">
                    {
                        dayNames.map(dayName => {
                            return (
                                <p key={dayName} className="paragraph--small paragraph--bold date-picker__weekday-list__weekday">
                                    {dayName}
                                </p>
                            );
                        })
                    }
                </div>
                <div className="date-picker__month-day-list">
                    {
                        [...Array(dayjs(selectedYearAndMonth).daysInMonth()).keys()].map(day => {
                            const date = dayjs(`${selectedYearAndMonth}-${day + 1}`);
                            
                            return (
                                <div
                                    key={date.toString()}
                                    className={getMonthDayCSSClass(date)}
                                    onClick={() => changeInterval(date)}
                                    onMouseEnter={() => changeEndDateCandidate(date)}>

                                    <p className="paragraph--small paragraph--bold date-picker__month-day-list__month-day__text">
                                        {day + 1}
                                    </p>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default DatePicker;