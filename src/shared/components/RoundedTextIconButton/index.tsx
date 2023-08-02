import "./style.css";

import { IconType } from "react-icons";

type Size = "small" | "regular";
type State = "danger" | "success" | "normal";

interface IProps {
    Icon: IconType;
    clickEvent?: (...p: any) => any;
    state?: State;
    size?: Size;
}

const RoundedTextIconButton = ({
    Icon,
    clickEvent,
    state = "normal",
    size = "regular",
}: IProps) => {
    const getRootClasses = () => {
        return `rounded-text-icon-button rounded-text-icon-button--${size} rounded-text-icon-button--${state}`;
    };

    return (
        <div className={getRootClasses()} onClick={clickEvent} tabIndex={1}>
            <Icon className="rounded-text-icon-button__icon" />
        </div>
    );
};

export default RoundedTextIconButton;
