export interface Transaction {
    userId: string,
    walletId: string,
    creationTimestamp: string,
    categoryName: string,
    transactionId: string,
    transactionName: string,
    transactionAmount: number,
    transactionDate: string,
    isIncome: boolean,
}