import {
    getCategoriesOfTransactionInputSchema,
    getCategoriesOfTransactionPathParametersSchema,
} from "@/shared/validatorRules/transactions";
import { z } from "zod";

export type GetCategoriesOfTransactionPathParameters = z.infer<
    typeof getCategoriesOfTransactionPathParametersSchema
>;
export type GetCategoriesOfTransactionInput = z.infer<
    typeof getCategoriesOfTransactionInputSchema
>;
