import "./style.css";

import { IconType } from "react-icons";

interface IProps {
    Icon: IconType;
    clickEvent?: (...p: any) => any;
}

const RoundedIconButton = ({ Icon, clickEvent }: IProps) => {
    return (
        <div className="rounded-icon-button" onClick={clickEvent} tabIndex={1}>
            <Icon className="rounded-icon-button__icon" />
        </div>
    );
};

export default RoundedIconButton;
