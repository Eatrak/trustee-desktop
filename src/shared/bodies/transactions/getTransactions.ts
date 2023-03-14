export interface GetTransactionsInputQueryParams {
    startCreationTimestamp?: string;
    endCreationTimestamp?: string;
    cursor?: string;
}

export interface GetTransactionsInput extends GetTransactionsInputQueryParams {
    userId: string;
}
