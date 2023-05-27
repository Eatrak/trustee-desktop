import "./style.css";

import { IconType } from "react-icons";

interface IProps {
    Icon: IconType,
    clickEvent?: (...p: any) => any,
}

const RoundedTextIconButton = ({ Icon, clickEvent }: IProps) => {
    return (
        <div className="rounded-text-icon-button" onClick={clickEvent} tabIndex={1}>
            <Icon className="rounded-text-icon-button__icon"/>
        </div>
    );
};

export default RoundedTextIconButton;