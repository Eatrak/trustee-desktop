import { Tooltip } from "react-tooltip";
import { v4 as uuid } from "uuid";

import "./style.css";

interface IProps {
    title: string;
    value: string;
    className?: string;
    size?: "normal" | "large";
}

const Statistic = ({ title, value, size = "normal", className }: IProps) => {
    const tooltipId = uuid();

    return (
        <div className={`statistic ${className || ""}`}>
            <p className="statistic__title paragraph paragraph--sub-title">{title}</p>
            {size == "large" && (
                <>
                    <h6
                        data-tooltip-id={tooltipId}
                        data-tooltip-content={value}
                        className="statistic__value header--semi-bold"
                    >
                        {value}
                    </h6>
                    <Tooltip id={tooltipId} />
                </>
            )}
            {size == "normal" && (
                <>
                    <p
                        data-tooltip-id={tooltipId}
                        data-tooltip-content={value}
                        className="statistic__value paragraph paragraph--large paragraph--semi-bold"
                    >
                        {value}
                    </p>
                    <Tooltip id={tooltipId} />
                </>
            )}
        </div>
    );
};

export default Statistic;
