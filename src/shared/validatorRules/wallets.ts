export const deleteWalletValidator = {
    id: "required|string",
    userId: "required|string",
};

export const createWalletInputRules = {
    id: "required|string",
    userId: "required|string",
    name: "string",
};

export const updateWalletInputRules = {
    id: "required|string",
    userId: "required|string",
    updateInfo: {
        name: "string",
    },
};
