import { DocumentClientTypes } from "@typedorm/document-client";

import { Transaction } from "@models/transactions";

export interface GetTransactionsResponse {
    transactions: Transaction[],
    cursor?: DocumentClientTypes.Key
}
