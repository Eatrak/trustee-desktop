import { BehaviorSubject } from "rxjs";
import dayjs, { Dayjs } from "dayjs";

import { Currency, Transaction, TransactionCategory, Wallet } from "@ts-types/schema";
import { Utils } from "@services/utils";
import { GetTransactionsInputQueryParams } from "@ts-types/APIs/input/transactions/getTransactions";
import { GetTransactionsResponse } from "@ts-types/APIs/output/transactions/getTransactions";
import { GetWalletsResponse } from "@ts-types/APIs/output/transactions/getWallets";
import { CreateWalletResponse } from "@ts-types/APIs/output/transactions/createWallet";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import { CreateWalletBody } from "@ts-types/APIs/input/transactions/createWallet";
import { GetCurrenciesResponse } from "@ts-types/APIs/output/transactions/getCurrencies";
import { GetTransactionCategoriesResponse } from "@ts-types/APIs/output/transactions/getTransactionCategories";
import { CreateTransactionCategoryResponse } from "@ts-types/APIs/output/transactions/createTransactionCategory";
import { CreateTransactionCategoryBody } from "@ts-types/APIs/input/transactions/createTransactionCategory";
import { CreateTransactionBody } from "@ts-types/APIs/input/transactions/createTransaction";
import { CreateTransactionResponse } from "@ts-types/APIs/output/transactions/createTransactionResponse";
import { GetTotalIncomeByCurrencyResponse } from "@ts-types/APIs/output/transactions/getTotalIncomeByCurrency";
import { GetTotalExpenseByCurrencyResponse } from "@ts-types/APIs/output/transactions/getTotalExpenseByCurrency";
import { TotalExpenseByCurrency, TotalIncomeByCurrency } from "@ts-types/generic/currencies";
import { DeleteTransactionQueryParameters } from "@ts-types/APIs/input/transactions/deleteTransaction";
import { UpdateTransactionBody } from "@ts-types/APIs/input/transactions/updateTransaction";

export default class TransactionsService {
    static instance: TransactionsService = new TransactionsService();

    transactions$: BehaviorSubject<Transaction[]>;
    wallets$: BehaviorSubject<Wallet[]>;
    currencies$: BehaviorSubject<Currency[]>;
    transactionCategories$: BehaviorSubject<TransactionCategory[]>;
    totalIncomeByCurrency$: BehaviorSubject<TotalIncomeByCurrency>;
    totalExpenseByCurrency$: BehaviorSubject<TotalExpenseByCurrency>;

