import "./style.css";

import { IconType } from "react-icons";

interface IProps {
    Icon: IconType,
    clickEvent?: (...p: any) => any,
}

const MiniRoundedIconButton = ({ Icon, clickEvent }: IProps) => {
    return (
        <div
            className="mini-rounded-icon-button"
            onClick={clickEvent}
            tabIndex={1}>

            <Icon className="mini-rounded-icon-button__icon"/>
        </div>
    );
};

export default MiniRoundedIconButton;