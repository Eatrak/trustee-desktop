import { z } from "zod";

import { updateTransactionFormSchema } from "@/shared/validatorRules/transactions";

export type UpdateTransactionFormSchema = z.infer<typeof updateTransactionFormSchema>;

export interface UpdateTransactionPathParameters {
    id: string;
}

export interface UpdateTransactionBody {
    updateInfo: {
        name: string;
        walletId: string;
        categoryIds: string[];
        amount: number;
        isIncome: boolean;
        carriedOut: number;
    };
}

export interface UpdateTransactionInput
    extends UpdateTransactionBody,
        UpdateTransactionPathParameters {
    userId: string;
}
