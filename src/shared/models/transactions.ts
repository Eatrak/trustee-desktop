export interface Transaction {
    userId: string,
    walletId: string,
    itemCreationTimestamp: string,
    categoryName: string,
    transactionId: string,
    transactionName: string,
    transactionAmount: number,
    transactionTimestamp: string,
    isIncome: boolean,
}

export interface Wallet {
    userId: string;
    walletId: string;
    walletName: string;
}

export interface Currency {
    currencyCode: string;
    currencySymbol: string;
}
