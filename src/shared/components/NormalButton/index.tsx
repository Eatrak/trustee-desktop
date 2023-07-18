import LoadingIcon from "@components/LoadingIcon";
import "./style.css";

import { IconType } from "react-icons";

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
}: IProps) => {
    const defaultClasses = "button--normal " + (disabled ? " button--disabled " : " ");

    return (
        <button
            data-testid={testId}
            className={defaultClasses + className}
            onClick={event}
            disabled={disabled}
        >
            {Icon && !isLoading && !isRightIcon && (
                <Icon className={"button--normal__icon " + iconClass} />
            )}
            {isLoading && !isRightIcon && (
                <LoadingIcon className="button--normal__icon" />
            )}
            {text && <p>{text}</p>}
            {isLoading && isRightIcon && <LoadingIcon className="button--normal__icon" />}
            {Icon && !isLoading && isRightIcon && (
                <Icon className={"button--normal__icon " + iconClass} />
            )}
        </button>
    );
};

export default NormalButton;
