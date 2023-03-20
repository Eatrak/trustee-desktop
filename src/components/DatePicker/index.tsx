import "./style.css";

import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import dayjs from "dayjs";

import MiniRoundedIconButton from "@components/MiniRoundedIconButton";

const DatePicker = () => {
    const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];
    const currentYearAndMonth = dayjs().format("YYYY-MM");
    let [selectedYearAndMonth, changeYearAndMonth] = useState<string>(currentYearAndMonth);

    return (
        <div className="date-picker">
            <div className="date-picker__header">
                <MiniRoundedIconButton Icon={MdChevronLeft}/>
                <p
                    className="date-picker__header__month-name paragraph--sub-title paragraph--small">
                    {dayjs(currentYearAndMonth).format("MMMM")} {dayjs(currentYearAndMonth).get("year")}
                </p>
                <MiniRoundedIconButton Icon={MdChevronRight}/>
            </div>
            <div className="date-picker__day-list">
                {
                    dayNames.map(dayName => {
                        return (
                            <p className="paragraph--small paragraph--bold date-picker__day-list__day-name">
                                {dayName}
                            </p>
                        );
                    })
                }
            </div>
            <div className="date-picker__content">
                {
                    [...Array(dayjs(currentYearAndMonth).daysInMonth()).keys()].map(day => {
                        return (
                            <div className="date-picker__content__day">
                                <p key={day + 1} className="paragraph--small paragraph--bold date-picker__content__day__text">
                                    {day + 1}
                                </p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default DatePicker;