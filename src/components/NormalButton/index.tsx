import "./style.css";

interface IProps {
    text: string,
    event?: (...p: any) => any,
    className?: string,
    disabled?: boolean
}

const NormalButton = ({text, event, className, disabled}: IProps) => {
    return(
        <button className={"button--normal " + className + (disabled && " button--disabled")} onClick={event} disabled={disabled}>{text}</button>
    );
}

export default NormalButton;