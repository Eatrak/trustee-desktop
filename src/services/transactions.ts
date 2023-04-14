import { BehaviorSubject } from "rxjs";
import dayjs, { Dayjs } from "dayjs";

import { Transaction, Wallet } from "@models/transactions";
import { Utils } from "src/utils";
import { GetTransactionsInputQueryParams } from "src/shared/bodies/transactions/getTransactions";
import { GetTransactionsResponse } from "src/shared/requestInterfaces/transactions/getTransactions";
import { GetWalletsResponse } from "src/shared/requestInterfaces/transactions/getWallets";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";

export default class TransactionsService {
    static instance: TransactionsService = new TransactionsService();

    transactions$: BehaviorSubject<Transaction[]>;
    wallets$: BehaviorSubject<Wallet[]>;

    private constructor() {
        this.transactions$ = new BehaviorSubject<Transaction[]>([]);
        this.wallets$ = new BehaviorSubject<Wallet[]>([]);
    }
    
    static getInstance() {
        return this.instance;
    }

    async getTransactionsByCreationRange(startCreationTimestamp: Dayjs, endCreationTimestamp: Dayjs) {
        const queryParams: GetTransactionsInputQueryParams = {
            startCreationTimestamp: startCreationTimestamp.unix().toString(),
            endCreationTimestamp: endCreationTimestamp.unix().toString()
        };
        const requestURL =
            Utils.getInstance().getAPIEndpoint("/transactions?") +
            new URLSearchParams({ ...queryParams });
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { transactions, cursor }: GetTransactionsResponse = await response.json();

        this.transactions$.next(transactions);

        return cursor;
    }

    async getNextTransactionsByCreationRange(cursor: DocumentClientTypes.Key) {
        const nowTimestamp = dayjs().unix().toString();
        const firstDayOfTheCurrentMonthTimestamp = dayjs().startOf("month").unix().toString();

        const queryParams: GetTransactionsInputQueryParams = {
            startCreationTimestamp: firstDayOfTheCurrentMonthTimestamp,
            endCreationTimestamp: nowTimestamp,
            cursor: JSON.stringify(cursor)
        };
        const requestURL =
            Utils.getInstance().getAPIEndpoint("/transactions?") +
            new URLSearchParams({ ...queryParams });
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { transactions, cursor: newCursor }: GetTransactionsResponse = await response.json();

        this.transactions$.next(this.transactions$.getValue().concat(transactions));

        return newCursor;
    }

    async getWallets() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { wallets }: GetWalletsResponse = await response.json();

        this.wallets$.next(wallets);
    }
}
