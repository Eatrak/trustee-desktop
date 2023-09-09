import "./style.css";
import Dialog from "@shared/components/Dialog";
import NormalButton from "@shared/components/NormalButton";
import TextButton from "@shared/components/TextButton";
import { Utils } from "@shared/services/utils";
import { TranslationKey } from "@shared/ts-types/generic/translations";

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
    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.CONFIRMATION_DIALOG,
            ...translationKeys,
        ]);
    };

    return (
        <Dialog
            title={title}
            content={description}
            footer={
                <div className="transaction-deletion-dialog__footer">
                    <TextButton
                        text={translate([TranslationKey.CANCEL])}
                        clickEvent={() => close()}
                    />
                    <NormalButton
                        text={translate([TranslationKey.CONFIRM])}
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
