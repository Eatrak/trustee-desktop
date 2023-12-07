import { useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

import "./style.css";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import H2 from "@/components/ui/h2";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import { Utils } from "@/shared/services/utils";

interface IProps {
    title: string;
    subTitle: string;
    form: UseFormReturn<any>;
    formContent: JSX.Element;
    onExit: Function;
    onSubmit: SubmitHandler<any>;
}

const FormModule = ({ title, subTitle, form, formContent, onExit, onSubmit }: IProps) => {
    let [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.CREATION_MODULE, ...translationKeys],
            params,
        );
    };

    const submit = async (formData: any) => {
        setIsSubmitting(true);
        await onSubmit(formData);
        setIsSubmitting(false);
    };

    return (
        <div className="section">
            <div className="section__main-content creation-module__main-content">
                <div>
                    <H2 text={title} />
                    <p className="text-muted-foreground">{subTitle}</p>
                </div>
                <Separator />
                <Form {...form}>
                    <form className="creation-module__form">
                        <div className="space-y-4">{formContent}</div>
                    </form>
                </Form>
                <Separator />
                <div className="creation-module__form__footer">
                    <ConfirmationDialog
                        title={translate([
                            TranslationKey.CONFIRMATION_DIALOG,
                            TranslationKey.TITLE,
                        ])}
                        description={translate([
                            TranslationKey.CONFIRMATION_DIALOG,
                            TranslationKey.DESCRIPTION,
                        ])}
                        onConfirm={onExit}
                        trigger={
                            <Button variant="ghost" disabled={isSubmitting}>
                                {translate([
                                    TranslationKey.FOOTER,
                                    TranslationKey.CANCEL,
                                ])}
                            </Button>
                        }
                    />

                    <Button onClick={form.handleSubmit(submit)} disabled={isSubmitting}>
                        {isSubmitting && (
                            <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {translate([TranslationKey.FOOTER, TranslationKey.CONFIRM])}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FormModule;
