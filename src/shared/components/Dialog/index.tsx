import "./style.css";
import DialogHeader from "./DialogHeader";

interface IProps {
    title: string,
    children?: React.ReactNode
}

const Dialog = ({ title, children }: IProps) => {
    return (
        <>
            <div className="dialog">
                <DialogHeader title={title} />
                <div className="dialog__content">
                    {children}
                </div>
            </div>
            <div className="dialog-cover"></div>
        </>
    );
};

export default Dialog;
