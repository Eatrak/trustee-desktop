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