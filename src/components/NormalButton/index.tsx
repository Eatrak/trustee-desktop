import "./style.css";

interface IProps {
    text: string,
    event?: (...p: any) => any,
    className?: string,
    disabled?: boolean,
    testId?: string
}

const NormalButton = ({text, event, className, disabled, testId}: IProps) => {
    const defaultClasses = "button--normal " + (disabled ? " button--disabled " : " ");

    return(
        <button data-testid={testId} className={defaultClasses + className} onClick={event} disabled={disabled}>{text}</button>
    );
}

export default NormalButton;