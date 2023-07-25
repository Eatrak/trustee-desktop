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

    /**
     * Create new transaction.
     *
     * @param input Input used to create new transaction.
     * @returns Is new transaction created.
     */
    async createTransaction(input: CreateTransactionBody): Promise<boolean> {
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
                return false;
            }

            const { createdTransaction } = jsonResponse.data;
            const updatedTransactions = [
                createdTransaction,
                ...this.transactions$.getValue(),
            ];

            this.transactions$.next(updatedTransactions);

            return true;
        } catch (err) {
            return false;
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
            this.transactions$.next(transactions);
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

            const jsonResponse: CreateTransactionCategoryResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return false;
            }

            // Delete transaction locally
            this.deleteTransactionLocally(id);

            return true;
        } catch (err) {
            // TODO: handle error
            return false;
        }
    }

    /**
     * Get options of the wallets with the selected currency.
     *
     * @returns Options of the wallets with the selected currency.
     */
    getOptionsOfWalletsWithSelectedCurrency(
        wallets: Wallet[],
        selectedCurrencyId: string,
    ) {
        const newWalletsWithSelectedCurrency = wallets
            .filter((wallet) => {
                return wallet.currencyId == selectedCurrencyId;
            })
            .map((wallet) => ({ name: wallet.name, value: wallet.id }));

        return newWalletsWithSelectedCurrency;
    }

    /**
     * Delete transaction by its ID locally.
     *
     * @param idOfTransactionToDeleteLocally ID of the transaction to delete locally.
     */
    deleteTransactionLocally(idOfTransactionToDeleteLocally: string) {
        const transactionsWithoutDeletedTransaction = this.transactions$
            .getValue()
            .filter(({ id }) => id != idOfTransactionToDeleteLocally);
        this.transactions$.next([...transactionsWithoutDeletedTransaction]);
    }
}
