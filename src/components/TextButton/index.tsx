import "./style.css";

import { IconType } from "react-icons";

import LoadingIcon from "@components/LoadingIcon";

interface IProps {
    Icon: IconType,
    text: string,
    clickEvent?: (...p: any) => any,
    isLoading?: boolean
}

const TextButton = ({ Icon, text, clickEvent, isLoading }: IProps) => {
    return (
        <button className="text-button" tabIndex={1} onClick={clickEvent} disabled={isLoading}>
            {
                !isLoading ?
                <Icon className="text-button__icon"/> :
                <LoadingIcon/>
            }
            <p className="paragraph">{text}</p>
        </button>
    );
};

export default TextButton;