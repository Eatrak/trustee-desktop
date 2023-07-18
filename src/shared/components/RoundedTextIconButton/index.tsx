import "./style.css";

import { IconType } from "react-icons";

interface IProps {
    Icon: IconType;
    clickEvent?: (...p: any) => any;
    danger?: boolean;
}

const RoundedTextIconButton = ({ Icon, clickEvent, danger }: IProps) => {
    const getRootClasses = () => {
        return `rounded-text-icon-button ${
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
