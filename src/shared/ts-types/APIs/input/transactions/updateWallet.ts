import { z } from "zod";

import { updateWalletFormSchema } from "@/shared/validatorRules/wallets";

export type UpdateWalletFormSchema = z.infer<typeof updateWalletFormSchema>;

export interface UpdateWalletPathParameters {
    id: string;
}

export interface UpdateWalletUpdateInfo {
    name?: string;
    untrackedBalance?: number;
}

export interface UpdateWalletBody {
    updateInfo: UpdateWalletUpdateInfo;
}

export interface UpdateWalletInput extends UpdateWalletPathParameters, UpdateWalletBody {
    userId: string;
}
