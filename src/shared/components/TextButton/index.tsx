import "./style.css";

import { IconType } from "react-icons";

import LoadingIcon from "@shared/components/LoadingIcon";

type Size = "large";

interface IProps {
    Icon?: IconType;
    text: string;
    clickEvent?: (...p: any) => any;
    isLoading?: boolean;
    size?: Size;
}

const TextButton = ({ Icon, text, clickEvent, isLoading, size }: IProps) => {
    return (
        <button
            className={`text-button text-button--${size || ""}`}
            tabIndex={1}
            onClick={clickEvent}
            disabled={isLoading}
        >
            {!isLoading ? (
                Icon && <Icon className="text-button__icon" />
            ) : (
                <LoadingIcon />
            )}
            <p className="paragraph text-button__paragraph">{text}</p>
        </button>
    );
};

export default TextButton;
