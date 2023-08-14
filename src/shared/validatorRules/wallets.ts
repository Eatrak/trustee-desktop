export const deleteWalletValidator = {
    id: "required|string",
    userId: "required|string",
};

export const createWalletBodyRules = {
    name: "required|string",
    untrackedBalance: "required|numeric",
    currencyId: "required|string",
};

export const updateWalletInputRules = {
    id: "required|string",
    userId: "required|string",
    updateInfo: {
        name: "string",
    },
};
