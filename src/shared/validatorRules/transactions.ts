import { z } from "zod";

import { FieldName } from "../ts-types/generic/translations";

export const createTransactionCategoryRules = {
    name: "required|string",
};

export const createTransactionBodyRules = {
    name: "required|string",
    walletId: "required|string",
    categories: "required|array",
    carriedOut: "required|integer",
    amount: "required|numeric|min:0.01",
    isIncome: "required|boolean",
};

export const createTransactionFormSchema = z.object({
    [FieldName.NAME]: z.string().min(1).max(50),
    [FieldName.WALLET]: z.string().min(1),
    [FieldName.CATEGORIES]: z.array(z.string()).min(1),
    [FieldName.AMOUNT]: z.coerce.number().min(0.01).max(999999999999),
    [FieldName.IS_INCOME]: z.boolean(),
    [FieldName.CARRIED_OUT]: z.date(),
});

export const updateTransactionFormSchema = createTransactionFormSchema;

export const getTransactionPathParametersSchema = z.object({
    id: z.string().min(1),
});

export const getTransactionInputSchema = z.object({
    pathParameters: getTransactionPathParametersSchema,
    userId: z.string().min(1),
});

export const deleteTransactionBodyRules = {
    id: "required|string",
};

export const getTransactionCategoryBalancesInputRules = {
    startDate: "required_with:endDate,wallets|integer",
    endDate: "required_with:startDate,wallets|integer",
    wallets: "required_with:endDate,startDate|array",
};

export const getTransactionCategoriesInputRules = {
    userId: "required|string",
};

export const getCategoriesOfTransactionPathParametersSchema = z.object({
    id: z.string().min(1),
});

export const getCategoriesOfTransactionInputSchema = z.object({
    pathParameters: getCategoriesOfTransactionPathParametersSchema,
    userId: z.string().min(1),
});
