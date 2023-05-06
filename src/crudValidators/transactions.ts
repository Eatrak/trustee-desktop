export const createTransactionRules = {
    name: "required|string",
    wallet: "required|string",
    category: "required|string",
    creationDate: "required|string",
    value: "required|string"
};

export const createTransactionCategoryRules = {
    transactionCategoryName: "required|string"
};
