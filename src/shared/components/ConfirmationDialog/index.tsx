import "./style.css";
import Dialog from "@shared/components/Dialog";
import NormalButton from "@shared/components/NormalButton";
import TextButton from "@shared/components/TextButton";

interface IProps {
    title: string;
    description?: JSX.Element;
    confirm: Function;
    close: Function;
    isConfirming?: boolean;
}

const ConfirmationDialog = ({
    title,
    description,
    confirm,
    close,
    isConfirming,
}: IProps) => {
    return (
        <Dialog
            title={title}
            content={description}
            footer={
                <div className="transaction-deletion-dialog__footer">
                    <TextButton text="Close" clickEvent={() => close()} />
                    <NormalButton
                        text="Confirm"
                        disabled={isConfirming}
                        event={() => confirm()}
                        isLoading={isConfirming}
                    />
                </div>
            }
        />
    );
};

export default ConfirmationDialog;
