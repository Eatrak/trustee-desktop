export const createTransactionBodyRules = {
    transactionName: "required|string",
    walletId: "required|string",
    categoryId: "required|string",
    transactionTimestamp: "required|integer",
    transactionAmount: "required|numeric|min:0.01",
    isIncome: "required|boolean"
};

export const createTransactionCategoryRules = {
    transactionCategoryName: "required|string"
};
