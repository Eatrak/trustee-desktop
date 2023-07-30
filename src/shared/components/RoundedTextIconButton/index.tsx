import "./style.css";

import { IconType } from "react-icons";

type Size = "small" | "regular";

interface IProps {
    Icon: IconType;
    clickEvent?: (...p: any) => any;
    danger?: boolean;
    size?: Size;
}

const RoundedTextIconButton = ({
    Icon,
    clickEvent,
    danger,
    size = "regular",
}: IProps) => {
    const getRootClasses = () => {
        return `rounded-text-icon-button rounded-text-icon-button--${size} ${
            danger ? "rounded-text-icon-button--danger" : ""
        }`;
    };

    return (
        <div className={getRootClasses()} onClick={clickEvent} tabIndex={1}>
            <Icon className="rounded-text-icon-button__icon" />
        </div>
    );
};

export default RoundedTextIconButton;