    private constructor() {
        this.transactions$ = new BehaviorSubject<Transaction[]>([]);
        this.wallets$ = new BehaviorSubject<Wallet[]>([]);
        this.currencies$ = new BehaviorSubject<Currency[]>([]);
        this.transactionCategories$ = new BehaviorSubject<TransactionCategory[]>([]);
        this.totalIncomeByCurrency$ = new BehaviorSubject<TotalIncomeByCurrency>({});
        this.totalExpenseByCurrency$ = new BehaviorSubject<TotalExpenseByCurrency>({});
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

            // Update monthly-wallet-balance locally
            const { walletId, transactionAmount, isIncome } = createdTransaction;
            this.updateMonthlyWalletBalanceLocally(
                walletId,
                transactionAmount,
                isIncome
            );

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

            // Update monthly-wallet-balance locally
            // const { walletId, transactionAmount, isIncome } = updatedTransaction;
            // this.updateMonthlyWalletBalanceLocally(
            //     walletId,
            //     transactionAmount,
            //     isIncome
            // );

            return true;
        }
        catch (err) {
            return false;
        }
    }

    /**
     * Update amount of a monthly-wallet-income or a monthly-wallet-expense locally.
     * 
     * @param walletId ID of the transaction wallet.
     * @param transactionAmount Amount of the transaction.
     * @param isIncome Indicates if the transaction amount is an income or an expense.
     */
    updateMonthlyWalletBalanceLocally(
        walletId: string,
        transactionAmount: number,
        isIncome: boolean
    ) {
        // Get transaction wallet
        const transactionWallet = this.wallets$.getValue().find(wallet => (
            wallet.walletId == walletId
        ));

        if (transactionWallet) {
            // Get code of the transaction currency
            const transactionCurrencyCode = transactionWallet.currencyCode;

            if (isIncome) {
                const previousTotalIncomeByCurrency = this.totalIncomeByCurrency$.getValue();
                const previousCurrencyTotalIncome = previousTotalIncomeByCurrency[transactionCurrencyCode] || 0;

                // Update monthly-wallet-income amount
                const updatedTotalIncomeByCurrency = {
                    ...previousTotalIncomeByCurrency,
                    [transactionCurrencyCode]: previousCurrencyTotalIncome + transactionAmount
                };
                this.totalIncomeByCurrency$.next(updatedTotalIncomeByCurrency);
            }
            else {
                const previousTotalExpenseByCurrency = this.totalExpenseByCurrency$.getValue();
                const previousCurrencyTotalExpense = previousTotalExpenseByCurrency[transactionCurrencyCode] || 0;

                // Update monthly-wallet-expense amount
                const updatedTotalExpenseByCurrency = {
                    ...previousTotalExpenseByCurrency,
                    [transactionCurrencyCode]: previousCurrencyTotalExpense + transactionAmount
                };
                this.totalExpenseByCurrency$.next(updatedTotalExpenseByCurrency);
            }
        }
    }

    async getTransactionsByCurrencyAndCreationRange(
        currencyCode: string,
        startCreationTimestamp: Dayjs,
        endCreationTimestamp: Dayjs
    ) {
        const queryParams: GetTransactionsInputQueryParams = {
            startCreationTimestamp: startCreationTimestamp.unix().toString(),
            endCreationTimestamp: endCreationTimestamp.unix().toString(),
            currencyCode
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

    async getTotalIncomeByCurrency() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/currencies/income");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { totalIncomeByCurrency }: GetTotalIncomeByCurrencyResponse = await response.json();

        this.totalIncomeByCurrency$.next(totalIncomeByCurrency);
    }

    async getTotalExpenseByCurrency() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/currencies/expense");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { totalExpenseByCurrency }: GetTotalExpenseByCurrencyResponse = await response.json();

        this.totalExpenseByCurrency$.next(totalExpenseByCurrency);
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
        walletId: string,
        currencyCode: string,
        transactionId: string,
        transactionTimestamp: string,
        transactionAmount: number,
        isIncome: boolean
    ): Promise<boolean> {
        // Initialize query parameters
        const queryParams: DeleteTransactionQueryParameters = {
            walletId,
            currencyCode,
            transactionId,
            transactionTimestamp
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
        this.deleteTransactionLocally(transactionId);

        // Update monthly-wallet-balance locally
        this.updateMonthlyWalletBalanceLocally(
            walletId,
            transactionAmount,
            isIncome
        );

        return true;
    }

    /**
     * Get options of the wallets with the selected currency.
     * 
     * @returns Options of the wallets with the selected currency.
     */
    getOptionsOfWalletsWithSelectedCurrency(wallets: Wallet[], selectedCurrencyCode: string) {
        const newWalletsWithSelectedCurrency = wallets.filter(wallet => {
            return wallet.currencyCode == selectedCurrencyCode;
        })
        .map(wallet => ({ name: wallet.walletName, value: wallet.walletId }));

        return newWalletsWithSelectedCurrency;
    };

    /**
     * Delete transaction by its ID locally.
     * 
     * @param idOfTransactionToDeleteLocally ID of the transaction to delete locally.
     */
    deleteTransactionLocally(idOfTransactionToDeleteLocally: string) {
        const transactionsWithoutDeletedTransaction = this.transactions$.getValue().filter(
            ({ transactionId }) => (transactionId != idOfTransactionToDeleteLocally)
        );
        this.transactions$.next([ ...transactionsWithoutDeletedTransaction ]);
    }
}
