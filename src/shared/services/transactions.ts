import { BehaviorSubject } from "rxjs";
import { Dayjs } from "dayjs";

import { Currency, Transaction, TransactionCategory, Wallet } from "@shared/schema";
import { Utils } from "@shared/services/utils";
import { GetTransactionsInputQueryParams } from "@shared/ts-types/APIs/input/transactions/getTransactions";
import { GetTransactionsResponse } from "@shared/ts-types/APIs/output/transactions/getTransactions";
import { GetWalletsResponse } from "@shared/ts-types/APIs/output/transactions/getWallets";
import { CreateWalletResponse } from "@shared/ts-types/APIs/output/transactions/createWallet";
import { CreateWalletBody } from "@shared/ts-types/APIs/input/transactions/createWallet";
import { GetCurrenciesResponse } from "@shared/ts-types/APIs/output/transactions/getCurrencies";
import { GetTransactionCategoriesResponse } from "@shared/ts-types/APIs/output/transactions/getTransactionCategories";
import { CreateTransactionCategoryResponse } from "@shared/ts-types/APIs/output/transactions/createTransactionCategory";
import { CreateTransactionCategoryBody } from "@shared/ts-types/APIs/input/transactions/createTransactionCategory";
import { CreateTransactionBody } from "@shared/ts-types/APIs/input/transactions/createTransaction";
import { CreateTransactionResponse } from "@shared/ts-types/APIs/output/transactions/createTransaction";
import { DeleteTransactionQueryParameters } from "@shared/ts-types/APIs/input/transactions/deleteTransaction";
import { GetBalanceResponse } from "@shared/ts-types/APIs/output/transactions/getBalance";
import { DeleteTransactionResponse } from "@shared/ts-types/APIs/output/transactions/deleteTransaction";
import { DeleteWalletsResponse } from "@shared/ts-types/APIs/output/transactions/deleteWallet";
import { DeleteWalletPathParameters } from "@shared/ts-types/APIs/input/transactions/deleteWallet";

export default class TransactionsService {
    static instance: TransactionsService = new TransactionsService();

    wallets$: BehaviorSubject<Wallet[]>;
    currencies$: BehaviorSubject<Currency[]>;
    transactionCategories$: BehaviorSubject<TransactionCategory[]>;

    private constructor() {
        this.wallets$ = new BehaviorSubject<Wallet[]>([]);
        this.currencies$ = new BehaviorSubject<Currency[]>([]);
        this.transactionCategories$ = new BehaviorSubject<TransactionCategory[]>([]);
    }

    static getInstance() {
        return this.instance;
    }

    /**
     * Create new transaction.
     *
     * @param input Input used to create new transaction.
     * @returns Is new transaction created.
     */
    async createTransaction(input: CreateTransactionBody) {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/transactions");
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(input),
            });

            const jsonResponse: CreateTransactionResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return false;
            }

            const { createdTransaction } = jsonResponse.data;

            return createdTransaction;
        } catch (err) {
            // TODO: handle error
        }
    }

    // /**
    //  * Update transaction.
    //  *
    //  * @param input Input used to update transaction.
    //  * @returns The transaction has been updated.
    //  */
    // async updateTransaction(input: UpdateTransactionBody): Promise<boolean> {
    //     try {
    //         const requestURL = Utils.getInstance().getAPIEndpoint("/transactions");
    //         const response = await fetch(requestURL, {
    //             method: "PUT",
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("authToken"),
    //             },
    //             body: JSON.stringify(input),
    //         });

    //         if (!response.ok) {
    //             return false;
    //         }

    //         return true;
    //     } catch (err) {
    //         return false;
    //     }
    // }

    async getTransactionsByCurrencyAndCreationRange(
        currencyId: string,
        startCreationTimestamp: Dayjs,
        endCreationTimestamp: Dayjs,
    ) {
        try {
            const queryParams: GetTransactionsInputQueryParams = {
                startCarriedOut: startCreationTimestamp.unix().toString(),
                endCarriedOut: endCreationTimestamp.unix().toString(),
                currencyId,
            };
            const requestURL =
                Utils.getInstance().getAPIEndpoint("/transactions?") +
                new URLSearchParams({ ...queryParams });
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetTransactionsResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { transactions } = jsonResponse.data;
            return transactions;
        } catch (err) {
            // TODO: handle error
        }
    }

    async getBalance(currencyId: string, startCarriedOut: Dayjs, endCarriedOut: Dayjs) {
        try {
            const queryParams: GetTransactionsInputQueryParams = {
                startCarriedOut: startCarriedOut.unix().toString(),
                endCarriedOut: endCarriedOut.unix().toString(),
                currencyId,
            };
            const requestURL =
                Utils.getInstance().getAPIEndpoint("/transactions/balance?") +
                new URLSearchParams({ ...queryParams });
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetBalanceResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const balance = jsonResponse.data;
            return balance;
        } catch (err) {
            // TODO: handle error
        }
    }

    async getWallets() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetWalletsResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { wallets } = jsonResponse.data;
            this.wallets$.next(wallets);
        } catch (err) {
            // TODO: handle error
        }
    }

    async createWallet(createWalletBody: CreateWalletBody) {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(createWalletBody),
            });

            const jsonResponse: CreateWalletResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { createdWallet } = jsonResponse.data;
            const newWallets = [createdWallet, ...this.wallets$.getValue()];

            this.wallets$.next(newWallets);
        } catch (err) {
            // TODO: handle error
        }
    }

    async getCurrencies() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/currencies");
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetCurrenciesResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { currencies } = jsonResponse.data;
            this.currencies$.next(currencies);
        } catch (err) {
            // TODO: handle error
        }
    }

    async getTransactionCategories() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                "/transaction-categories",
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetTransactionCategoriesResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { transactionCategories } = jsonResponse.data;
            this.transactionCategories$.next(transactionCategories);
        } catch (err) {
            // TODO: handle error
        }
    }

    async createTransactionCategory(
        createTransactionCategoryBody: CreateTransactionCategoryBody,
    ) {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                "/transaction-categories",
            );
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(createTransactionCategoryBody),
            });

            const jsonResponse: CreateTransactionCategoryResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { createdTransactionCategory } = jsonResponse.data;
            const newTransactionCategories = [
                createdTransactionCategory,
                ...this.transactionCategories$.getValue(),
            ];

            this.transactionCategories$.next(newTransactionCategories);
        } catch (err) {
            // TODO: handle error
        }
    }

    async deleteTransaction(id: string): Promise<boolean> {
        try {
            // Initialize query parameters
            const queryParams: DeleteTransactionQueryParameters = {
                id,
            };

            // Initialize request URL
            const requestURL =
                Utils.getInstance().getAPIEndpoint("/transactions?") +
                new URLSearchParams({ ...queryParams });

            // Send request
            const response = await fetch(requestURL, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: DeleteTransactionResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return false;
            }

            return true;
        } catch (err) {
            // TODO: handle error
            return false;
        }
    }

    async deleteWallet(id: string): Promise<boolean> {
        try {
            // Initialize query parameters
            const pathParams: DeleteWalletPathParameters = {
                id,
            };

            // Initialize request URL
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets/${pathParams.id}`,
            );

            // Send request
            const response = await fetch(requestURL, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: DeleteWalletsResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return false;
            }

            // Delete wallet locally
            const updatedWallets = this.wallets$
                .getValue()
                .filter((wallet) => wallet.id != id);
            this.wallets$.next(updatedWallets);

            return true;
        } catch (err) {
            // TODO: handle error
            return false;
        }
    }
}
