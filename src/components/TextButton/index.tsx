import "./style.css";

import { IconType } from "react-icons";

interface IProps {
    Icon: IconType,
    clickEvent?: (...p: any) => any,
}

const TextButton = ({ Icon, clickEvent }: IProps) => {
    return (
        <button className="text-button" tabIndex={1} onClick={clickEvent}>
            <Icon className="text-button__icon"/>
            <p className="paragraph">Load more</p>
        </button>
    );
};

export default TextButton;