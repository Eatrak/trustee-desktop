import LoadingIcon from "@/shared/customComponents/LoadingIcon";
import "./style.css";

import { LucideIcon } from "lucide-react";

type State = "danger" | "success" | "normal";

interface IProps {
    Icon?: LucideIcon;
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
    const defaultClasses = `button--normal button--${state} button--${
        disabled ? "disabled" : "not-disabled"
    }`;

    return (
        <button
            data-testid={testId}
            className={`${defaultClasses} ${className}`}
            onClick={event}
            disabled={disabled}
        >
            {Icon && !isLoading && !isRightIcon && (
                <Icon className={"w-4 h-4" + iconClass} />
            )}
            {isLoading && !isRightIcon && (
                <LoadingIcon className="button__icon w-4 h-4" />
            )}
            {text && <p>{text}</p>}
            {isLoading && isRightIcon && <LoadingIcon className="button__icon w-4 h-4" />}
            {Icon && !isLoading && isRightIcon && (
                <Icon className={"w-4 h-4 " + iconClass} />
            )}
        </button>
    );
};

export default NormalButton;
