import "./style.css";
import DialogHeader from "./DialogHeader";

interface IProps {
    title: string,
    content?: React.ReactNode,
    footer?: React.ReactNode
}

const Dialog = ({ title, content, footer }: IProps) => {
    return (
        <>
            <div className="dialog">
                <DialogHeader title={title} />
                <div className="dialog__content">
                    {content}
                </div>
                <div className="dialog__footer">
                    {footer}
                </div>
            </div>
            <div className="dialog-cover"></div>
        </>
    );
};

export default Dialog;
