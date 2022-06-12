import "./style.css";

interface IProps {
    text: string,
    event?: (...p: any) => any,
    className?: string
}

const NormalButton = ({text, event, className}: IProps) => {
    return(
        <button className={"button--normal " + className} onClick={event}>{text}</button>
    );
}

export default NormalButton;