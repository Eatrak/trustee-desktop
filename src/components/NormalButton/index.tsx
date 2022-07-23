import "./style.css";

interface IProps {
    text: string,
    event?: (...p: any) => any,
    className?: string,
    disabled?: boolean
}

const NormalButton = ({text, event, className, disabled}: IProps) => {
    const defaultClasses = "button--normal " + (disabled ? " button--disabled " : " ");

    return(
        <button className={defaultClasses + className} onClick={event} disabled={disabled}>{text}</button>
    );
}

export default NormalButton;