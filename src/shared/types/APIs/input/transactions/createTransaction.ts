export interface CreateTransactionBody {
    name: string,
    walletId: string,
    categoryId: string,
    carriedOut: number,
    amount: number,
    isIncome: boolean
}