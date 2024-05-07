import { z } from "zod";

import {
    getTransactionInputSchema,
    getTransactionPathParametersSchema,
} from "@/shared/validatorRules/transactions";

export type GetTransactionPathParameters = z.infer<
    typeof getTransactionPathParametersSchema
>;

export type GetTransactionInput = z.infer<typeof getTransactionInputSchema>;
