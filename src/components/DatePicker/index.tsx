import "./style.css";

import { useEffect, useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import dayjs from "dayjs";

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
    let [startDay, changeStartDay] = useState<number | null>(null);
    let [endDay, changeEndDay] = useState<number | null>(null);
    let [endDayCandidate, changeEndDayCandidate] = useState<number | null>();

    const selectPreviousMonth = () => {
        const previousMonthYear = dayjs(selectedYearAndMonth).subtract(1, "month");
        changeYearAndMonth(previousMonthYear.format());
    };

    const selectNextMonth = () => {
        const nextMonthYear = dayjs(selectedYearAndMonth).add(1, "month");
        changeYearAndMonth(nextMonthYear.format());
    };

    const getMonthDayCSSClass = (day: number) => {
        let cssClass = "date-picker__month-day-list__month-day";

        // If no days have been selected, all the days are start-day candidates
        if (startDay == null && endDay == null) {
            cssClass += " date-picker__month-day-list__month-day--start-day-candidate";
        }
        
        // If the start-day has been selected
        if (startDay != null) {
            // If the days range has been selected, the days out of the range are start-day candidates
            if (endDay != null && (day < startDay || day > endDay)) {
                cssClass += " date-picker__month-day-list__month-day--start-day-candidate";
            }

            const isDayInCandidateRange = day > startDay && endDayCandidate != null && endDay == null && day < endDayCandidate;
            const isDayInRange = day > startDay && endDay != null && day < endDay;
            // If the day is in the candidate range or in the selected range
            if (isDayInCandidateRange || isDayInRange) {
                cssClass += " date-picker__month-day-list__month-day--selected-range-day";
            }

            const isDayTheEndDayCandidate = endDayCandidate != null && endDay == null && day == endDayCandidate;
            const isDayTheStartDay = day == startDay;
            const isDayTheEndDay = endDay != null && day == endDay;
            // If the day is an extreme of the candidate range or selected range
            if (isDayTheStartDay || isDayTheEndDayCandidate || isDayTheEndDay) {
                cssClass += " date-picker__month-day-list__month-day--selected-range-extreme-day";
            }
        }

        return cssClass;
    };

    const changeInterval = (day: number) => {
        if ((startDay == null && endDay == null) || (startDay != null && day < startDay)) {
            changeStartDay(day);
        }
        else if (startDay != null && endDay == null) {
            changeEndDay(day);
        }

        if (startDay != null && endDay != null) {
            changeStartDay(day);
            changeEndDay(null);
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
                                <p className="paragraph--small paragraph--bold date-picker__weekday-list__weekday">
                                    {dayName}
                                </p>
                            );
                        })
                    }
                </div>
                <div className="date-picker__month-day-list">
                    {
                        [...Array(dayjs(selectedYearAndMonth).daysInMonth()).keys()].map(day => {
                            return (
                                <div
                                    className={getMonthDayCSSClass(day + 1)}
                                    onClick={() => changeInterval(day + 1)}
                                    onMouseEnter={() => changeEndDayCandidate(day + 1)}>

                                    <p key={day + 1} className="paragraph--small paragraph--bold date-picker__month-day-list__month-day__text">
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