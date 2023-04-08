import "./style.css";

import { IconType } from "react-icons";

interface IProps {
    Icon?: IconType,
    iconClass?: string,
    isRightIcon?: boolean,
    text?: string,
    event?: (...p: any) => any,
    className?: string,
    disabled?: boolean,
    testId?: string,
}

const NormalButton = ({Icon, iconClass, isRightIcon, text, event, className, disabled, testId}: IProps) => {
    const defaultClasses = "button--normal " + (disabled ? " button--disabled " : " ");

    return(
        <button
            data-testid={testId}
            className={defaultClasses + className}
            onClick={event}
            disabled={disabled}>
            {Icon && !isRightIcon && <Icon className={"button--normal__icon " + iconClass}/>}
            {text && <p>{text}</p>}
            {Icon && isRightIcon && <Icon className={"button--normal__icon " + iconClass}/>}
        </button>
    );
}

export default NormalButton;