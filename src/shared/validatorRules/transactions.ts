export const createTransactionCategoryRules = {
    name: "required|string",
};

export const createTransactionBodyRules = {
    name: "required|string",
    walletId: "required|string",
    categoryId: "required|string",
    carriedOut: "required|integer",
    amount: "required|numeric|min:0.01",
    isIncome: "required|boolean",
};

export const deleteTransactionBodyRules = {
    id: "required|string",
};
