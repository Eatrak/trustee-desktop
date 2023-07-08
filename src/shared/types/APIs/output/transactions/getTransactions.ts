import { DocumentClientTypes } from "@typedorm/document-client";

import { Transaction } from "@ts-types/models/transactions";

export interface GetTransactionsResponse {
    transactions: Transaction[],
    cursor?: DocumentClientTypes.Key
}
