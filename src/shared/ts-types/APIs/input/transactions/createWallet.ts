import { z } from "zod";

import { createWalletFormSchema } from "@/shared/validatorRules/wallets";

export interface CreateWalletBody {
    name: string;
    untrackedBalance: number;
    currencyId: string;
}

export type CreateWalletFormSchema = z.infer<typeof createWalletFormSchema>;
