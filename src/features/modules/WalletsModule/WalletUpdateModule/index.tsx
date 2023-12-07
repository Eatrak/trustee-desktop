import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormModule from "@/shared/customComponents/CreationModule";
import { updateWalletFormSchema } from "@/shared/validatorRules/wallets";
import WalletsService from "@/shared/services/wallets";
import { FieldName, TranslationKey } from "@/shared/ts-types/generic/translations";
import { Utils } from "@/shared/services/utils";
import { Wallet } from "@/shared/schema";
import { UpdateWalletFormSchema } from "@/shared/ts-types/APIs/input/transactions/updateWallet";
import LoadingPage from "@/shared/customComponents/LoadingPage";

const WalletUpdateModule = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [walletToUpdate, setWalletToUpdate] = useState<Wallet | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const form = useForm<UpdateWalletFormSchema>({
        resolver: zodResolver(updateWalletFormSchema),
        defaultValues: {
            name: "",
            untrackedBalance: 0,
        },
    });

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.MODULES, TranslationKey.WALLET_UPDATE, ...translationKeys],
            params,
        );
    };

    const translateFormFieldTitle = (fieldName: FieldName) => {
        return Utils.getInstance().translateFormFieldTitle(fieldName);
    };

    const goToWalletsModule = () => navigate("/wallets");

    const confirm = async (formData: UpdateWalletFormSchema) => {
        await updateWallet(formData);
    };

    const updateWallet = async ({ name, untrackedBalance }: UpdateWalletFormSchema) => {
        if (!walletToUpdate) return /* TODO: Show general error toast */;

        const createWalletRequest = await WalletsService.getInstance().updateWallet(
            walletToUpdate.id,
            {
                name,
                untrackedBalance,
            },
        );
        if (!createWalletRequest.err) {
            goToWalletsModule();
        }
    };

    const initWalletToUpdate = async () => {
        setIsLoading(true);

        const idOfWalletToUpdate = params.id;
        if (idOfWalletToUpdate) {
            const walletToUpdate = await WalletsService.getInstance().getWallet(
                idOfWalletToUpdate,
            );

            if (!walletToUpdate) return /* TODO: Show general error toast */;

            setWalletToUpdate(walletToUpdate);

            // TODO: Find a way to remove never. This problem is due to Zod inference. Maybe it's a Typescript bug
            form.setValue("name", walletToUpdate.name as never);
            form.setValue("untrackedBalance", walletToUpdate.untrackedBalance as never);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        initWalletToUpdate();
    }, []);

    return isLoading ? (
        <LoadingPage />
    ) : (
        <FormModule
            title={translate([TranslationKey.HEADER, TranslationKey.TITLE])}
            subTitle={translate([TranslationKey.HEADER, TranslationKey.SUB_TITLE], {
                name: walletToUpdate?.name,
            })}
            onExit={goToWalletsModule}
            onSubmit={confirm}
            form={form}
            formContent={
                <>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {translateFormFieldTitle(FieldName.NAME)}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="untrackedBalance"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {translateFormFieldTitle(FieldName.UNTRACKED_BALANCE)}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                            // Set the value to 0 if the field is blank
                                            if (e.target.value === "") {
                                                e.target.value = "0";
                                            }
                                            field.onChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            }
        ></FormModule>
    );
};

export default WalletUpdateModule;
