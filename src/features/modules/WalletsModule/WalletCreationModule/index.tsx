import { useNavigate } from "react-router-dom";
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

import { createWalletFormSchema } from "@/shared/validatorRules/wallets";
import { CreateWalletFormSchema } from "@/shared/ts-types/APIs/input/transactions/createWallet";
import WalletsService from "@/shared/services/wallets";
import AuthService from "@/shared/services/auth";
import { FieldName, TranslationKey } from "@/shared/ts-types/generic/translations";
import { Utils } from "@/shared/services/utils";

const WalletCreationModule = () => {
    const navigate = useNavigate();

    const form = useForm<CreateWalletFormSchema>({
        resolver: zodResolver(createWalletFormSchema),
        defaultValues: {
            name: "",
            untrackedBalance: 0,
        },
    });

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.MODULES, TranslationKey.WALLET_CREATION, ...translationKeys],
            params,
        );
    };

    const translateFormFieldTitle = (fieldName: FieldName) => {
        return Utils.getInstance().translateFormFieldTitle(fieldName);
    };

    const goToWalletsModule = () => navigate("/wallets");

    const confirm = async (formData: CreateWalletFormSchema) => {
        await createWallet(formData);
    };

    const createWallet = async ({ name, untrackedBalance }: CreateWalletFormSchema) => {
        const createWalletRequest = await WalletsService.getInstance().createWallet({
            name,
            untrackedBalance,
            currencyId:
                AuthService.getInstance().personalInfo$.value.settings.currency.id,
        });
        if (!createWalletRequest.err) {
            goToWalletsModule();
        }
    };

    return (
        <FormModule
            title={translate([TranslationKey.HEADER, TranslationKey.TITLE])}
            subTitle={translate([TranslationKey.HEADER, TranslationKey.SUB_TITLE])}
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

export default WalletCreationModule;
