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
import { useState } from "react";
import LoadingIcon from "../LoadingIcon";

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
    const [isOpened, setIsOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.CONFIRMATION_DIALOG, ...translationKeys],
            params,
        );
    };

    return (
        <AlertDialog open={isOpened}>
            <AlertDialogTrigger asChild onClick={() => setIsOpened(true)}>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpened(false)}>
                        {translate([TranslationKey.CANCEL])}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={async () => {
                            setIsLoading(true);
                            await onConfirm();
                            setIsLoading(false);
                            setIsOpened(false);
                        }}
                    >
                        {isLoading && <LoadingIcon className="w-4 h-4 mr-2" />}
                        {translate([TranslationKey.CONFIRM])}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
