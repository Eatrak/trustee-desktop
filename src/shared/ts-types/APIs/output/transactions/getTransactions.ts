import { Response } from "@/shared/errors/types";
import { TransactionTableRow } from "@/shared/ts-types/DTOs/transactions";

export interface GetTransactionsResponseData {
    transactions: TransactionTableRow[];
}

export type GetTransactionsResponse = Response<GetTransactionsResponseData>;
