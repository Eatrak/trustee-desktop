import "./style.css";

import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import dayjs from "dayjs";

import MiniRoundedIconButton from "@components/MiniRoundedIconButton";

const DatePicker = () => {
    const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];
    const currentYearAndMonth = dayjs().format("YYYY-MM");
    let [selectedYearAndMonth, changeYearAndMonth] = useState<string>(currentYearAndMonth);
    let [startDay, changeStartDay] = useState<number | null>(null);
    let [endDay, changeEndDay] = useState<number | null>(null);

    const selectPreviousMonth = () => {
        const previousMonthYear = dayjs(selectedYearAndMonth).subtract(1, "month");
        changeYearAndMonth(previousMonthYear.format());
    };

    const selectNextMonth = () => {
        const nextMonthYear = dayjs(selectedYearAndMonth).add(1, "month");
        changeYearAndMonth(nextMonthYear.format());
    };

    const getMonthDayCSSClass = () => {
        let cssClass = "date-picker__month-day-list__month-day";

        if (startDay == null) {
            cssClass += " date-picker__month-day-list__month-day--start-day-candidate";
        }

        return cssClass;
    };

    return (
        <div className="date-picker">
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
                                <div className={getMonthDayCSSClass()}>
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