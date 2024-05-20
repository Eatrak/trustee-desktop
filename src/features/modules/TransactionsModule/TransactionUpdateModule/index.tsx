import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormModule from "@/shared/customComponents/FormModule";
import { FieldName, TranslationKey } from "@/shared/ts-types/generic/translations";
import { Utils } from "@/shared/services/utils";
import { UpdateTransactionFormSchema } from "@/shared/ts-types/APIs/input/transactions/updateTransaction";
import TransactionsService from "@/shared/services/transactions";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import AuthService from "@/shared/services/auth";
import { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { Transaction, TransactionCategory } from "@/shared/schema";
import LoadingPage from "@/shared/customComponents/LoadingPage";
import MultiSelect, {
    MultiSelectOptionProprieties,
} from "@/shared/customComponents/MultiSelect";
import { updateTransactionFormSchema } from "@/shared/validatorRules/transactions";
import WalletsService from "@/shared/services/wallets";
import { WalletTableRow } from "@/shared/ts-types/DTOs/wallets";

const TransactionUpdateModule = () => {
    const navigate = useNavigate();
    const params = useParams();
    let personalInfoSubscription: Subscription;

    const [openedTransaction, setOpenedTransaction] = useState<Transaction | null>();
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [isCreatingTransactionCategory, setIsCreatingTransactionCategory] =
        useState(false);
    const [transactionCategories, setTransactionCategories] = useState<
        TransactionCategory[]
    >([]);
    const [categoriesOfTransaction, setCategoriesOfTransaction] = useState<
        MultiSelectOptionProprieties[]
    >([]);
    const [wallets, setWallets] = useState<WalletTableRow[]>([]);
    const [currency, setCurrency] = useState(
        AuthService.getInstance().personalInfo$.value.settings.currency,
    );

    const form = useForm<UpdateTransactionFormSchema>({
        resolver: zodResolver(updateTransactionFormSchema),
        defaultValues: {
            name: "",
            amount: 0,
            carriedOut: dayjs().toDate(),
            categories: [],
            isIncome: false,
            wallet: "",
        },
    });

    const translate = (
        translationKeys: (TranslationKey | FieldName)[],
        params?: Object,
    ) => {
        return Utils.getInstance().translate(
            [
                TranslationKey.MODULES,
                TranslationKey.TRANSACTION_UPDATE,
                ...translationKeys,
            ],
            params,
        );
    };

    const translateFormFieldTitle = (fieldName: FieldName) => {
        return Utils.getInstance().translateFormFieldTitle(fieldName);
    };

    const goToTransactionsModule = () => navigate("/transactions");

    const confirm = async (formData: UpdateTransactionFormSchema) => {
        await updateTransaction(formData);
    };

    const updateTransaction = async ({
        name,
        wallet,
        categories,
        carriedOut,
        amount,
        isIncome,
    }: UpdateTransactionFormSchema) => {
        if (!openedTransaction) return;

        const updateTransactionRequest =
            await TransactionsService.getInstance().updateTransaction(
                { id: openedTransaction.id },
                {
                    updateInfo: {
                        name,
                        amount,
                        carriedOut: dayjs(carriedOut).unix(),
                        categoryIds: categories,
                        isIncome,
                        walletId: wallet,
                    },
                },
            );

        if (!updateTransactionRequest.err) {
            goToTransactionsModule();
        }
    };

    const fetchData = async () => {
        setIsFetchingData(true);

        await Promise.all([
            fetchOpenedTransaction(),
            fetchTransactionCategories(),
            fetchCategoriesOfTransaction(),
            fetchWallets(),
        ]);

        setIsFetchingData(false);
    };

    const fetchOpenedTransaction = async () => {
        if (!params.id) return;

        const getTransactionResult =
            await TransactionsService.getInstance().getTransaction({ id: params.id });

        if (getTransactionResult.err) {
            // TODO: Handle err
            return;
        }

        const { name, amount, carriedOut, isIncome, walletId } =
            getTransactionResult.val.transaction;

        form.setValue(FieldName.NAME, name);
        form.setValue(FieldName.CARRIED_OUT, dayjs.unix(carriedOut).toDate());
        form.setValue(FieldName.IS_INCOME, isIncome);
        form.setValue(FieldName.WALLET, walletId);
        form.setValue(FieldName.AMOUNT, amount);

        setOpenedTransaction(getTransactionResult.val.transaction);
    };

    const fetchCategoriesOfTransaction = async () => {
        if (!params.id) return;

        const transactionCategories =
            await TransactionsService.getInstance().getCategoriesOfTransaction({
                id: params.id,
            });

        if (transactionCategories.ok) {
            setCategoriesOfTransaction(
                transactionCategories.val.map(({ id, name }) => ({ value: id, name })),
            );
        }
    };

    const fetchTransactionCategories = async () => {
        const transactionCategories =
            await TransactionsService.getInstance().getTransactionCategories();

        if (transactionCategories != undefined) {
            setTransactionCategories(transactionCategories);
        }
    };

    const fetchWallets = async () => {
        const wallets = await WalletsService.getInstance().getWalletTableRows(
            currency.id,
        );

        if (wallets.ok) {
            setWallets(wallets.val);
            // wallets.val.length > 0 && form.setValue(FieldName.WALLET, wallets.val[0].id);
        }
    };

    const createTransactionCategory = async (name: string) => {
        setIsCreatingTransactionCategory(true);

        const createdTransactionCategory =
            await TransactionsService.getInstance().createTransactionCategory({
                name,
            });

        if (createdTransactionCategory) {
            setTransactionCategories([
                ...transactionCategories,
                createdTransactionCategory,
            ]);
        }

        setIsCreatingTransactionCategory(false);
    };

    useEffect(() => {
        personalInfoSubscription = AuthService.getInstance().personalInfo$.subscribe(
            (personalInfo) => {
                setCurrency(personalInfo.settings.currency);
            },
        );

        fetchData();
    }, []);

    useEffect(
        () => () => {
            personalInfoSubscription.unsubscribe();
        },
        [],
    );

    return isFetchingData || !openedTransaction ? (
        <LoadingPage />
    ) : (
        <FormModule
            title={translate([TranslationKey.HEADER, TranslationKey.TITLE])}
            subTitle={translate([TranslationKey.HEADER, TranslationKey.SUB_TITLE], {
                name: openedTransaction.name,
            })}
            onExit={goToTransactionsModule}
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
                                {form.formState.errors.name && (
                                    <p className="text-sm font-medium text-destructive">
                                        {translate([
                                            TranslationKey.FORM,
                                            TranslationKey.ERRORS,
                                            FieldName.NAME,
                                        ])}
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row space-x-4">
                        <FormField
                            control={form.control}
                            name="wallet"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {translateFormFieldTitle(FieldName.WALLET)}
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {wallets.length > 0 ? (
                                                wallets.map(({ name, id }) => (
                                                    <SelectItem key={id} value={id}>
                                                        {name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <p className="text-sm text-center mt-3 mb-3">
                                                    {Utils.getInstance().translate([
                                                        TranslationKey.GENERAL,
                                                        TranslationKey.NO_OPTIONS,
                                                    ])}
                                                </p>
                                            )}
                                        </SelectContent>
                                    </Select>

                                    {form.formState.errors.wallet && (
                                        <p className="text-sm font-medium text-destructive">
                                            {translate([
                                                TranslationKey.FORM,
                                                TranslationKey.ERRORS,
                                                FieldName.WALLET,
                                            ])}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {translateFormFieldTitle(FieldName.CATEGORIES)}
                                    </FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            selectedOptions={categoriesOfTransaction}
                                            setSelectedOptions={(options) =>
                                                setCategoriesOfTransaction(options)
                                            }
                                            onSelect={(categories) => {
                                                field.onChange(
                                                    categories.map(({ value }) => value),
                                                );
                                            }}
                                            options={transactionCategories.map((tC) => ({
                                                name: tC.name,
                                                value: tC.id,
                                            }))}
                                            text=""
                                            isCreatingNewOption={
                                                isCreatingTransactionCategory
                                            }
                                            createNewOption={createTransactionCategory}
                                            filterInputPlaceholder={translate([
                                                TranslationKey.CATEGORIES_MULTI_SELECT,
                                                TranslationKey.FILTER_PLACEHOLDER,
                                            ])}
                                            creationErrorMessage=""
                                            creationValidatorRule="string|min:1|max:30"
                                            getCreateNewOptionButtonText={(filterValue) =>
                                                translate(
                                                    [
                                                        TranslationKey.CATEGORIES_MULTI_SELECT,
                                                        TranslationKey.CREATION_BUTTON_TEXT,
                                                    ],
                                                    { name: filterValue },
                                                )
                                            }
                                        />
                                    </FormControl>
                                    {form.formState.errors.categories && (
                                        <p className="text-sm font-medium text-destructive">
                                            {translate([
                                                TranslationKey.FORM,
                                                TranslationKey.ERRORS,
                                                FieldName.CATEGORIES,
                                            ])}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-row space-x-4">
                        <FormField
                            control={form.control}
                            name="carriedOut"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {translateFormFieldTitle(FieldName.CARRIED_OUT)}
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal w-full",
                                                        !field.value &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    {Utils.getInstance().getFormattedDateFromDate(
                                                        field.value,
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        {translateFormFieldTitle(FieldName.AMOUNT)} (
                                        {currency.symbol})
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0.01"
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
                                    {form.formState.errors.amount && (
                                        <p className="text-sm font-medium text-destructive">
                                            {translate([
                                                TranslationKey.FORM,
                                                TranslationKey.ERRORS,
                                                FieldName.AMOUNT,
                                            ])}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="isIncome"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start justify-end space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        {translateFormFieldTitle(FieldName.IS_INCOME)}
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </>
            }
        ></FormModule>
    );
};

export default TransactionUpdateModule;
