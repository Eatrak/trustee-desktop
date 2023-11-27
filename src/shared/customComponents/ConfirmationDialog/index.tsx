import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Utils } from "@/shared/services/utils";
import { TranslationKey } from "@/shared/ts-types/generic/translations";

interface IProps {
    title: string;
    description: string;
    trigger: JSX.Element;
    onConfirm: Function;
}

export const ConfirmationDialog = ({
    title,
    description,
    trigger,
    onConfirm,
}: IProps) => {
    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.CONFIRMATION_DIALOG, ...translationKeys],
            params,
        );
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {translate([TranslationKey.CANCEL])}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm()}>
                        {translate([TranslationKey.CONFIRM])}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
