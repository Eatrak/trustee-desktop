import LoadingIcon from "@shared/components/LoadingIcon";
import "./style.css";

import { IconType } from "react-icons";

type State = "danger" | "success" | "normal";

interface IProps {
    Icon?: IconType;
    iconClass?: string;
    isRightIcon?: boolean;
    text?: string;
    event?: (...p: any) => any;
    className?: string;
    isLoading?: boolean;
    disabled?: boolean;
    testId?: string;
    state?: State;
}

const NormalButton = ({
    Icon,
    iconClass,
    isRightIcon,
    text,
    event,
    className,
    isLoading,
    disabled,
    testId,
    state = "normal",
}: IProps) => {
    const defaultClasses = `button--normal button--${state} ${
        disabled ? " button--disabled " : " "
    }`;

    return (
        <button
            data-testid={testId}
            className={defaultClasses + className}
            onClick={event}
            disabled={disabled}
        >
            {Icon && !isLoading && !isRightIcon && (
                <Icon className={"button__icon " + iconClass} />
            )}
            {isLoading && !isRightIcon && <LoadingIcon className="button__icon" />}
            {text && <p>{text}</p>}
            {isLoading && isRightIcon && <LoadingIcon className="button__icon" />}
            {Icon && !isLoading && isRightIcon && (
                <Icon className={"button__icon " + iconClass} />
            )}
        </button>
    );
};

export default NormalButton;
