import "./style.css";

interface IProps {
    title: string
}

const DialogHeader = ({ title }: IProps) => {
    return (
        <div className="dialog__header">
            <p className="paragraph--large dialog__header__title">{title}</p>
        </div>
    );
};

export default DialogHeader;
