import { BehaviorSubject } from "rxjs";
import { Dayjs } from "dayjs";

import { Currency, Transaction, TransactionCategory, Wallet } from "@ts-types/schema";
import { Utils } from "@services/utils";
import { GetTransactionsByCurrencyAndCreationRangeInput } from "@ts-types/APIs/input/transactions/getTransactions";
import { GetTransactionsResponse } from "@ts-types/APIs/output/transactions/getTransactions";
import { GetWalletsResponse } from "@ts-types/APIs/output/transactions/getWallets";
import { CreateWalletResponse } from "@ts-types/APIs/output/transactions/createWallet";
import { CreateWalletBody } from "@ts-types/APIs/input/transactions/createWallet";
import { GetCurrenciesResponse } from "@ts-types/APIs/output/transactions/getCurrencies";
import { GetTransactionCategoriesResponse } from "@ts-types/APIs/output/transactions/getTransactionCategories";
import { CreateTransactionCategoryResponse } from "@ts-types/APIs/output/transactions/createTransactionCategory";
import { CreateTransactionCategoryBody } from "@ts-types/APIs/input/transactions/createTransactionCategory";
import { CreateTransactionBody } from "@ts-types/APIs/input/transactions/createTransaction";
import { CreateTransactionResponse } from "@ts-types/APIs/output/transactions/createTransactionResponse";
import { DeleteTransactionQueryParameters } from "@ts-types/APIs/input/transactions/deleteTransaction";
import { UpdateTransactionBody } from "@ts-types/APIs/input/transactions/updateTransaction";

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
                    "Authorization": "Bearer " + localStorage.getItem("authToken")
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                return false;
            }

            const { createdTransaction }: CreateTransactionResponse = await response.json();
            const updatedTransactions = [ createdTransaction, ...this.transactions$.getValue() ];

            this.transactions$.next(updatedTransactions);

            return true;
        }
        catch (err) {
            return false;
        }
    }

    /**
     * Update transaction.
     * 
     * @param input Input used to update transaction.
     * @returns The transaction has been updated.
     */
    async updateTransaction(input: UpdateTransactionBody): Promise<boolean> {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/transactions");
            const response = await fetch(requestURL, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("authToken")
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                return false;
            }

            return true;
        }
        catch (err) {
            return false;
        }
    }

    async getTransactionsByCurrencyAndCreationRange(
        currencyId: string,
        startCreationTimestamp: Dayjs,
        endCreationTimestamp: Dayjs
    ) {
        const queryParams: GetTransactionsByCurrencyAndCreationRangeInput = {
            startCarriedOut: startCreationTimestamp.unix().toString(),
            endCarriedOut: endCreationTimestamp.unix().toString(),
            currencyId
        };
        const requestURL =
            Utils.getInstance().getAPIEndpoint("/transactions?") +
            new URLSearchParams({ ...queryParams });
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { transactions }: GetTransactionsResponse = await response.json();

        this.transactions$.next(transactions);
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

    async deleteTransaction(
        id: string
    ): Promise<boolean> {
        // Initialize query parameters
        const queryParams: DeleteTransactionQueryParameters = {
            id
        };

        // Initialize request URL
        const requestURL =
            Utils.getInstance().getAPIEndpoint("/transactions?") +
            new URLSearchParams({ ...queryParams });

        // Send request
        const response = await fetch(requestURL, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });

        if (!response.ok) {
            return false;
        }

        // Delete transaction locally
        this.deleteTransactionLocally(id);

        return true;
    }

    /**
     * Get options of the wallets with the selected currency.
     * 
     * @returns Options of the wallets with the selected currency.
     */
    getOptionsOfWalletsWithSelectedCurrency(wallets: Wallet[], selectedCurrencyId: string) {
        const newWalletsWithSelectedCurrency = wallets.filter(wallet => {
            return wallet.currencyId == selectedCurrencyId;
        })
        .map(wallet => ({ name: wallet.name, value: wallet.id }));

        return newWalletsWithSelectedCurrency;
    };

    /**
     * Delete transaction by its ID locally.
     * 
     * @param idOfTransactionToDeleteLocally ID of the transaction to delete locally.
     */
    deleteTransactionLocally(idOfTransactionToDeleteLocally: string) {
        const transactionsWithoutDeletedTransaction = this.transactions$.getValue().filter(
            ({ id }) => (id != idOfTransactionToDeleteLocally)
        );
        this.transactions$.next([ ...transactionsWithoutDeletedTransaction ]);
    }
}
