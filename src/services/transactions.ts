import { BehaviorSubject } from "rxjs";
import dayjs, { Dayjs } from "dayjs";

import { Currency, Transaction, TransactionCategory, Wallet } from "@models/transactions";
import { Utils } from "src/utils";
import { GetTransactionsInputQueryParams } from "src/shared/bodies/transactions/getTransactions";
import { GetTransactionsResponse } from "src/shared/requestInterfaces/transactions/getTransactions";
import { GetWalletsResponse } from "src/shared/requestInterfaces/transactions/getWallets";
import { CreateWalletResponse } from "src/shared/requestInterfaces/transactions/createWallet";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import { CreateWalletBody } from "src/shared/bodies/transactions/createWallet";
import { GetCurrenciesResponse } from "src/shared/requestInterfaces/transactions/getCurrencies";
import { GetTransactionCategoriesResponse } from "src/shared/requestInterfaces/transactions/getTransactionCategories";
import { CreateTransactionCategoryResponse } from "src/shared/requestInterfaces/transactions/createTransactionCategory";
import { CreateTransactionCategoryBody } from "src/shared/bodies/transactions/createTransactionCategory";

export default class TransactionsService {
    static instance: TransactionsService = new TransactionsService();

    transactions$: BehaviorSubject<Transaction[]>;
    wallets$: BehaviorSubject<Wallet[]>;
    currencies$: BehaviorSubject<Currency[]>;
    transactionCategories$: BehaviorSubject<TransactionCategory[]>;

    private constructor() {
        this.transactions$ = new BehaviorSubject<Transaction[]>([]);
        this.wallets$ = new BehaviorSubject<Wallet[]>([]);
        this.currencies$ = new BehaviorSubject<Currency[]>([]);
        this.transactionCategories$ = new BehaviorSubject<TransactionCategory[]>([]);
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

    async createWallet(createWalletBody: CreateWalletBody) {
        const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
        const response = await fetch(requestURL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            },
            body: JSON.stringify(createWalletBody)
        });
        const { createdWallet }: CreateWalletResponse = await response.json();
        const newWallets = [ createdWallet, ...this.wallets$.getValue() ];

        this.wallets$.next(newWallets);
    }

    async getCurrencies() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/currencies");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { currencies }: GetCurrenciesResponse = await response.json();

        this.currencies$.next(currencies);
    }

    async getTransactionCategories() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/transaction-categories");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { transactionCategories }: GetTransactionCategoriesResponse = await response.json();

        this.transactionCategories$.next(transactionCategories);
    }

    async createTransactionCategory(
        createTransactionCategoryBody: CreateTransactionCategoryBody
    ) {
        const requestURL = Utils.getInstance().getAPIEndpoint("/transaction-categories");
        const response = await fetch(requestURL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            },
            body: JSON.stringify(createTransactionCategoryBody)
        });
        const { createdTransactionCategory }: CreateTransactionCategoryResponse = await response.json();
        const newTransactionCategories = [ createdTransactionCategory, ...this.transactionCategories$.getValue() ];

        this.transactionCategories$.next(newTransactionCategories);
    }
}
