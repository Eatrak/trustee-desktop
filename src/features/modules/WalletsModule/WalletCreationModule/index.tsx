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
import CreationModule from "@/shared/customComponents/CreationModule";

import { createWalletFormSchema } from "@/shared/validatorRules/wallets";
import { CreateWalletFormSchema } from "@/shared/ts-types/APIs/input/transactions/createWallet";
import WalletsService from "@/shared/services/wallets";
import AuthService from "@/shared/services/auth";

const WalletCreationModule = () => {
    const navigate = useNavigate();

    const form = useForm<CreateWalletFormSchema>({
        resolver: zodResolver(createWalletFormSchema),
        defaultValues: {
            name: "",
            untrackedBalance: 0,
        },
    });

    const goToWalletsModule = () => navigate("/wallets");

    const openCancelConfirmationDialog = () => {
        goToWalletsModule();
    };

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
        <CreationModule
            title="Wallet creation"
            subTitle="Create a new wallet."
            onCancel={() => openCancelConfirmationDialog()}
            onSubmit={confirm}
            form={form}
            formContent={
                <>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
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
                                <FormLabel>Untracked balance</FormLabel>
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
        ></CreationModule>
    );
};

export default WalletCreationModule;
