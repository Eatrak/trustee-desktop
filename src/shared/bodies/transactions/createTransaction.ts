export interface CreateTransactionBody {
    transactionName: string,
    walletId: string,
    categoryId: string,
    transactionTimestamp: number,
    transactionAmount: number,
    isIncome: boolean
}
