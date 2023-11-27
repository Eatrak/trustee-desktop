import { z } from "zod";

import { FieldName } from "../ts-types/generic/translations";

export const deleteWalletValidator = {
    id: "required|string",
    userId: "required|string",
};

export const createWalletBodyRules = {
    name: "required|string",
    untrackedBalance: "required|numeric",
    currencyId: "required|string",
};

export const createWalletFormSchema = z.object({
    [FieldName.NAME]: z.string().min(1).max(50),
    [FieldName.UNTRACKED_BALANCE]: z.coerce.number().max(999999999999),
});

export const updateWalletInputRules = {
    id: "required|string",
    userId: "required|string",
    updateInfo: {
        name: "string",
    },
};
