export interface Transaction {
    userId: string,
    walletId: string,
    transactionCreationTimestamp: number,
    categoryId: string,
    transactionId: string,
    transactionName: string,
    transactionAmount: number,
    transactionTimestamp: number,
    isIncome: boolean,
}

export interface Wallet {
    userId: string;
    walletId: string;
    walletName: string;
    currencyCode: string;
}

export interface Currency {
    currencyCode: string;
    currencySymbol: string;
}

export interface TransactionCategory {
    transactionCategoryId: string,
    transactionCategoryName: string,
    userId: string
}
